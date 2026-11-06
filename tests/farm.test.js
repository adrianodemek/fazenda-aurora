import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,interact,levelOf,isPlotUnlocked,loadState} from '../src/systems/farm.js';
const values=new Map();
globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
test('plantio consome moedas',()=>{const s=freshState();assert.equal(interact(s,6,3,100).changed,true);assert.equal(s.coins,78);});
test('colheita entrega moedas e experiência',()=>{const s=freshState();interact(s,5,2,100);assert.equal(interact(s,6,3,15101).changed,true);assert.equal(s.coins,85);assert.equal(s.xp,4);});
test('terreno não cultivável não permite plantar',()=>{const s=freshState();assert.equal(interact(s,0,0).changed,false);});
test('nível inicial é 1',()=>assert.equal(levelOf(0).level,1));

test('são 6 canteiros livres e 22 cobertos por mato',async()=>{
 const {PLOTS,FREE_PLOTS,LOCKED_PLOTS}=await import('../src/config/gameConfig.js');
 assert.equal(PLOTS.size,28);assert.equal(FREE_PLOTS.size,6);assert.equal(LOCKED_PLOTS.size,22);
 assert.equal(isPlotUnlocked(freshState(),'6:3'),true);
});
test('bloqueado não permite plantio nem consome moedas',()=>{
 const s=freshState();
 const r=interact(s,5,3,100);
 assert.equal(r.changed,false);assert.match(r.message,/bloqueado/);
 assert.equal(s.coins,80);
});
test('salvamento legado preserva plantas antigas até a colheita',()=>{
 values.set('fazenda-aurora-demo-v01',JSON.stringify({coins:378,xp:90,plants:{
 '5:2':{seed:'wheat',at:100},'5:3':{seed:'carrot',at:100}
 }}));
 const s=loadState();
 assert.equal(s.coins,378);assert.ok(s.plants['5:2']);
 assert.ok(s.plants['5:3']);
 assert.equal(interact(s,5,2,40000).changed,true);
 assert.equal(interact(s,5,3,40000).changed,true);
 assert.equal(interact(s,5,3,40001).changed,false);
 values.clear();
});
