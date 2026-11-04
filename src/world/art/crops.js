// Cultivos ilustrados em Canvas, separados da lógica de plantio.
// Valores em unidades de mundo (cada canteiro mantém 100 x 50).
import {CROPS} from '../../config/gameConfig.js';
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function leaf(ctx,x,y,dx,dy,len,width,fill,stroke){
 ctx.beginPath();ctx.moveTo(x,y);
 ctx.quadraticCurveTo(x+dx-width,y+dy-len*.55,x+dx,y+dy-len);
 ctx.quadraticCurveTo(x+dx+width,y+dy-len*.4,x,y);
 ctx.fillStyle=fill;ctx.fill();
 if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke();}
}
function ellipse(ctx,x,y,rx,ry,color,rotation=0){
 ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
}
function stem(ctx,x,y,targetX,targetY,width=2.3){
 ctx.beginPath();ctx.moveTo(x,y);
 ctx.quadraticCurveTo(x+(targetX-x)*.3,y-10,targetX,targetY);
 ctx.lineWidth=width;ctx.lineCap='round';ctx.strokeStyle='#3c8848';ctx.stroke();
}
function berry(ctx,x,y,size){
 ellipse(ctx,x,y,size*.75,size,'#ae313e',-.3);
 ellipse(ctx,x-1.2,y-1.5,size*.68,size*.88,'#ee4750',-.3);
 leaf(ctx,x-1,y-size*.84,-size*.5,-size*.16,3.5,2.7,'#3d974b');
 leaf(ctx,x-1,y-size*.84,size*.6,0,3.5,2.7,'#4da14e');
 ellipse(ctx,x-2,y-2,size*.18,size*.24,'#ffb6a2',-.3);
 for(const [dx,dy] of [[-2,2],[2,-1],[0,4]])ellipse(ctx,x+dx*.65,y+dy*.65,.6,.9,'#ffe39a',-.3);
}
function wheat(ctx,x,y,p,sway){
 const height=7+p*31,tip=y-height;
 stem(ctx,x,y,x+sway,tip,2.1);
 leaf(ctx,x,y-3,-8,-1,height*.45,3.5,'#7ea94b','#638f44');
 leaf(ctx,x,y-5,8,-5,height*.38,3.1,'#9ab65a');
 if(p>.49){
  const golden=p>.79?'#ecc05d':'#a5ba61';
  for(let i=0;i<6;i++){
   const yy=tip+i*3.2,side=i%2?-1:1;
   ellipse(ctx,x+sway+side*3,yy,2.3,4.7,golden,side*.35);
   ellipse(ctx,x+sway-1,yy-1,.8,2.4,'#fff1ae',.3);
  }
  stem(ctx,x+sway,tip+1,x+sway,tip-9*p,1);
 }
}
function carrot(ctx,x,y,p,sway){
 const height=6+p*27;
 for(let i=-2;i<=2;i++){
  const tx=x+sway+i*(3+p*2),ty=y-height*(.75+Math.abs(i)*.05);
  stem(ctx,x,y,tx,ty,1.8);
  leaf(ctx,x+(tx-x)*.7,y-height*.5,i*2,-5,6+p*9,2.2,'#5ba94c');
  if(p>.5)leaf(ctx,tx,ty,-i*2,-2,5+p*8,2.5,'#77bf58');
 }
 if(p>.75){
  ellipse(ctx,x,y-4,5,6,'#ee8b42');
  ellipse(ctx,x-1,y-7,3,2,'#ffbb6a');
 }
}
function strawberry(ctx,x,y,p,sway){
 const height=7+p*24;
 stem(ctx,x,y,x+sway,y-height,2.3);
 for(const [dx,dy] of [[-10,-6],[11,-8],[-3,-14],[8,-19]]){
  const tx=x+dx*(.42+p*.58),ty=y-height+dy*.4;
  leaf(ctx,x,y-height*.3,tx-x,ty-y+height*.3,6+p*8,4.5,'#4da552','#307c41');
  if(p>.33)leaf(ctx,x+dx*.5,y-height*.65,dx*.18,-3,5+p*7,3.4,'#78bf59');
 }
 if(p>.72){
  berry(ctx,x-8,y-height*.53,3+4*p);
  berry(ctx,x+10,y-height*.62,3+4*p);
  berry(ctx,x,y-height*.22,2.5+3.2*p);
 }else if(p>.45){
  ellipse(ctx,x-8,y-height*.53,3,3,'#fff6d2');
  ellipse(ctx,x+8,y-height*.62,3,3,'#fff6d2');
 }
}
function seedling(ctx,x,y,p){
 ellipse(ctx,x,y+1,4.5,1.6,'#674c32');
 if(p>.12){
  stem(ctx,x,y,x,y-(3+p*12),1.4);
  leaf(ctx,x,y-p*7,-5,0,3.5+p*5,2.6,'#7dbd55');
  leaf(ctx,x,y-p*7,5,0,3.5+p*5,2.5,'#9bcc69');
 }
}
export function drawCropIllustrated(ctx,x,y,plant,time=0,now=Date.now()){
 const data=CROPS[plant.seed];if(!data)return;
 const p=clamp((now-plant.at)/data.ms,0,1);
 const sway=Math.sin(time/950+(x+y)*.02)*.8;
 const places=[[-22,1],[-10,-6],[7,-7],[23,0],[-2,9]];
 for(let i=0;i<places.length;i++){
  const [dx,dy]=places[i],px=x+dx,py=y+dy;
  if(p<.21){seedling(ctx,px,py,p/.21);continue;}
  const stage=clamp((p-.12)/.88,0,1);
  if(plant.seed==='wheat')wheat(ctx,px,py,stage,sway*(1+i*.1));
  else if(plant.seed==='carrot')carrot(ctx,px,py,stage,sway);
  else strawberry(ctx,px,py,stage,sway);
 }
 if(p>=1){
  ellipse(ctx,x,y-54,11,10,'#fff6ce');
  ctx.font='bold 16px sans-serif';ctx.fillStyle='#41844b';
  ctx.textAlign='center';ctx.fillText('✓',x,y-49);
 }
}
