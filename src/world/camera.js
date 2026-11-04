import {MAP_SIZE, TILE_W, TILE_H} from '../config/gameConfig.js';

// Composição mobile horizontal inspirada nos jogos clássicos de fazenda:
// o mapa preenche a visão inicial, e suas bordas podem sair da tela.
// Todos os valores são de câmera, não alteram o tamanho lógico dos tiles.
export function initialFarmView(width, height) {
  const w=Math.max(1, width), h=Math.max(1, height);
  const widthZoom=(w-18)/(MAP_SIZE*TILE_W)*1.10;
  const heightZoom=h/(MAP_SIZE*TILE_H)*1.50;
  const scale=Math.max(.38,Math.min(1.65,widthZoom,heightZoom));
  const focusX=30, focusY=300;
  return {
    scale,
    x:w*.5-focusX*scale,
    y:h*.52-focusY*scale
  };
}
