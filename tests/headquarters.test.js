import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {headquartersForLevel,headquartersAssetUrl,normalizeHeadquartersLevel} from '../src/data/headquarters.js';
import {HeadquartersArt} from '../src/world/art/headquarters.js';
import {freshState,loadState} from '../src/systems/farm.js';

test('sede inicial tem um único arquivo de arte independente',()=>{
  const def=headquartersForLevel(1);
  assert.equal(def.name,'Sede Inicial');
  assert.equal(def.level,1);
  assert.equal(def.row,3);
  assert.equal(def.col,9);
  const file=new URL('../public/assets/buildings/headquarters/level-01.webp',import.meta.url);
  assert.ok(existsSync(file));
  assert.ok(statSync(file).size>5000);
  assert.match(headquartersAssetUrl(1),/headquarters\/level-01\.webp\?v=027/);
});
test('nível da sede é independente do nível de jogador',()=>{
  const state=freshState();
  assert.equal(state.headquartersLevel,1);
  assert.equal(normalizeHeadquartersLevel(2),1); // somente nível 1 lançado
  assert.equal(headquartersForLevel(999).level,1);
});
test('arte da sede usa o nível configurado e mantém a posição do mapa',()=>{
  const previous=globalThis.Image;
  globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=250;}set src(v){this._src=v;}get src(){return this._src;}};
  try{
    const art=new HeadquartersArt();let rectangle;
    assert.equal(art.draw({drawImage:(...args)=>{rectangle=args;}},1,300,300),true);
    assert.equal(rectangle[1],165);
    assert.equal(rectangle[2],131);
    assert.equal(rectangle[3],270);
    assert.equal(rectangle[4],196);
  }finally{globalThis.Image=previous;}
});
