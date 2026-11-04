import test from 'node:test';
import assert from 'node:assert/strict';
import {drawPond} from '../src/world/art/pond.js';

test('lago desenha em Canvas 2D sem alterar regras de plantio',()=>{
 const drawn={fill:0,stroke:0,ellipse:0};
 const ctx={
  beginPath(){},moveTo(){},lineTo(){},closePath(){},
  fill(){drawn.fill++},stroke(){drawn.stroke++},
  ellipse(){drawn.ellipse++},
  set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){}
 };
 drawPond(ctx,175,145);
 assert.ok(drawn.fill>=8);
 assert.ok(drawn.stroke>=10);
 assert.ok(drawn.ellipse>=8);
});
