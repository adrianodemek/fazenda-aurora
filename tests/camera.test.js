import test from 'node:test';
import assert from 'node:assert/strict';
import {initialFarmView} from '../src/world/camera.js';
import {MAP_SIZE,TILE_W,TILE_H} from '../src/config/gameConfig.js';

test('a visão inicial aumenta o cenário no mobile landscape compacto',()=>{
  const compact=initialFarmView(925,292);
  assert.ok(compact.scale>.55, 'escala inicial deve ser legível');
  assert.ok(MAP_SIZE*TILE_W*compact.scale>925*.82,'fazenda deve ocupar a maior parte da largura');
});
test('fazenda permanece explorável em tamanhos horizontais variados',()=>{
  for(const [w,h] of [[667,375],[844,390],[925,292],[932,430],[1366,768]]){
    const view=initialFarmView(w,h);
    assert.ok(view.scale>=.38&&view.scale<=1.65);
    const plotX=-150,plotY=175;
    const px=view.x+plotX*view.scale,py=view.y+plotY*view.scale;
    assert.ok(px>0&&px<w&&py>0&&py<h, 'canteiro de entrada visível em '+w+'x'+h);
  }
});
test('câmera não altera as dimensões lógicas dos canteiros',()=>{
  assert.equal(MAP_SIZE,14);assert.equal(TILE_W,100);assert.equal(TILE_H,50);
});
