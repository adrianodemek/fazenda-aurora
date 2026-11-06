// O WebP aprovado mede 140×140, mas seu losango começa em y≈33.
// Recortamos a margem transparente antes de desenhar no losango 100×50.
import {TILE_W,TILE_H} from '../../config/gameConfig.js?v=032';
export const BLOCKED_SPRITE_CROP=Object.freeze({sx:0,sy:30,sw:140,sh:110});
export const BLOCKED_TILE_DEST=Object.freeze({
 offsetX:-TILE_W/2,offsetY:-TILE_H/2-2,width:TILE_W,height:TILE_H+4
});
export function drawBlockedTile(ctx,x,y,image){
 if(image?.complete&&image.naturalWidth){
  const s=BLOCKED_SPRITE_CROP,d=BLOCKED_TILE_DEST;
  ctx.drawImage(image,s.sx,s.sy,s.sw,s.sh,
   x+d.offsetX,y+d.offsetY,d.width,d.height);
  return true;
 }
 ctx.beginPath();
 ctx.moveTo(x,y-TILE_H/2);
 ctx.lineTo(x+TILE_W/2,y);
 ctx.lineTo(x,y+TILE_H/2);
 ctx.lineTo(x-TILE_W/2,y);
 ctx.closePath();ctx.fillStyle='#83ba49';ctx.fill();
 return false;
}
