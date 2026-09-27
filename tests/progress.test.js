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
