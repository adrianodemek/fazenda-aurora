import test from 'node:test';
import assert from 'node:assert/strict';
import {MAP_SIZE,TILE_W,TILE_H} from '../src/config/gameConfig.js';
import {Renderer} from '../src/world/renderer.js';

// Contexto Canvas falso: confirma que o terreno e a cena desenham sem erro.
function fakeContext() {
  const calls={drawImage:0,fill:0};
  const noop=()=>{};
  const ctx={
    beginPath:noop,moveTo:noop,lineTo:noop,closePath:noop,
    fill:()=>calls.fill++,stroke:noop,clip:noop,
    save:noop,restore:noop,ellipse:noop,translate:noop,scale:noop,
    setTransform:noop,clearRect:noop,fillRect:noop,fillText:noop,
    drawImage:()=>calls.drawImage++,
    createLinearGradient:()=>({addColorStop:noop})
  };
  return {ctx,calls};
}
test('cenário usa terreno em cache e preserva as coordenadas dos canteiros',()=>{
  const {ctx,calls}=fakeContext();
  globalThis.document={createElement:()=>({getContext:()=>ctx})};
  globalThis.window={devicePixelRatio:1};
  const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:960,height:540})};
  const state={plants:{},coins:80,xp:0};
  const renderer=new Renderer(canvas,state);
  assert.equal(renderer.terrain.canvas.width,(MAP_SIZE+1)*TILE_W);
  assert.equal(renderer.terrain.canvas.height,(MAP_SIZE+2)*TILE_H);
  assert.ok(calls.fill>MAP_SIZE*MAP_SIZE,'terreno isométrico deve desenhar');
  const tile=renderer.tile(5,2);
  assert.deepEqual(renderer.hit(renderer.x+tile.x*renderer.scale,renderer.y+tile.y*renderer.scale),{r:5,c:2});
  renderer.render(100);
  renderer.render(200);
  assert.equal(calls.drawImage,2,'camada cacheada desenhada uma vez por frame');
});
