import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {initialState,transition,remainingPalace} from '../engine.js';
import {POOLS,VALID_PLACEMENTS} from '../data/placements.js';
import {PALACE_DOTTOMONS,ALL_DOTTOMONS,MISSION_SECONDS} from '../data/locations.js';
import {PALACE_LINKS,PALACE_POSITIONS} from '../data/palace.js';
import {EXTRAS,REACTIONS} from '../data/personality.js';
import {encounterFor,VARIANTS} from '../data/encounters.js';
import {ENDINGS} from '../data/endings.js';
import {createProgress,ACHIEVEMENT_KEY} from '../progress.js';

test('Opening Back/Next only changes the reading position, with bounded navigation',()=>{
 let s=transition(initialState(),{type:'BEGIN'},()=>.3),start=structuredClone(s);
 s=transition(s,{type:'INTRO_PREV'});assert.deepEqual(s,start);
 s=transition(s,{type:'INTRO_NEXT'});s=transition(s,{type:'INTRO_PREV'});assert.deepEqual(s,start);
 for(let i=0;i<3;i++)s=transition(s,{type:'INTRO_NEXT'});
 const playing=structuredClone(s);assert.deepEqual(transition(s,{type:'INTRO_PREV'}),playing);assert.equal(s.timeRemaining,1200);
});
test('Only uncaught Palace identities appear in every possible breach subset',()=>{
 for(let mask=1;mask<16;mask++){
  const uncaught=PALACE_DOTTOMONS.filter((_,i)=>mask&(1<<i));
  const captured=ALL_DOTTOMONS.filter(id=>!uncaught.includes(id));
  const s={...initialState(),phase:'map',palaceEntered:true,region:'palace',extraRevealed:true,placements:VALID_PLACEMENTS[0],capturedDottomons:captured,recovered:captured.length,timeRemaining:1};
  const end=transition(s,{type:'CALL',person:'lumine'});assert.equal(end.ending,'breach');assert.deepEqual(end.endingSummary.uncapturedPalace,uncaught);
  const arrivals=ENDINGS.breach.lines(end)[4];
  for(const id of PALACE_DOTTOMONS)assert.equal(arrivals.includes('The '+(id==='runner'?'runner':id)),uncaught.includes(id));
  assert.doesNotMatch(arrivals,/chemist|Dottoling|date pair/);
  assert.deepEqual(remainingPalace(end),uncaught);
 }
});
test('The helpful specialist has two adjacent lab locations without changing placement pools or timing',()=>{
 assert.equal(VALID_PLACEMENTS.length,72);assert.equal(MISSION_SECONDS,1200);
 for(const loc of POOLS.specialist)assert.ok(PALACE_LINKS.some(([a,b])=>a==='laboratory'&&b===loc));
 for(const [a,b]of PALACE_LINKS){assert.ok(PALACE_POSITIONS[a]);assert.ok(PALACE_POSITIONS[b]);}
 let s=transition(initialState(),{type:'BEGIN'},()=>0);for(let i=0;i<3;i++)s=transition(s,{type:'INTRO_NEXT'});
 assert.deepEqual(transition(s,{type:'VISIT',id:'laboratory'}),s,'lab cannot be entered as a capture room');
});
test('Every authored encounter has additional variants reachable across runs without mutating game state',()=>{
 assert.equal(Object.keys(EXTRAS).length,14);
 for(const [key,base]of Object.entries(VARIANTS)){
  const [id,loc]=key.split(':'),variants=new Set();assert.equal(EXTRAS[key].length,5);
  for(const placements of VALID_PLACEMENTS){const s={...initialState(),placements},before=structuredClone(s);const story=encounterFor(s,loc,id);assert.deepEqual(s,before);assert.equal(story.failures.length,base.failures.length+1);variants.add(story.risky);}
  assert.equal(variants.size,2,key+' should expose both Risky versions');
 }
 for(const id of ALL_DOTTOMONS)assert.equal(REACTIONS[id].length,2);
});
test('Shareable runtime has Lumine throughout and existing achievements survive the easier threshold',()=>{
 const paths=['index.html','game.js','engine.js','progress.js',...readdirSync(new URL('../data/',import.meta.url)).filter(x=>x.endsWith('.js')).map(x=>'data/'+x)];
 for(const path of paths)assert.doesNotMatch(readFileSync(new URL('../'+path,import.meta.url),'utf8'),/Marina|marina|\bMari\b/,path);
 const store={getItem:k=>k===ACHIEVEMENT_KEY?'["ahead"]':null,setItem(){}};assert.ok(createProgress(store).achievements.includes('ahead'));
});
test('Private final chapters keep the support handoff and each ending remains three complete scenes',()=>{
 const s={...initialState(),endingSummary:{uncapturedPalace:PALACE_DOTTOMONS}};
 for(const [id,ending]of Object.entries(ENDINGS)){const all=ending.lines(s),third=all.slice(ending.breaks[1]);assert.ok(third.length>2);assert.equal(ending.chapters.length,3);assert.ok(third.some(line=>Array.isArray(line)&&line[0]==='Zandik'));
  if(id!=='secret')assert.doesNotMatch(third.flat().join(' '),/Lumine|Albedo|Durin/);
 }
 assert.match(ENDINGS.secret.lines(s).flat().join(' '),/alert, settled, and comfortable with them leaving/);
});
