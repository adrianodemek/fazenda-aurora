import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,interact,levelOf} from '../src/systems/farm.js';
const values=new Map();
globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
test('plantio consome moedas',()=>{const s=freshState();assert.equal(interact(s,5,2,100).changed,true);assert.equal(s.coins,78);});
test('colheita entrega moedas e experiência',()=>{const s=freshState();interact(s,5,2,100);assert.equal(interact(s,5,2,15101).changed,true);assert.equal(s.coins,85);assert.equal(s.xp,4);});
test('terreno não cultivável não permite plantar',()=>{const s=freshState();assert.equal(interact(s,0,0).changed,false);});
test('nível inicial é 1',()=>assert.equal(levelOf(0).level,1));
