// A casinha do cachorro tem recurso independente: pode ser alterada
// sem tocar na imagem da sede principal ou nos sistemas agrícolas.
import {drawFarmSprite} from './sprites.js';
export class DoghouseArt {
 constructor(){
  this.image=null;
  if(typeof Image!=='undefined'){
   const image=new Image();
   image.decoding='async';
   image.src=new URL('../../../public/assets/buildings/doghouse/level-01.svg?v=028',import.meta.url).href;
   this.image=image;
  }
 }
 draw(ctx,x,y){
  return drawFarmSprite(ctx,this.image,x-80,y-116,160,128);
 }
}
