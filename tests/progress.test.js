import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgress,GALLERY_KEY,ENDING_IDS} from '../progress.js';
import {initialState,transition} from '../engine.js';
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};};
test('New gallery starts locked; all four discoveries persist across reloads',()=>{
 const storage=memory(),p=createProgress(storage);assert.deepEqual(p.endings,[]);
 for(const id of ENDING_IDS)p.discover(id);
 assert.deepEqual(createProgress(storage).endings,ENDING_IDS);assert.equal(p.persistent,true);
});
test('Discovery is idempotent and rejects unknown ending ids',()=>{
 const p=createProgress(memory());p.discover('secret');p.discover('secret');p.discover('made-up');assert.deepEqual(p.endings,['secret']);
 const copy=p.endings;copy.push('home');assert.deepEqual(p.endings,['secret']);
});
test('Replay resets the mission while retaining discovered endings',()=>{
 const storage=memory(),p=createProgress(storage);p.discover('home');let s=transition(initialState(),{type:'BEGIN'});s=transition(s,{type:'RESET'});
 assert.deepEqual(s,initialState());assert.deepEqual(createProgress(storage).endings,['home']);
});
test('Explicit gallery reset persists without mutating mission state',()=>{
 const storage=memory(),p=createProgress(storage);p.discover('good');const s=transition(initialState(),{type:'BEGIN'}),before=structuredClone(s);
 p.reset();assert.deepEqual(createProgress(storage).endings,[]);assert.deepEqual(s,before);
});
test('Malformed and unexpected saved progress cannot crash the game or inject titles',()=>{
 for(const value of ['broken','null','{}','42','["good","good","<script>"]']){
  const storage=memory();storage.setItem(GALLERY_KEY,value);const p=createProgress(storage);
  assert.deepEqual(p.endings,value.includes('good')?['good']:[]);p.discover('home');assert.ok(p.endings.includes('home'));
 }
});
test('Unavailable or quota-blocked storage retains session discoveries without throwing',()=>{
 for(const storage of [undefined,{getItem(){throw Error('denied');},setItem(){throw Error('denied');}},{getItem(){return null;},setItem(){throw Error('quota');}}]){
  const p=createProgress(storage);p.discover('breach');assert.deepEqual(p.endings,['breach']);assert.equal(p.persistent,false);p.reset();assert.deepEqual(p.endings,[]);
 }
});

test('v0.3 ending archive migrates without losing cards and unlocks Full Recall',()=>{const storage=memory();storage.setItem(GALLERY_KEY,JSON.stringify(ENDING_IDS));const p=createProgress(storage);assert.deepEqual(p.endings,ENDING_IDS);assert.deepEqual(p.achievements,['full_recall']);assert.deepEqual(createProgress(storage).achievements,['full_recall']);});
test('Achievements require actual trigger conditions and persist independently of replay',()=>{const storage=memory(),p=createProgress(storage),s=initialState();p.record(s);assert.deepEqual(p.achievements,[]);s.coldPlunge=true;assert.deepEqual(p.record(s),['cold_plunge']);assert.deepEqual(p.record(s),[]);s.recovered=7;s.extraRevealed=false;s.timeRemaining=900;p.record(s);assert.deepEqual(p.achievements,['cold_plunge']);s.recovered=8;s.extraRevealed=true;s.timeRemaining=300;assert.deepEqual(p.record(s),['ahead','no_help']);assert.deepEqual(createProgress(storage).achievements,['cold_plunge','ahead','no_help']);p.reset();assert.deepEqual(createProgress(storage).achievements,[]);});
test('Ahead threshold and hint-use exclusions are exact',()=>{for(const [seconds,hint,expected]of [[299,false,['no_help']],[300,true,['ahead']],[299,true,[]]]){const p=createProgress(memory());p.record({...initialState(),extraRevealed:true,recovered:8,timeRemaining:seconds,lumineHintUsed:hint});assert.deepEqual(p.achievements,expected);}});
test('A full recovery on a Secret-triggering action can earn completion achievements',()=>{const p=createProgress(memory());p.record({...initialState(),ending:'secret',extraRevealed:true,recovered:8,timeRemaining:650});assert.deepEqual(p.endings,['secret']);assert.deepEqual(p.achievements,['ahead','no_help']);});
