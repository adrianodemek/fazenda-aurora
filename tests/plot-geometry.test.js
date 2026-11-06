import test from 'node:test';
import assert from 'node:assert/strict';
import {PLOTS,FREE_PLOTS,TILE_W,TILE_H,PLOT_LAYOUT_VERSION} from '../src/config/gameConfig.js';
import {BLOCKED_TILE_DEST,BLOCKED_SPRITE_CROP,drawBlockedTile} from '../src/world/art/plotTiles.js';

const coord=id=>{
 const [r,c]=id.split(':').map(Number);
 return {r,c,x:(c-r)*TILE_W/2,y:(c+r)*TILE_H/2};
};
const vertices=p=>[[p.x,p.y-TILE_H/2],[p.x+TILE_W/2,p.y],
 [p.x,p.y+TILE_H/2],[p.x-TILE_W/2,p.y]];
test('a horta de 28 terrenos é um único retângulo isométrico 4x7',()=>{
 assert.equal(PLOTS.size,28);
 for(let r=5;r<=8;r++)for(let c=1;c<=7;c++)
  assert.equal(PLOTS.has(r+':'+c),true);
});
test('as arestas dos vizinhos coincidem sem vãos',()=>{
 for(const id of PLOTS){
  const a=coord(id),av=vertices(a);
  for(const [r,c] of [[a.r+1,a.c],[a.r,a.c+1]]){
   if(!PLOTS.has(r+':'+c))continue;
   const bv=vertices(coord(r+':'+c));
   assert.equal(av.filter(p=>bv.some(q=>p[0]===q[0]&&p[1]===q[1])).length,2,id);
  }
 }
});
test('sprite de grama recortado encaixa no footprint 100x50',()=>{
 assert.deepEqual(BLOCKED_SPRITE_CROP,{sx:0,sy:0,sw:224,sh:120});
 assert.equal(BLOCKED_TILE_DEST.width,TILE_W);
 assert.ok(BLOCKED_TILE_DEST.height>=TILE_H && BLOCKED_TILE_DEST.height<=TILE_H+4);
 const image={complete:true,naturalWidth:224},calls=[];
 const ctx={
  beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},
  drawImage:(...args)=>calls.push(args)
 };
 assert.equal(drawBlockedTile(ctx,-100,200,image),true);
 assert.deepEqual(calls[0],[image,0,0,224,120,-150,173,100,54]);
});
test('seis primeiros livres fazem um grupo compacto na parte mais alta',()=>{
 assert.equal(FREE_PLOTS.size,6);
 const pts=[...FREE_PLOTS].map(coord);
 assert.equal(Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y)),75);
 assert.equal(PLOT_LAYOUT_VERSION,33);
});
