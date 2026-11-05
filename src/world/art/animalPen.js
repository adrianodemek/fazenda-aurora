// Curral ilustrado em camadas independentes:
// cerca traseira -> animais decorativos -> cerca dianteira.
// A evolução para animais jogáveis não exigirá trocar a casa, a horta
// ou o sistema de plantio. Sprites próprios, sem recursos do jogo original.
import {PEN_ANIMAL_SPOTS} from '../layout.js';
import {drawFarmSprite} from './sprites.js';

const ASSETS=Object.freeze({
 back:'../../../public/assets/decor/animal-pen/fence-back.svg?v=029',
 front:'../../../public/assets/decor/animal-pen/fence-front.svg?v=029',
 cow:'../../../public/assets/animals/cow.svg?v=029',
 sheep:'../../../public/assets/animals/sheep.svg?v=029',
 hen:'../../../public/assets/animals/chicken.svg?v=029'
});
const WIDTH=600, HEIGHT=380;
export class AnimalPenArt{
 constructor(){
  this.images={};
  if(typeof Image==='undefined')return;
  for(const [name,path] of Object.entries(ASSETS)){
   const picture=new Image();
   picture.decoding='async';
   picture.src=new URL(path,import.meta.url).href;
   this.images[name]=picture;
  }
 }
 draw(ctx,pen){
  ctx.save();
  ctx.translate(pen.x,pen.y);
  ctx.scale(pen.width/WIDTH,pen.height/HEIGHT);
  const back=drawFarmSprite(ctx,this.images.back,0,0,WIDTH,HEIGHT);
  if(!back){
   // Estrutura de reserva durante o carregamento das imagens.
   ctx.beginPath();
   ctx.moveTo(50,150);ctx.lineTo(250,65);ctx.lineTo(552,151);
   ctx.lineWidth=13;ctx.strokeStyle='#ae7546';ctx.stroke();
  }
  const names={cow:'cow',sheep:'sheep',hen:'hen'};
  for(const spot of PEN_ANIMAL_SPOTS){
   const width=spot.width*WIDTH,height=spot.height*HEIGHT;
   const left=spot.x*WIDTH-width/2;
   const top=spot.y*HEIGHT-height;
   drawFarmSprite(ctx,this.images[names[spot.kind]],left,top,width,height);
  }
  const front=drawFarmSprite(ctx,this.images.front,0,0,WIDTH,HEIGHT);
  if(!front){
   ctx.beginPath();
   ctx.moveTo(54,260);ctx.lineTo(334,337);ctx.lineTo(552,258);
   ctx.lineWidth=13;ctx.strokeStyle='#b7824e';ctx.stroke();
  }
  ctx.restore();
 }
}
