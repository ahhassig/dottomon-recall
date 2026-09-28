import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,transition} from '../engine.js';
import {createProgress,REPORT_KEY,GALLERY_KEY} from '../progress.js';
import {ALL_DOTTOMONS,PALACE_DOTTOMONS} from '../data/locations.js';
import {VALID_PLACEMENTS} from '../data/placements.js';
import {VARIANTS,encounterFor} from '../data/encounters.js';
import {REPLAY_BEATS,pressureLine,fieldNote} from '../data/replay.js';
import {ENDINGS} from '../data/endings.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
const report=(ending='good')=>({ending,extraRevealed:true,recovered:8,capturedDottomons:[...ALL_DOTTOMONS],endingSummary:{timeRemaining:650,recovered:8,total:8,cigarettes:2,hintsUsed:0,uncapturedPalace:[]}});
test('Replay prose covers both placement pools, shortens retries, and never mutates state or consumes RNG',()=>{
 const old=Math.random;Math.random=()=>{throw Error('Prose consumed gameplay randomness');};
 try{for(const placements of VALID_PLACEMENTS){for(const [key,base]of Object.entries(VARIANTS)){
  const [id,loc]=key.split(':');assert.ok(REPLAY_BEATS[key]);
  const s={...initialState(),placements,attempts:{[loc]:1},stress:50};const before=structuredClone(s);
  const prose=encounterFor(s,loc,id);assert.ok(prose.lines.length<base.lines.length,`${key} retry should be shorter`);assert.ok(prose.success);assert.deepEqual(s,before);
  const repeat=encounterFor(s,loc,id);assert.deepEqual(prose,repeat);
 }} }finally{Math.random=old;}
});
test('Pressure prose has a finite precedence and does not reveal an unvisited room',()=>{
 const s={...initialState(),cigarettes:4,stress:50,timeRemaining:180};assert.match(pressureLine(s)[1],/One thing at a time/);
 s.timeRemaining=181;assert.match(pressureLine(s),/pauses/);s.cigarettes=0;assert.match(pressureLine(s),/voice level/);s.stress=0;assert.equal(pressureLine(s),null);
 for(const placements of VALID_PLACEMENTS)assert.equal(fieldNote({...s,placements}),fieldNote(s));
});
test('An ending report survives reload and replay, retains its actual counts, and is returned as a copy',()=>{
 const storage=memory(),p=createProgress(storage);p.record(report());const reloaded=createProgress(storage),run=reloaded.runFor('good');assert.equal(run.endingSummary.timeRemaining,650);assert.equal(run.recovered,8);
 run.endingSummary.timeRemaining=0;run.capturedDottomons.length=0;assert.equal(reloaded.runFor('good').endingSummary.timeRemaining,650);assert.equal(reloaded.runFor('good').capturedDottomons.length,8);
 assert.deepEqual(transition(initialState(),{type:'RESET'}),initialState());assert.ok(createProgress(storage).runFor('good'));
 p.reset();assert.equal(createProgress(storage).runFor('good'),null);
});
test('Legacy and malformed reports preserve discoveries without trusting saved HTML, identifiers, or impossible values',()=>{
 for(const value of ['bad','null','[]',JSON.stringify({good:{capturedDottomons:['<img onerror=alert(1)>']}}),JSON.stringify({good:{...report(),endingSummary:{...report().endingSummary,timeRemaining:5000}}}),JSON.stringify({good:{...report(),endingSummary:{...report().endingSummary,uncapturedPalace:PALACE_DOTTOMONS}}})]){
  const storage=memory();storage.setItem(GALLERY_KEY,'["good"]');storage.setItem(REPORT_KEY,value);const p=createProgress(storage);assert.deepEqual(p.endings,['good']);assert.equal(p.runFor('good'),null);
 }
 const storage=memory();storage.setItem(REPORT_KEY,JSON.stringify({good:report()}));assert.equal(createProgress(storage).runFor('good'),null,'a report cannot reveal a locked ending');
});
test('Fresh engine ending reports support all three archive chapters, including early unrevealed Return Home',()=>{
 let s=transition(initialState(),{type:'BEGIN'},()=>0);for(let i=0;i<3;i++)s=transition(s,{type:'INTRO_NEXT'});s=transition(s,{type:'RETURN_HOME'});
 const p=createProgress(memory());p.record(s);const saved=p.runFor('home');assert.equal(saved.extraRevealed,false);assert.equal(saved.endingSummary.total,7);assert.equal(saved.recovered,0);
 const lines=ENDINGS.home.lines(saved);assert.ok(lines.flat().includes('“7.”'));assert.ok(lines.some(x=>typeof x==='string'&&x.includes('pale cat costume')));
});
test('Reports remain readable for the page session when persistent storage is unavailable',()=>{
 const p=createProgress({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}});p.record(report());assert.ok(p.runFor('good'));assert.equal(p.persistent,false);
 p.record({...report(),endingSummary:{...report().endingSummary,timeRemaining:420}});assert.equal(p.runFor('good').endingSummary.timeRemaining,420);
});
