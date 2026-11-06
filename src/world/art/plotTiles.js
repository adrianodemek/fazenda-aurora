// Canteiro bloqueado: um ÚNICO bloco de grama, sem repartições internas.
// Asset aprovado para Fazenda Aurora V0.3.5: WEBP RGBA 224×120.
// O losango encaixa na mesma geometria isométrica dos terrenos de terra.
// O CSS/zoom e a escala global da horta são aplicados pelo renderizador.
import {TILE_W,TILE_H} from '../../config/gameConfig.js?v=034';

export const BLOCKED_SPRITE_CROP=Object.freeze({sx:0,sy:0,sw:224,sh:120});
export const BLOCKED_TILE_DEST=Object.freeze({
 offsetX:-TILE_W/2,offsetY:-TILE_H/2-2,width:TILE_W,height:TILE_H+4
});
export function drawBlockedTile(ctx,x,y,image){
 // Piso verde sob a borda orgânica do sprite: os lotes continuam
 // encaixados sem vãos onde a silhueta da grama é irregular.
 ctx.beginPath();
 ctx.moveTo(x,y-TILE_H/2);
 ctx.lineTo(x+TILE_W/2,y);
 ctx.lineTo(x,y+TILE_H/2);
 ctx.lineTo(x-TILE_W/2,y);
 ctx.closePath();
 ctx.fillStyle='#56a82a';
 ctx.fill();
 if(image?.complete&&image.naturalWidth){
  const s=BLOCKED_SPRITE_CROP,d=BLOCKED_TILE_DEST;
  ctx.drawImage(image,s.sx,s.sy,s.sw,s.sh,
   x+d.offsetX,y+d.offsetY,d.width,d.height);
  return true;
 }
 return false;
}
