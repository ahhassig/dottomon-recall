import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,transition,assertState,cityComplete,remainingAt,locationStatus} from '../engine.js';
import {CITY_IDS,PALACE_IDS} from '../data/locations.js';
import {hintFor} from '../data/dialogue.js';
import {ENDINGS} from '../data/endings.js';

function game(roll=()=>0.1) {
  let s=initialState();
  return {get s(){return s;},set s(value){s=value;},do(type,params={}){s=transition(s,{type,...params},roll);assertState(s);return s;}};
}
function start(g) {g.do('BEGIN');for(let i=0;i<3;i++)g.do('INTRO_NEXT');}
function visit(g,id){return g.do('VISIT',{id});}
function capture(g,method='safe'){g.do('CAPTURE',{method});if(g.s.phase==='result')g.do('CONTINUE');}
function city(g,method='safe'){visit(g,'pastry');capture(g);capture(g);visit(g,'alchemy');capture(g,method);}
function palace(g,method='safe'){visit(g,'palace');g.do('MAP');for(const id of PALACE_IDS.filter(x=>x!=='depot')){visit(g,id);capture(g,method);}}

test('Intro and reading do not move the clock; early actions are rejected',()=>{
 const g=game();const original=g.s;g.do('CAPTURE',{method:'safe'});assert.equal(g.s,original);start(g);assert.equal(g.s.timeRemaining,1800);assert.equal(g.s.phase,'map');
});
test('Safe-only route recovers seven, no stress, good ending, exact 24:15',()=>{
 const g=game();start(g);city(g);assert.equal(g.s.recovered,3);palace(g);assert.equal(g.s.ending,'good');assert.equal(g.s.timeRemaining,1455);assert.equal(g.s.cigarettes,0);
});
test('Guaranteed route: five risky choices, two cigarettes, 50 stress, exact 22:15',()=>{
 const g=game();start(g);city(g,'risky');palace(g,'risky');assert.equal(g.s.ending,'good');assert.equal(g.s.cigarettes,2);assert.equal(g.s.stress,50);assert.equal(g.s.timeRemaining,1335);
});
test('Pastry tutorial succeeds independently and never calls randomness',()=>{
 const g=game(()=>{throw Error('Tutorial must not roll');});start(g);visit(g,'pastry');g.do('CAPTURE',{method:'safe'});assert.equal(g.s.recovered,1);assert.equal(g.s.timeRemaining,1755);g.do('CONTINUE');g.do('CAPTURE',{method:'safe'});assert.equal(g.s.recovered,2);assert.equal(g.s.stress,0);assert.equal(locationStatus(g.s,'pastry'),'SECURED');
});
test('Failure stays in the same location; repeat captures are guarded',()=>{
 const g=game(()=>0.9);start(g);visit(g,'alchemy');g.do('CAPTURE',{method:'safe'});assert.equal(g.s.recovered,0);assert.equal(g.s.stress,50);assert.equal(g.s.timeRemaining,1740);const old=structuredClone(g.s);g.do('CAPTURE',{method:'risky'});assert.deepEqual(g.s,old);g.do('CONTINUE');assert.equal(g.s.location,'alchemy');assert.equal(remainingAt(g.s,'alchemy').length,1);
});
test('50/50 boundary uses strictly less than 0.5',()=>{
 for(const [value,recovered] of [[0,1],[0.499999,1],[0.5,0],[0.9999,0]]){const g=game(()=>value);start(g);visit(g,'alchemy');g.do('CAPTURE',{method:'safe'});assert.equal(g.s.recovered,recovered);}
});
test('Second stress event automatically charges precisely one 60s break',()=>{
 const g=game(()=>0.9);start(g);visit(g,'alchemy');capture(g);g.do('CAPTURE',{method:'safe'});assert.equal(g.s.cigarettes,1);assert.equal(g.s.stress,0);assert.equal(g.s.timeRemaining,1650);assert.equal(g.s.result.cost,90);assert.equal(g.s.result.smoking,true);g.do('CONTINUE');assert.equal(g.s.timeRemaining,1650);
});
test('Five completed breaks arm the secret, the eleventh stress event triggers without a sixth cigarette',()=>{
 const g=game(()=>0.9);start(g);visit(g,'alchemy');for(let i=0;i<10;i++)capture(g);assert.equal(g.s.cigarettes,5);assert.equal(g.s.secretEndingArmed,true);assert.equal(g.s.ending,null);assert.equal(g.s.timeRemaining,1170);capture(g);assert.equal(g.s.ending,'secret');assert.equal(g.s.cigarettes,5);assert.equal(g.s.stress,0);assert.equal(g.s.recovered,0);assert.equal(g.s.timeRemaining,1140);
});
test('Secret trigger A: seventh safe capture after five breaks',()=>{
 let failing=false;const g=game(()=>failing?0.9:0.1);start(g);city(g);visit(g,'palace');g.do('MAP');for(const id of ['archives','operations','service']){visit(g,id);capture(g);}
 visit(g,'reagents');failing=true;for(let i=0;i<10;i++)capture(g);assert.equal(g.s.recovered,6);assert.equal(g.s.ending,null);failing=false;capture(g);assert.equal(g.s.recovered,7);assert.equal(g.s.ending,'secret');
});
test('Final risky capture causing fifth break yields secret, not good',()=>{
 let failing=false;const g=game(()=>failing?0.9:0.1);start(g);city(g);visit(g,'palace');g.do('MAP');for(const id of ['archives','operations','service']){visit(g,id);capture(g);}
 visit(g,'reagents');failing=true;for(let i=0;i<9;i++)capture(g);assert.equal(g.s.cigarettes,4);assert.equal(g.s.stress,50);capture(g,'risky');assert.equal(g.s.recovered,7);assert.equal(g.s.cigarettes,5);assert.equal(g.s.ending,'secret');
});
test('Secret precedence beats simultaneous timer exhaustion',()=>{
 const g=game(()=>0.9);start(g);visit(g,'alchemy');for(let i=0;i<10;i++)capture(g);g.s.timeRemaining=1;capture(g);assert.equal(g.s.timeRemaining,0);assert.equal(g.s.ending,'secret');
});
test('Final capture beats timer exhaustion, as specified',()=>{
 const g=game();start(g);city(g);visit(g,'palace');g.do('MAP');for(const id of ['archives','operations','service']){visit(g,id);capture(g);}visit(g,'reagents');g.s.timeRemaining=1;capture(g);assert.equal(g.s.timeRemaining,0);assert.equal(g.s.ending,'good');
});
test('Time cannot pass on map-only, invalid, or reading actions',()=>{
 const g=game();start(g);visit(g,'market');const t=g.s.timeRemaining;g.do('MAP');for(let i=0;i<10;i++)g.do('NOT_AN_ACTION');assert.equal(g.s.timeRemaining,t);assert.equal(g.s.stress,0);
});
test('Every empty decoy charges travel + 30s search and becomes CLEARED',()=>{
 const g=game();start(g);assert.equal(locationStatus(g.s,'market'),'UNEXPLORED');visit(g,'market');assert.equal(g.s.timeRemaining,1740);assert.equal(locationStatus(g.s,'market'),'CLEARED');g.do('MAP');visit(g,'promenade');assert.equal(g.s.timeRemaining,1665);g.do('MAP');city(g);visit(g,'palace');g.do('MAP');const before=g.s.timeRemaining;visit(g,'depot');assert.equal(g.s.timeRemaining,before-60);assert.equal(locationStatus(g.s,'depot'),'CLEARED');assert.equal(g.s.stress,0);
});
test('Revisits cannot duplicate captures or release recovered assistants',()=>{
 const g=game();start(g);visit(g,'pastry');capture(g);capture(g);visit(g,'pastry');const before=structuredClone(g.s);capture(g);assert.deepEqual(g.s,before);assert.equal(g.s.recovered,2);
});
test('Palace cannot unlock with wrong count or bypass city identities',()=>{
 const g=game();start(g);visit(g,'palace');assert.equal(g.s.palaceEntered,false);visit(g,'archives');assert.equal(g.s.location,'plaza');visit(g,'alchemy');capture(g);visit(g,'pastry');capture(g);g.do('MAP');visit(g,'palace');assert.equal(g.s.palaceEntered,false);visit(g,'pastry');capture(g);assert.equal(cityComplete(g.s),true);visit(g,'palace');assert.equal(g.s.phase,'scatter');assert.equal(g.s.palaceEntered,true);assert.equal(g.s.region,'palace');
});
test('City locations and repeat Palace entry are inaccessible after entering',()=>{
 const g=game();start(g);city(g);visit(g,'palace');g.do('MAP');const before=structuredClone(g.s);visit(g,'market');visit(g,'palace');assert.deepEqual(g.s,before);
});
test('City timeout route is reachable through ordinary visits',()=>{
 const g=game();start(g);for(let i=0;i<30;i++){visit(g,'market');if(!g.s.ending)g.do('MAP');}assert.equal(g.s.timeRemaining,0);assert.equal(g.s.ending,'home');assert.equal(g.s.palaceEntered,false);
});
test('Palace timeout sends only uncaptured Dottomons, for all four possible counts',()=>{
 for(let n=0;n<4;n++) {const g=game();start(g);city(g);visit(g,'palace');g.do('MAP');for(const id of ['archives','operations','service'].slice(0,n)){visit(g,id);capture(g);}while(!g.s.ending){visit(g,'depot');if(!g.s.ending)g.do('MAP');}assert.equal(g.s.ending,'breach');assert.equal(g.s.endingSummary.uncapturedPalace.length,4-n);const narrative=ENDINGS.breach.lines(g.s).join(' ');if(n>0)assert.equal(narrative.includes('The archivist brings'),false);}
});
test('Entering Palace at the time boundary records arrival before timeout',()=>{
 const g=game();start(g);city(g);g.s.timeRemaining=60;visit(g,'palace');assert.equal(g.s.ending,'breach');assert.equal(g.s.timeRemaining,0);assert.equal(g.s.palaceEntered,true);
});
test('Manual return home is bad 1 in every active phase, even when secret is armed',()=>{
 for(const phase of ['map','encounter','result','scatter']){const g=game();start(g);city(g);visit(g,'palace');g.s.phase=phase;g.do('RETURN_HOME');assert.equal(g.s.ending,'home');}
 const g=game(()=>0.9);start(g);visit(g,'alchemy');for(let i=0;i<10;i++)capture(g);g.do('RETURN_HOME');assert.equal(g.s.ending,'home');
});
test('One call per person costs 20s; repeated and unknown calls do nothing',()=>{
 const g=game();start(g);for(const person of ['marina','albedo','durin']){const before=g.s.timeRemaining;g.do('CALL',{person});assert.equal(g.s.timeRemaining,before-20);assert.equal(g.s[person+'HintUsed'],true);assert.ok(hintFor(person,g.s).text.length>30);g.do('CALL',{person});assert.equal(g.s.timeRemaining,before-20);g.do('CLOSE_HINT');}const before=structuredClone(g.s);g.do('CALL',{person:'zandik'});assert.deepEqual(g.s,before);assert.equal(g.s.stress,0);
});
test('Hint timeout resolves proper ending and clears pending hint',()=>{
 const g=game();start(g);g.s.timeRemaining=20;g.do('CALL',{person:'durin'});assert.equal(g.s.ending,'home');assert.equal(g.s.hint,null);
});
test('Contextual hints still help when just one Palace fugitive remains',()=>{
 for(const last of ['archives','operations','service','reagents']){const g=game();start(g);city(g);visit(g,'palace');g.do('MAP');for(const id of ['archives','operations','service','reagents'].filter(x=>x!==last)){visit(g,id);capture(g);}for(const who of ['marina','albedo','durin'])assert.ok(hintFor(who,g.s).text.length>50);}
});
test('All four endings freeze state and replay resets every flag, list, count, and hint',()=>{
 for(const ending of ['good','secret','home','breach']){const g=game();start(g);g.do('CALL',{person:'marina'});city(g);g.s.ending=ending;g.s.phase='ending';const before=structuredClone(g.s);g.do('CALL',{person:'albedo'});g.do('VISIT',{id:'palace'});g.do('CAPTURE',{method:'risky'});g.do('RETURN_HOME');assert.deepEqual(g.s,before);g.do('RESET');assert.deepEqual(g.s,initialState());}
});
test('Thousands of adversarial action sequences preserve invariants',()=>{
 let seed=147;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const visitedEndings=new Set();
 for(let run=0;run<200;run++){
   const g=game(random);start(g);
   for(let step=0;step<150&&!g.s.ending;step++){
     const s=g.s;
     if(random()<.01){g.do('RETURN_HOME');continue;}
     if(random()<.08){g.do('CALL',{person:['marina','albedo','durin'][Math.floor(random()*3)]});continue;}
     if(s.phase==='map'){const choices=s.palaceEntered?PALACE_IDS:[...CITY_IDS,...(cityComplete(s)?['palace']:[])];visit(g,choices[Math.floor(random()*choices.length)]);}
     else if(s.phase==='scatter')g.do('MAP');
     else if(s.phase==='result')g.do('CONTINUE');
     else if(s.phase==='encounter'){if(remainingAt(s,s.location).length)g.do('CAPTURE',{method:s.location==='pastry'||random()<.7?'safe':'risky'});else g.do('MAP');}
   }
   if(g.s.ending)visitedEndings.add(g.s.ending);
 }
 assert.ok(visitedEndings.has('good'));assert.ok(visitedEndings.has('home'));assert.ok(visitedEndings.has('breach'));
});
