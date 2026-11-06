// Posicionamento visual da horta em relação ao cenário.
// Matriz de referência: Colheita Feliz clássico (horta no canto inferior
// esquerdo, casinha acima e curral à direita).
// O zoom da câmera e os IDs de salvamento dos canteiros NÃO mudam.
import {PLOTS,TILE_W,TILE_H} from '../config/gameConfig.js?v=032';

// A grade 4x7 é escalada em torno de seu centro, sem alterar a projeção 2:1.
// Original: centro (-125,287.5). Novo: ao sul do cenário, como a referência.
export const PLOT_ART_SCALE=1.45;
export const PLOT_GRID_CENTER=Object.freeze({x:-125,y:287.5});
export const PLOT_WORLD_CENTER=Object.freeze({x:-125,y:415});

export function baseTileWorld(r,c){
 return {x:(c-r)*TILE_W/2,y:(c+r)*TILE_H/2};
}
export function plotTileWorld(r,c){
 const base=baseTileWorld(r,c);
 return {
  x:PLOT_WORLD_CENTER.x+(base.x-PLOT_GRID_CENTER.x)*PLOT_ART_SCALE,
  y:PLOT_WORLD_CENTER.y+(base.y-PLOT_GRID_CENTER.y)*PLOT_ART_SCALE
 };
}
// Apenas a horta é deslocada. Restante do mundo conserva as coordenadas.
export function sceneTileWorld(r,c){
 return PLOTS.has(r+':'+c)?plotTileWorld(r,c):baseTileWorld(r,c);
}
export function hitFarmPlotWorld(x,y){
 const gx=PLOT_GRID_CENTER.x+(x-PLOT_WORLD_CENTER.x)/PLOT_ART_SCALE;
 const gy=PLOT_GRID_CENTER.y+(y-PLOT_WORLD_CENTER.y)/PLOT_ART_SCALE;
 const u=gx/(TILE_W/2),v=gy/(TILE_H/2);
 const c=Math.round((u+v)/2),r=Math.round((v-u)/2);
 if(!PLOTS.has(r+':'+c))return null;
 const p=baseTileWorld(r,c);
 const d=Math.abs(gx-p.x)/(TILE_W/2)+Math.abs(gy-p.y)/(TILE_H/2);
 return d<=1.001?{r,c}:null;
}
