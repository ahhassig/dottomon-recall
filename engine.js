import {LOCATIONS,ALL_DOTTOMONS,COSTS,MISSION_SECONDS,SAFE_CHANCE} from './data/locations.js?v=0.5';
import {assignLocations,POOLS,assignedAt,remainingAt,remainingPalace,cityComplete,cityReady,missionTotal} from './data/placements.js?v=0.5';
import {chooseHint} from './data/hints.js?v=0.5';
export {remainingAt,remainingPalace,cityComplete,cityReady,missionTotal};
export function initialState() {
  return {phase:'title',intro:0,region:'city',location:'plaza',timeRemaining:MISSION_SECONDS,stress:0,
    cigarettes:0,criticalEpisodes:0,recovered:0,capturedDottomons:[],palaceEntered:false,
    placements:{},extraRevealed:false,recountPending:false,coldPlunge:false,
    locationsVisited:{},marinaHintUsed:false,albedoHintUsed:false,durinHintUsed:false,
    hint:null,hintDetails:{},attempts:{},result:null,ending:null,endingSummary:null};
}
export function locationStatus(s,id) {
  if(!s.locationsVisited[id]) return 'UNEXPLORED';
  if(!assignedAt(s,id).length) return 'CLEARED';
  return remainingAt(s,id).length?'SIGHTED':'SECURED';
}
export const isPlaying=s=>['map','encounter','result','scatter'].includes(s.phase);
function spend(s,seconds){s.timeRemaining=Math.max(0,s.timeRemaining-seconds);}
function finish(s,id) {
  s.ending=id;s.phase='ending';s.hint=null;
  s.endingSummary={timeRemaining:s.timeRemaining,recovered:s.recovered,total:missionTotal(s),
    cigarettes:s.cigarettes,criticalEpisodes:s.criticalEpisodes,
    hintsUsed:['marina','albedo','durin'].filter(person=>s[person+'HintUsed']).length,uncapturedPalace:remainingPalace(s)};
}
// Sixth critical episode > final recovery > timeout. Five cigarettes alone do not trigger Secret.
function checkEnding(s,secret=false) {
  if(secret) finish(s,'secret');
  else if(s.extraRevealed&&s.recovered===missionTotal(s)) finish(s,'good');
  else if(s.timeRemaining<=0) finish(s,s.palaceEntered?'breach':'home');
}
function stressEvent(s,risky) {
  s.stress=risky?100:s.stress+50;
  if(s.stress<100) return false;
  s.criticalEpisodes++;
  if(s.criticalEpisodes===6) return true; // No sixth completed cigarette or normal break cost.
  spend(s,COSTS.smoking);s.stress=0;s.cigarettes++;s.result.smoking=true;
  return false;
}
function leaveResult(s) {
  if(s.recountPending) {
    s.recountPending=false;s.extraRevealed=true;s.phase='recount';s.location='plaza';
    // Both candidates may have changed since the first sweep. Never expose which one did.
    delete s.locationsVisited.plaza;delete s.locationsVisited.courier;
  } else if(remainingAt(s,s.location).length) s.phase='encounter';
  else {s.phase='map';s.location=s.palaceEntered?'lobby':'plaza';}
  s.result=null;
}
/** Pure transitions own all mission state; injected randomness makes runs reproducible in tests. */
export function transition(previous,action,random=Math.random) {
  if(action.type==='RESET') return initialState();
  const s=structuredClone(previous);
  if(action.type==='BEGIN'&&s.phase==='title'){s.placements=assignLocations(random);s.phase='opening';return s;}
  if(action.type==='INTRO_NEXT'&&s.phase==='opening'){if(s.intro<2)s.intro++;else s.phase='map';return s;}
  if(action.type==='RECOUNT_NEXT'&&s.phase==='recount'){s.phase='map';return s;}
  if(!isPlaying(s)) return previous;
  if(action.type==='RETURN_HOME'){checkEnding(s);if(!s.ending)finish(s,'home');return s;}
  if(action.type==='CALL') {
    const key=action.person+'HintUsed';
    if(!['marina','albedo','durin'].includes(action.person)||s[key])return previous;
    s.hintDetails[action.person]=chooseHint(action.person,s);s[key]=true;s.hint=action.person;
    spend(s,COSTS.call);checkEnding(s);return s;
  }
  if(action.type==='CLOSE_HINT'){s.hint=null;return s;}
  if(action.type==='MAP'&&['encounter','result','scatter'].includes(s.phase)) {
    if(s.recountPending)leaveResult(s);
    else {s.phase='map';s.location=s.palaceEntered?'lobby':'plaza';s.result=null;}
    return s;
  }
  if(action.type==='VISIT'&&s.phase==='map') {
    if(action.id==='palace') {
      if(s.palaceEntered||!cityReady(s))return previous;
      spend(s,COSTS.palace);s.palaceEntered=true;s.region='palace';s.location='lobby';s.phase='scatter';s.result=null;checkEnding(s);return s;
    }
    const place=LOCATIONS[action.id];
    if(!place||place.region!==s.region||(action.id==='plaza'&&!s.extraRevealed))return previous;
    s.location=action.id;s.locationsVisited[action.id]=true;s.result=null;spend(s,place.travel);
    if(!assignedAt(s,action.id).length)spend(s,COSTS.search);
    s.phase='encounter';checkEnding(s);return s;
  }
  if(action.type==='CAPTURE'&&s.phase==='encounter') {
    if(!['safe','risky'].includes(action.method))return previous;
    const target=remainingAt(s,s.location)[0];if(!target)return previous;
    const success=action.method==='risky'||random()<SAFE_CHANCE;
    const baseCost=success?COSTS.capture:COSTS.failure;
    s.result={success,method:action.method,target,smoking:false,cost:baseCost,unlocked:false};
    s.attempts[s.location]=(s.attempts[s.location]||0)+1;spend(s,baseCost);
    if(success) {
      s.capturedDottomons.push(target);
      if(target==='tea-one'&&!s.capturedDottomons.includes('tea-two')) {
        s.capturedDottomons.push('tea-two');spend(s,COSTS.capture);s.result.cost+=COSTS.capture;s.result.partnerFollowed=true;
      }
      s.recovered=s.capturedDottomons.length;
    }
    if(!success&&target==='dottoling'&&s.location==='plaza')s.coldPlunge=true;
    const secret=(!success||action.method==='risky')?stressEvent(s,action.method==='risky'):false;
    if(s.result.smoking)s.result.cost+=COSTS.smoking;
    if(!cityComplete(previous)&&cityComplete(s))s.recountPending=true;
    s.result.unlocked=!cityReady(previous)&&cityReady(s);
    s.phase='result';checkEnding(s,secret);return s;
  }
  if(action.type==='CONTINUE'&&s.phase==='result'){leaveResult(s);return s;}
  return previous;
}
export function assertState(s) {
  if(!Number.isInteger(s.timeRemaining)||s.timeRemaining<0||s.timeRemaining>MISSION_SECONDS)throw Error('Invalid time');
  if(![0,50].includes(s.stress)&&!(s.ending==='secret'&&s.stress===100))throw Error('Invalid settled stress');
  if(s.cigarettes<0||s.cigarettes>5)throw Error('Invalid cigarette count');
  if(s.criticalEpisodes!==s.cigarettes+(s.ending==='secret'?1:0))throw Error('Critical episode mismatch');
  if(new Set(s.capturedDottomons).size!==s.recovered||s.capturedDottomons.length!==s.recovered)throw Error('Duplicate capture');
  if(s.capturedDottomons.some(id=>!ALL_DOTTOMONS.includes(id)))throw Error('Unknown Dottomon');
  if(s.capturedDottomons.includes('tea-one')!==s.capturedDottomons.includes('tea-two'))throw Error('Separated date');
  if(s.capturedDottomons.includes('dottoling')&&!s.extraRevealed)throw Error('Premature extra capture');
  if(s.palaceEntered&&!cityReady(s))throw Error('Palace entered too early');
  if((s.region==='palace')!==s.palaceEntered)throw Error('Region mismatch');
  if((s.phase==='ending')!==Boolean(s.ending))throw Error('Ending phase mismatch');
  if(s.phase!=='title') {
    for(const [id,pool]of Object.entries(POOLS))if(!pool.includes(s.placements[id]))throw Error('Invalid assignment');
    if(s.placements['tea-two']!==s.placements['tea-one'])throw Error('Separated placement');
    if(new Set(Object.entries(s.placements).filter(([id])=>id!=='tea-two').map(([,loc])=>loc)).size!==7)throw Error('Conflicting placement');
  }
  return true;
}
