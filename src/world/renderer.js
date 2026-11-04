import {MAP_SIZE,TILE_W,TILE_H,PLOTS,TREES,CROPS} from '../config/gameConfig.js';
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
function crop(ctx,x,y,p,time){
 const item=CROPS[p.seed];if(!item)return;
 const progress=clamp((Date.now()-p.at)/item.ms,0,1);
 for(const [dx,dy] of [[-20,0],[-9,-6],[8,-8],[23,1],[-1,8]]){
  const h=6+progress*16;
  line(ctx,x+dx,y+dy,x+dx,y+dy-h,'#4b9148',2);
  ellipse(ctx,x+dx-3,y+dy-h*.8,5,3,'#74b65a');
  if(progress>.72)ellipse(ctx,x+dx,y+dy-h-2,4,6,item.color);
 }
 if(progress>=1){ellipse(ctx,x,y-38,11,10,'#fff6ce');ctx.font='bold 16px sans-serif';ctx.fillStyle='#42804b';ctx.textAlign='center';ctx.fillText('✓',x,y-33);}
}
export class Renderer{
 constructor(canvas,state){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;
  this.scale=.65;this.x=0;this.y=0;this.hover=null;this.width=0;this.height=0;
  this.resize();
 }
 resize(){
  const rect=this.canvas.getBoundingClientRect(),w=rect.width||innerWidth,h=rect.height||innerHeight;
  const previous=this.width;this.width=w;this.height=h;
  this.dpr=Math.min(2,window.devicePixelRatio||1);
  this.canvas.width=Math.round(w*this.dpr);this.canvas.height=Math.round(h*this.dpr);
  if(previous){this.x+=(w-previous)/2;this.y+=(h-this.oldHeight)/2;}else this.recenter();
  this.oldHeight=h;
 }
 recenter(){
  const widthFit=(this.width-40)/(MAP_SIZE*TILE_W);
  const heightFit=(this.height-(this.height<540?95:180))/(MAP_SIZE*TILE_H);
  this.scale=clamp(Math.min(widthFit,heightFit)*1.08,.3,1.1);
  this.x=this.width/2;this.y=this.height*.44-((MAP_SIZE-1)*TILE_H/2)*this.scale;
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
  const before=this.toWorld(x,y);this.scale=clamp(this.scale*factor,.28,1.8);this.x=x-before.x*this.scale;this.y=y-before.y*this.scale;
 }
 render(t){
  const ctx=this.ctx,w=this.width,h=this.height;
  ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#cce9ab');bg.addColorStop(1,'#8abf79');
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(this.x,this.y);ctx.scale(this.scale,this.scale);
  const tl=this.tile(0,0),tr=this.tile(0,MAP_SIZE-1),br=this.tile(MAP_SIZE-1,MAP_SIZE-1),bl=this.tile(MAP_SIZE-1,0);
  polygon(ctx,[[tl.x,tl.y-TILE_H/2],[tr.x+TILE_W/2,tr.y],[br.x,br.y+TILE_H/2+12],[bl.x-TILE_W/2,bl.y+10]],'#77a961');
  for(let depth=0;depth<MAP_SIZE*2-1;depth++)
   for(let r=Math.max(0,depth-MAP_SIZE+1);r<=Math.min(depth,MAP_SIZE-1);r++){
    const c=depth-r,q=this.tile(r,c),soil=PLOTS.has(key(r,c));
    diamond(ctx,q.x,q.y,soil?'#bb8652':(r+c)%3?'#a4d27b':'#9ccd72',soil?'#9a704c':'#8cbd70');
    if(soil){diamond(ctx,q.x,q.y-2,'#ae7748','#996b44');for(let i=-1;i<=1;i++)line(ctx,q.x-22+i*13,q.y+6,q.x+12+i*13,q.y-12,'#815b3d77',1.5);}
   }
  const actors=TREES.map(([r,c],i)=>({r,c,type:'tree',i}));
  actors.push({r:3,c:9,type:'house'},{r:8,c:11,type:'barn'});
  for(const [id,p] of Object.entries(this.state.plants)){if(PLOTS.has(id)){const [r,c]=id.split(':').map(Number);actors.push({r,c,type:'crop',p});}}
  actors.sort((a,b)=>(a.r+a.c)-(b.r+b.c));
  for(const a of actors){const q=this.tile(a.r,a.c);if(a.type==='tree')tree(ctx,q.x,q.y,a.i,t);else if(a.type==='house')house(ctx,q.x,q.y);else if(a.type==='barn')barn(ctx,q.x,q.y);else crop(ctx,q.x,q.y,a.p,t);}
  if(this.hover&&PLOTS.has(key(this.hover.r,this.hover.c))){const q=this.tile(this.hover.r,this.hover.c);ctx.strokeStyle='#fff2a4';ctx.lineWidth=3;diamond(ctx,q.x,q.y,'#fff7a322','#fff2a4');}
  ctx.restore();
 }
}
