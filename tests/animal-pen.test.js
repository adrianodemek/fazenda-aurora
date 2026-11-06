import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AnimalPenArt} from '../src/world/art/animalPen.js';
import {FARM_OBJECTS,PEN_ANIMAL_SPOTS} from '../src/world/layout.js';
import {PLOTS,SAVE_KEY} from '../src/config/gameConfig.js';
test('cercado e animais possuem sprites autorais independentes',()=>{
 for(const path of [
  'public/assets/decor/animal-pen/fence-back.svg',
  'public/assets/decor/animal-pen/fence-front.svg',
  'public/assets/animals/cow.svg','public/assets/animals/sheep.svg',
  'public/assets/animals/chicken.svg'
 ]){
  const svg=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.match(svg,/^<\?xml/);
  assert.match(svg,/<svg/);
  assert.match(svg,/<\/svg>\s*$/);
 }
 assert.deepEqual(PEN_ANIMAL_SPOTS.map(s=>s.kind),['cow','sheep','hen']);
});
test('pintura do curral usa camadas e posicionamento do mapa',()=>{
 const prev=globalThis.Image;
 globalThis.Image=class{
  constructor(){this.complete=true;this.naturalWidth=600;}
  set src(v){this._src=v;}
  get src(){return this._src;}
 };
 const draws=[];
 const noop=()=>{};
 const ctx={save:noop,restore:noop,translate:noop,scale:noop,drawImage:(...args)=>draws.push(args)};
 try{
  const pen=new AnimalPenArt();
  pen.draw(ctx,FARM_OBJECTS.animalPen);
  assert.equal(draws.length,5);
  assert.match(draws[0][0].src,/fence-back/);
  assert.match(draws.at(-1)[0].src,/fence-front/);
  assert.equal(FARM_OBJECTS.animalPen.x,340);
  assert.ok(draws[2][3]>0);
 }finally{globalThis.Image=prev;}
});
test('curral é decorativo e não altera o progresso agrícola',()=>{
 assert.equal(PLOTS.size,28);
 assert.equal(SAVE_KEY,'fazenda-aurora-demo-v01');
});
