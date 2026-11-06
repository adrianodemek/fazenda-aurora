import {MAP_SIZE,TILE_W,TILE_H,PLOTS} from '../config/gameConfig.js?v=032';
import {createTerrainLayer} from './art/terrain.js?v=032';
import {initialFarmView,minimumFarmZoom,maximumFarmZoom,constrainFarmCamera} from './camera.js?v=029';
import {FARM_OBJECTS,SCENERY_TREES} from './layout.js?v=029';
import {loadFarmSprites,drawFarmSprite} from './art/sprites.js?v=026';
import {drawCropIllustrated} from './art/crops.js?v=026';
import {HeadquartersArt} from './art/headquarters.js?v=027';
import {DoghouseArt} from './art/doghouse.js?v=028';
import {AnimalPenArt} from './art/animalPen.js?v=029';
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const key=(r,c)=>r+':'+c;
function polygon(ctx,p,fill,stroke){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function diamond(ctx,x,y,color,stroke){polygon(ctx,[[x,y-TILE_H/2],[x+TILE_W/2,y],[x,y+TILE_H/2],[x-TILE_W/2,y]],color,stroke);}
function ellipse(ctx,x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function line(ctx,x,y,xx,yy,color,w=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();}
function house(ctx,x,y){
 ellipse(ctx,x+4,y+9,72,18,'#42634155');
 polygon(ctx,[[x-55,y-55],[x,y-28],[x,y+15],[x-55,y-13]],'#ead6a9','#ac8b60');
 polygon(ctx,[[x,y-28],[x+55,y-55],[x+55,y-13],[x,y+15]],'#faebc6','#ac8b60');
 polygon(ctx,[[x-64,y-57],[x-24,y-105],[x+8,y-125],[x-20,y-76]],'#b5513e','#8e4638');
 polygon(ctx,[[x-20,y-76],[x+8,y-125],[x+65,y-83],[x+38,y-35]],'#dc7750','#9d4e38');
 polygon(ctx,[[x-64,y-57],[x-20,y-76],[x+38,y-35],[x-4,y-14]],'#d76847','#9d4e38');
 polygon(ctx,[[x+10,y-25],[x+31,y-35],[x+31,y-2],[x+10,y+9]],'#855b3c');
 polygon(ctx,[[x-43,y-40],[x-26,y-31],[x-26,y-13],[x-43,y-23]],'#8dd0da','#fff7de');
 polygon(ctx,[[x+37,y-48],[x+49,y-54],[x+49,y-36],[x+37,y-30]],'#8dd0da','#fff7de');
}
function barn(ctx,x,y){
 ellipse(ctx,x,y+9,62,15,'#40603544');
 polygon(ctx,[[x-42,y-43],[x,y-20],[x,y+14],[x-42,y-7]],'#dcaa79','#a17f50');
 polygon(ctx,[[x,y-20],[x+47,y-44],[x+47,y-8],[x,y+14]],'#edc795','#a17f50');
 polygon(ctx,[[x-52,y-45],[x-19,y-82],[x+12,y-101],[x-16,y-66]],'#789c6e','#567b5b');
 polygon(ctx,[[x-16,y-66],[x+12,y-101],[x+55,y-68],[x+26,y-29]],'#608d63','#527857');
 polygon(ctx,[[x-52,y-45],[x-16,y-66],[x+26,y-29],[x-10,y-9]],'#92b480','#527857');
 polygon(ctx,[[x-26,y-28],[x-5,y-17],[x-5,y+8],[x-26,y-4]],'#896044');
}
function tree(ctx,x,y,seed,time){
 const sw=Math.sin(time/850+seed)*.7;
 ellipse(ctx,x+4,y+5,28,10,'#40663d55');
 polygon(ctx,[[x-5,y],[x-5,y-44],[x+6,y-44],[x+7,y]],'#8b6743');
 for(const [dx,dy,r,color] of [[-18,-58,22,'#5a9b57'],[10,-70,24,'#65a75e'],[23,-49,21,'#74b469'],[-5,-83,20,'#80b86b'],[0,-42,23,'#508e51']])
  ellipse(ctx,x+dx+sw,y+dy,r,r*.85,color);
}
export class Renderer{
 constructor(canvas,state){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;
  this.scale=.65;this.x=0;this.y=0;this.hover=null;this.width=0;this.height=0;
  this.terrain=createTerrainLayer();
  // Recria a camada estática apenas quando o sprite de grama termina
  // de carregar. Nada é sobreposto aos cultivos durante os frames.
  this.blockedSprite=null;
  if(typeof Image!=='undefined'){
   const image=new Image();
   image.decoding='async';
   image.onload=()=>{this.terrain=createTerrainLayer(image);};
   image.src=new URL('../../public/assets/plots/grass-blocked-01.webp?v=032',import.meta.url).href;
   this.blockedSprite=image;
   if(image.complete&&image.naturalWidth>0)this.terrain=createTerrainLayer(image);
  }
  this.sprites=loadFarmSprites();
  this.headquartersArt=new HeadquartersArt();
  this.doghouseArt=new DoghouseArt();
  this.animalPenArt=new AnimalPenArt();
  this.resize();
 }
 resize(){
  const oldW=this.width,oldH=this.height;
  const focus=(oldW && this.manualView)?this.toWorld(oldW/2,oldH/2):null;
  const relativeZoom=oldW && this.manualView
   ? this.scale/minimumFarmZoom(oldW,oldH):1;
  const rect=this.canvas.getBoundingClientRect();
  const w=rect.width||innerWidth,h=rect.height||innerHeight;
  this.width=w;this.height=h;
  this.dpr=Math.min(2,window.devicePixelRatio||1);
  this.canvas.width=Math.round(w*this.dpr);
  this.canvas.height=Math.round(h*this.dpr);
  if(focus){
    this.scale=Math.min(maximumFarmZoom(w,h),
      Math.max(minimumFarmZoom(w,h),relativeZoom*minimumFarmZoom(w,h)));
    this.x=w/2-focus.x*this.scale;
    this.y=h/2-focus.y*this.scale;
    this.constrain();
  } else this.recenter();
 }
 recenter(){
  const view=initialFarmView(this.width,this.height);
  this.scale=view.scale;this.x=view.x;this.y=view.y;
  this.manualView=false;
 }
 constrain(){
  const view=constrainFarmCamera({
   scale:this.scale,x:this.x,y:this.y
  },this.width,this.height);
  this.scale=view.scale;this.x=view.x;this.y=view.y;
 }
 pan(dx,dy){
  this.x+=dx;this.y+=dy;
  this.manualView=true;this.constrain();
 }
 tile(r,c){return {x:(c-r)*TILE_W/2,y:(c+r)*TILE_H/2};}
 toWorld(x,y){return {x:(x-this.x)/this.scale,y:(y-this.y)/this.scale};}
 hit(x,y){
  const p=this.toWorld(x,y),u=p.x/(TILE_W/2),v=p.y/(TILE_H/2);
  const c=Math.round((u+v)/2),r=Math.round((v-u)/2);
  if(r<0||c<0||r>=MAP_SIZE||c>=MAP_SIZE)return null;
  const q=this.tile(r,c);return Math.abs(p.x-q.x)/(TILE_W/2)+Math.abs(p.y-q.y)/(TILE_H/2)<=1.02?{r,c}:null;
 }
 zoom(factor,x=this.width/2,y=this.height*.44){
  const before=this.toWorld(x,y);
  const old=this.scale;
  this.scale=Math.min(maximumFarmZoom(this.width,this.height),
   Math.max(minimumFarmZoom(this.width,this.height),old*factor));
  if(Math.abs(this.scale-old)<.000001)return false;
  this.x=x-before.x*this.scale;
  this.y=y-before.y*this.scale;
  this.manualView=true;
  this.constrain();
  return true;
 }
 render(t){
  const ctx=this.ctx,w=this.width,h=this.height;
  ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#cce9ab');bg.addColorStop(1,'#8abf79');
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(this.x,this.y);ctx.scale(this.scale,this.scale);
  // Cache do terreno estático: no frame desenhamos apenas uma imagem.
  ctx.drawImage(this.terrain.canvas,this.terrain.offsetX,this.terrain.offsetY);
  // Composição clássica: lago no canto esquerdo, horta grande embaixo,
  // casinha do cachorro à esquerda, sede central e cercado à direita.
  const actors=SCENERY_TREES.map((p,i)=>({
   x:p.x,y:p.y,type:'tree',i
  }));
  actors.push(
   {...FARM_OBJECTS.headquarters,type:'house'},
   {...FARM_OBJECTS.doghouse,type:'doghouse'},
   {...FARM_OBJECTS.animalPen,type:'animalPen',y:FARM_OBJECTS.animalPen.y+FARM_OBJECTS.animalPen.height*.75,pen:FARM_OBJECTS.animalPen}
  );
  for(const [id,p] of Object.entries(this.state.plants)){
   if(!PLOTS.has(id))continue;
   const [r,c]=id.split(':').map(Number);
   const q=this.tile(r,c);
   actors.push({...q,type:'crop',p});
  }
  // Ordenação de profundidade: o objeto mais próximo cobre o que está atrás.
  actors.sort((a,b)=>a.y-b.y);
  for(const a of actors){
   const q=a;
   if(a.type==='tree'){
    if(!drawFarmSprite(ctx,this.sprites.tree,q.x-61,q.y-134,122,146))
     tree(ctx,q.x,q.y,a.i,t);
   } else if(a.type==='house'){
    if(!this.headquartersArt.draw(ctx,this.state.headquartersLevel||1,q.x,q.y) &&
       !drawFarmSprite(ctx,this.sprites.house,q.x-120,q.y-200,240,225)){
     ctx.save();ctx.translate(q.x,q.y);ctx.scale(1.32,1.32);
     house(ctx,0,0);ctx.restore();
    }
   } else if(a.type==='animalPen'){
    this.animalPenArt.draw(ctx,a.pen);
   } else if(a.type==='doghouse'){
    if(!this.doghouseArt.draw(ctx,q.x,q.y) &&
       !drawFarmSprite(ctx,this.sprites.barn,q.x-72,q.y-115,144,132)){
     ctx.save();ctx.translate(q.x,q.y);ctx.scale(.82,.82);
     barn(ctx,0,0);ctx.restore();
    }
   } else drawCropIllustrated(ctx,q.x,q.y,a.p,t);
  }
  if(this.hover&&PLOTS.has(key(this.hover.r,this.hover.c))){const q=this.tile(this.hover.r,this.hover.c);ctx.strokeStyle='#fff2a4';ctx.lineWidth=3;diamond(ctx,q.x,q.y,'#fff7a322','#fff2a4');}
  ctx.restore();
 }
}
