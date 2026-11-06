import test from 'node:test';
import assert from 'node:assert/strict';
import {PLOTS,FREE_PLOTS,LOCKED_PLOTS,TILE_W,TILE_H,PLOT_LAYOUT_VERSION} from '../src/config/gameConfig.js';
import {plotTileWorld,sceneTileWorld,baseTileWorld,hitFarmPlotWorld,
 PLOT_ART_SCALE,PLOT_WORLD_CENTER} from '../src/world/plotLayout.js';
import {initialFarmView} from '../src/world/camera.js';

test('28 tiles preservados e deslocados em conjunto, sem mudar o salvamento',()=>{
 assert.equal(PLOTS.size,28);
 assert.equal(FREE_PLOTS.size,6);
 assert.equal(LOCKED_PLOTS.size,22);
 assert.equal(PLOT_LAYOUT_VERSION,33);
 assert.equal(PLOT_ART_SCALE,1.85);
 for(const id of PLOTS){
  const [r,c]=id.split(':').map(Number),actual=plotTileWorld(r,c);
  assert.notDeepEqual(actual,baseTileWorld(r,c));
  assert.deepEqual(sceneTileWorld(r,c),actual);
  assert.deepEqual(hitFarmPlotWorld(actual.x,actual.y),{r,c});
 }
 assert.deepEqual(sceneTileWorld(0,0),baseTileWorld(0,0));
});
test('topologia 2:1 e encaixe entre todos os vizinhos continuam precisos',()=>{
 for(const id of PLOTS){
  const [r,c]=id.split(':').map(Number),p=plotTileWorld(r,c);
  if(PLOTS.has((r+1)+':'+c)){
   const other=plotTileWorld(r+1,c);
   assert.equal(other.x-p.x,-TILE_W*PLOT_ART_SCALE/2);
   assert.equal(other.y-p.y,TILE_H*PLOT_ART_SCALE/2);
  }
  if(PLOTS.has(r+':'+(c+1))){
   const other=plotTileWorld(r,c+1);
   assert.equal(other.x-p.x,TILE_W*PLOT_ART_SCALE/2);
   assert.equal(other.y-p.y,TILE_H*PLOT_ART_SCALE/2);
  }
 }
});
test('no mobile horizontal a horta fica abaixo e à esquerda da sede',()=>{
 for(const [w,h] of [[925,390],[844,390],[1366,768],[1950,644]]){
  const v=initialFarmView(w,h);
  const place=p=>({x:v.x+p.x*v.scale,y:v.y+p.y*v.scale});
  const farm=place(PLOT_WORLD_CENTER);
  assert.ok(farm.x>0&&farm.x<w*.45);
  assert.ok(farm.y>h*.65&&farm.y<h*1.02);
  assert.ok(farm.y>place({x:165,y:245}).y);
 }
});
test('points outside the new plot footprint do not receive planting taps',()=>{
 assert.equal(hitFarmPlotWorld(-150,100),null);
 const p=plotTileWorld(5,1);
 assert.deepEqual(hitFarmPlotWorld(p.x,p.y),{r:5,c:1});
});
