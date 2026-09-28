// Reproducible engine simulations, not a substitute for human pacing feedback.
// Search policy uses only discovered map state and the objectives the player knows.
import {initialState,transition,assertState,remainingAt,cityComplete,cityReady} from '../engine.js';
import {CITY_IDS,PALACE_IDS} from '../data/locations.js';
const count=1000;
for(const policy of ['safe','one-fail-then-risky','risky']) {
  let seed=20260928;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const outcomes={good:0,secret:0,home:0,breach:0},times=[],actions=[];
  for(let run=0;run<count;run++) {
    let s=initialState(),steps=0;
    const act=(type,data={})=>{s=transition(s,{type,...data},random);assertState(s);};
    act('BEGIN');for(let i=0;i<3;i++)act('INTRO_NEXT');
    while(!s.ending&&steps++<200) {
      if(s.phase==='recount'){act('RECOUNT_NEXT');continue;}
      if(s.phase==='scatter'){act('MAP');continue;}
      if(s.phase==='result'){act('CONTINUE');continue;}
      if(s.phase==='encounter'){
        if(!remainingAt(s,s.location).length){act('MAP');continue;}
        const method=policy==='risky'||policy==='one-fail-then-risky'&&(s.attempts[s.location]||0)>0?'risky':'safe';
        act('CAPTURE',{method});continue;
      }
      if(!s.palaceEntered&&cityReady(s)){act('VISIT',{id:'palace'});continue;}
      const region=s.palaceEntered?PALACE_IDS:cityComplete(s)?['plaza','courier']:CITY_IDS;
      const choices=region.filter(id=>!s.locationsVisited[id]);
      if(!choices.length)throw Error('No available search route');
      act('VISIT',{id:choices[Math.floor(random()*choices.length)]});
    }
    if(!s.ending)throw Error('Stranded run');outcomes[s.ending]++;actions.push(steps);
    if(s.ending==='good')times.push(s.timeRemaining);
  }
  const mean=xs=>xs.length?Math.round(xs.reduce((a,b)=>a+b,0)/xs.length):null;
  console.log(JSON.stringify({policy,runs:count,outcomes,goodMeanSeconds:mean(times),goodMinSeconds:times.length?Math.min(...times):null,goodMaxSeconds:times.length?Math.max(...times):null,meanActions:mean(actions)}));
}
