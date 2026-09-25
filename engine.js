import { LOCATIONS, CITY_DOTTOMONS, PALACE_DOTTOMONS, ALL_DOTTOMONS, COSTS, MISSION_SECONDS, SAFE_CHANCE } from './data/locations.js?v=0.2';

export function initialState() {
  return {phase:'title', intro:0, region:'city', location:'plaza', timeRemaining:MISSION_SECONDS, stress:0,
    cigarettes:0, recovered:0, capturedDottomons:[], palaceEntered:false, secretEndingArmed:false,
    locationsVisited:{}, marinaHintUsed:false, albedoHintUsed:false, durinHintUsed:false,
    hint:null, attempts:{}, result:null, ending:null, endingSummary:null};
}
export const cityComplete = s => CITY_DOTTOMONS.every(id => s.capturedDottomons.includes(id));
export const remainingAt = (s,id) => (LOCATIONS[id]?.dottomons || []).filter(x => !s.capturedDottomons.includes(x));
export const remainingPalace = s => PALACE_DOTTOMONS.filter(x => !s.capturedDottomons.includes(x));
export function locationStatus(s,id) {
  if (!s.locationsVisited[id]) return 'UNEXPLORED';
  if (!LOCATIONS[id].dottomons.length) return 'CLEARED';
  return remainingAt(s,id).length ? 'SIGHTED' : 'SECURED';
}
export const isPlaying = s => ['map','encounter','result','scatter'].includes(s.phase);
function spend(s, seconds) { s.timeRemaining = Math.max(0,s.timeRemaining-seconds); }
function finish(s, id) {
  s.ending = id;
  s.endingSummary = {timeRemaining:s.timeRemaining, recovered:s.recovered, cigarettes:s.cigarettes,
    uncapturedPalace:remainingPalace(s)};
  s.phase = 'ending';
  s.hint = null;
}
// All actions are atomic. On simultaneous outcomes: secret > seventh capture > timeout.
function checkEnding(s, secretTriggered=false) {
  if (secretTriggered || (s.secretEndingArmed && s.recovered === 7)) finish(s,'secret');
  else if (s.recovered === 7) finish(s,'good');
  else if (s.timeRemaining <= 0) finish(s,s.palaceEntered ? 'breach' : 'home');
}
function stressEvent(s, risky=false) {
  if (s.secretEndingArmed) return true;
  s.stress = risky ? 100 : s.stress + 50;
  if (s.stress >= 100) {
    spend(s,COSTS.smoking);
    s.stress = 0;
    s.cigarettes++;
    s.result.smoking = true;
    if (s.cigarettes === 5) s.secretEndingArmed = true;
  }
  return false;
}

/** Pure transition function: the only owner of mission time and capture state. */
export function transition(previous, action, random=Math.random) {
  const s = structuredClone(previous);
  if (action.type === 'RESET') return initialState();
  if (action.type === 'BEGIN' && s.phase === 'title') {s.phase='opening'; return s;}
  if (action.type === 'INTRO_NEXT' && s.phase === 'opening') {
    if (s.intro < 2) s.intro++; else s.phase='map';
    return s;
  }
  if (!isPlaying(s)) return previous;
  if (action.type === 'RETURN_HOME') {checkEnding(s); if (!s.ending) finish(s,'home'); return s;}
  if (action.type === 'CALL') {
    const key = `${action.person}HintUsed`;
    if (!['marina','albedo','durin'].includes(action.person) || s[key]) return previous;
    s[key]=true; s.hint=action.person; spend(s,COSTS.call); checkEnding(s); return s;
  }
  if (action.type === 'CLOSE_HINT') {s.hint=null; return s;}
  if (action.type === 'MAP' && ['encounter','result','scatter'].includes(s.phase)) {
    s.phase='map'; s.location=s.palaceEntered?'lobby':'plaza'; s.result=null; return s;
  }
  if (action.type === 'VISIT' && s.phase === 'map') {
    if (action.id === 'palace') {
      if (s.palaceEntered || !cityComplete(s)) return previous;
      spend(s,COSTS.palace); s.palaceEntered=true; s.region='palace'; s.location='lobby';
      s.phase='scatter'; s.result=null; checkEnding(s); return s;
    }
    const place = LOCATIONS[action.id];
    if (!place || place.region !== s.region) return previous;
    s.location=action.id; s.locationsVisited[action.id]=true; s.result=null;
    spend(s,place.travel);
    if (!place.dottomons.length) spend(s,COSTS.search);
    s.phase='encounter'; checkEnding(s); return s;
  }
  if (action.type === 'CAPTURE' && s.phase === 'encounter') {
    if (!['safe','risky'].includes(action.method)) return previous;
    const target = remainingAt(s,s.location)[0];
    if (!target) return previous;
    const success = action.method==='risky' || random()<SAFE_CHANCE;
    const baseCost = success ? COSTS.capture : COSTS.failure;
    s.result={success,method:action.method,target,smoking:false,cost:baseCost,unlocked:false};
    s.attempts[s.location]=(s.attempts[s.location]||0)+1;
    spend(s,baseCost);
    if (success) {s.capturedDottomons.push(target); s.recovered=s.capturedDottomons.length;}
    let secretTriggered=false;
    if (!success || action.method==='risky') secretTriggered=stressEvent(s,action.method==='risky');
    if (s.result.smoking) s.result.cost+=COSTS.smoking;
    s.result.unlocked = !cityComplete(previous) && cityComplete(s);
    s.phase='result'; checkEnding(s,secretTriggered); return s;
  }
  if (action.type === 'CONTINUE' && s.phase==='result') {
    if (remainingAt(s,s.location).length) s.phase='encounter';
    else {s.phase='map';s.location=s.palaceEntered?'lobby':'plaza';}
    s.result=null; return s;
  }
  return previous;
}

export function assertState(s) {
  if (!Number.isInteger(s.timeRemaining) || s.timeRemaining<0 || s.timeRemaining>MISSION_SECONDS) throw Error('Invalid time');
  if (![0,50].includes(s.stress)) throw Error('Stress must settle to 0 or 50');
  if (s.cigarettes<0 || s.cigarettes>5) throw Error('Invalid cigarette count');
  if (s.secretEndingArmed !== (s.cigarettes===5)) throw Error('Secret arming mismatch');
  if (new Set(s.capturedDottomons).size!==s.recovered || s.capturedDottomons.length!==s.recovered) throw Error('Duplicate capture');
  if (s.capturedDottomons.some(x=>!ALL_DOTTOMONS.includes(x))) throw Error('Unknown Dottomon');
  if (s.palaceEntered && !cityComplete(s)) throw Error('Palace entered too early');
  if ((s.region==='palace') !== s.palaceEntered) throw Error('Region mismatch');
  if ((s.phase==='ending') !== Boolean(s.ending)) throw Error('Ending phase mismatch');
  return true;
}
