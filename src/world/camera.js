import {MAP_SIZE,TILE_W,TILE_H} from '../config/gameConfig.js';
import {FARM_VIEW_REFERENCE,WORLD_BOUNDS} from './layout.js?v=029';

// A área útil sempre mostra a fazenda próxima, como a referência de 1871x841.
// Escala é relativa à largura mobile; não afastamos abaixo desta visão inicial.
export function minimumFarmZoom(width,height){
 const w=Math.max(1,width),h=Math.max(1,height);
 return Math.max(.28,w/1260,h/820);
}
export function maximumFarmZoom(width,height){
 return minimumFarmZoom(width,height)*2.3;
}
function clamp(value,min,max){return Math.min(max,Math.max(min,value));}

export function constrainFarmCamera(view,width,height){
 const w=Math.max(1,width),h=Math.max(1,height);
 const scale=Math.max(minimumFarmZoom(w,h),
   Math.min(maximumFarmZoom(w,h),view.scale));
 const minX=w-WORLD_BOUNDS.right*scale;
 const maxX=-WORLD_BOUNDS.left*scale;
 const minY=h-WORLD_BOUNDS.bottom*scale;
 const maxY=-WORLD_BOUNDS.top*scale;
 return {
  scale,
  x:minX>maxX?(minX+maxX)/2:clamp(view.x,minX,maxX),
  y:minY>maxY?(minY+maxY)/2:clamp(view.y,minY,maxY)
 };
}

export function initialFarmView(width,height){
 const w=Math.max(1,width),h=Math.max(1,height);
 const scale=minimumFarmZoom(w,h);
 const {plotCenter,plotScreen}=FARM_VIEW_REFERENCE;
 // Telas muito baixas precisam elevar um pouco o conjunto para mostrar o lago.
 const mobileShift=Math.max(0,Math.min(.08,(450-h)*.0005));
 return constrainFarmCamera({
  scale,
  x:w*plotScreen.x-plotCenter.x*scale,
  y:h*(plotScreen.y+mobileShift)-plotCenter.y*scale
 },w,h);
}

// Posições lógicas continuam 14x14, sem mexer no inventário do jogador.
export const TILE_WORLD_SIZE=Object.freeze({map:MAP_SIZE,width:TILE_W,height:TILE_H});
