import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {drawCropIllustrated} from '../src/world/art/crops.js';
import {loadFarmSprites,drawFarmSprite} from '../src/world/art/sprites.js';

test('sprites autorais existem separados por elemento',()=>{
 for(const file of ['cottage.svg','oak.svg','barn.svg']){
  const raw=readFileSync(new URL('../public/assets/sprites/'+file,import.meta.url),'utf8');
  assert.match(raw,/^<\?xml/);
  assert.match(raw,/<svg\s/);
  assert.match(raw,/<\/svg>\s*$/);
  assert.ok(raw.length>1500,'arte deve conter detalhes: '+file);
 }
});
test('carregador resolve todos os recursos dentro do repositório',()=>{
 const previous=globalThis.Image;
 globalThis.Image=class {
  constructor(){this.complete=true;this.naturalWidth=240;}
  set src(v){this._src=v;}
  get src(){return this._src;}
 };
 try{
  const sprites=loadFarmSprites();
  assert.deepEqual(Object.keys(sprites).sort(),['barn','house','tree']);
  for(const sprite of Object.values(sprites))assert.match(sprite.src,/public\/assets\/sprites\/.*\.svg\?v=026/);
  let called=0;
  assert.equal(drawFarmSprite({drawImage:()=>called++},sprites.house,0,0,220,190),true);
  assert.equal(called,1);
  assert.equal(drawFarmSprite({drawImage:()=>called++},null,0,0,220,190),false);
 }finally{globalThis.Image=previous;}
});
test('cultivos desenham da semente até a colheita sem erros',()=>{
 let count=0;
 const noop=()=>{};
 const ctx={beginPath:noop,moveTo:noop,lineTo:noop,quadraticCurveTo:noop,
  closePath:noop,stroke:noop,ellipse:noop,fill:()=>count++,fillText:noop};
 for(const seed of ['wheat','carrot','strawberry']){
  for(const progress of [0,.15,.5,.8,1]){
   const duration={wheat:15000,carrot:25000,strawberry:40000}[seed];
   drawCropIllustrated(ctx,0,0,{seed,at:0},1500,progress*duration);
  }
 }
 assert.ok(count>100,'múltiplas folhas, sementes e frutos foram desenhados');
});
