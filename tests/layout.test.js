import test from 'node:test';
import assert from 'node:assert/strict';
import {initialFarmView,minimumFarmZoom,maximumFarmZoom,constrainFarmCamera}
 from '../src/world/camera.js';
import {FARM_OBJECTS,FARM_VIEW_REFERENCE,WORLD_BOUNDS,SCENERY_TREES}
 from '../src/world/layout.js';
import {DoghouseArt} from '../src/world/art/doghouse.js';
import {readFileSync} from 'node:fs';
import {PLOTS,SAVE_KEY} from '../src/config/gameConfig.js';

function project(view,p){return {
 x:view.x+p.x*view.scale,
 y:view.y+p.y*view.scale
};}

test('posições seguem a referência clássica em 1871x841',()=>{
 const w=1871,h=841,view=initialFarmView(w,h);
 const desired=[
  [FARM_OBJECTS.pond, .03,.06],
  [FARM_VIEW_REFERENCE.plotCenter,.29,.52],
  [FARM_OBJECTS.doghouse,.163,.33],
  [FARM_OBJECTS.headquarters,.52,.445],
  [{x:FARM_OBJECTS.animalPen.x+FARM_OBJECTS.animalPen.width/2,
    y:FARM_OBJECTS.animalPen.y+FARM_OBJECTS.animalPen.height/2},.865,.55]
 ];
 for(const [point,xPercent,yPercent] of desired){
  const actual=project(view,point);
  assert.ok(Math.abs(actual.x/w-xPercent)<.030,'posição horizontal: '+JSON.stringify(point));
  assert.ok(Math.abs(actual.y/h-yPercent)<.030,'posição vertical: '+JSON.stringify(point));
 }
 assert.equal(SCENERY_TREES.length>=10,true);
});

test('zoom não pode afastar para além do enquadramento inicial',()=>{
 for(const [w,h] of [[667,375],[844,390],[925,292],[1366,768],[1871,841]]){
  const min=minimumFarmZoom(w,h);
  const view=constrainFarmCamera({scale:min*.05,x:1e8,y:-1e8},w,h);
  assert.equal(view.scale,min);
  assert.ok(min>0&&maximumFarmZoom(w,h)>min);
  const left=(0-view.x)/min,right=(w-view.x)/min;
  const top=(0-view.y)/min,bottom=(h-view.y)/min;
  assert.ok(left>=WORLD_BOUNDS.left-.001);
  assert.ok(right<=WORLD_BOUNDS.right+.001);
  assert.ok(top>=WORLD_BOUNDS.top-.001);
  assert.ok(bottom<=WORLD_BOUNDS.bottom+.001);
 }
});

test('mesmo arrastando excessivamente não existem laterais sem grama',()=>{
 for(const [w,h] of [[925,292],[844,390],[1871,841]]){
  const view=initialFarmView(w,h);
  for(const [x,y] of [[-100000,-100000],[100000,100000],[-100000,100000]]){
   const v=constrainFarmCamera({...view,x,y},w,h);
   const left=(0-v.x)/v.scale,right=(w-v.x)/v.scale;
   assert.ok(left>=-850-.001 && right<=950+.001);
  }
 }
});

test('casa do cachorro é um sprite separado da sede',()=>{
 const svg=readFileSync(new URL('../public/assets/buildings/doghouse/level-01.svg',import.meta.url),'utf8');
 assert.match(svg,/^<\?xml/);
 assert.match(svg,/<svg[^>]*viewBox="0 0 240 195"/);
 assert.match(svg,/<\/svg>\s*$/);
 const previous=globalThis.Image;
 globalThis.Image=class{
  constructor(){this.complete=true;this.naturalWidth=240;}
  set src(v){this._src=v;}
  get src(){return this._src;}
 };
 try{
  const art=new DoghouseArt();let drawn=0;
  assert.equal(art.draw({drawImage:()=>drawn++},135,238),true);
  assert.equal(drawn,1);
  assert.match(art.image.src,/buildings\/doghouse\/level-01\.svg\?v=028/);
 }finally{globalThis.Image=previous;}
});

test('nenhum canteiro ou progresso do jogo foi movido',()=>{
 assert.equal(PLOTS.size,30);
 assert.ok(PLOTS.has('5:2') && PLOTS.has('9:7'));
 assert.equal(SAVE_KEY,'fazenda-aurora-demo-v01');
});
