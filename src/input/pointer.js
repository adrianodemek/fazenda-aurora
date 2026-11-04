export class PointerControls{
 constructor(canvas,renderer,onTile){
  this.canvas=canvas;this.renderer=renderer;this.onTile=onTile;
  this.active=new Map();this.moved=false;this.start=null;this.pinch=0;
  canvas.addEventListener('pointerdown',e=>this.down(e));
  canvas.addEventListener('pointermove',e=>this.move(e));
  canvas.addEventListener('pointerup',e=>this.up(e));
  canvas.addEventListener('pointercancel',e=>this.up(e,true));
  canvas.addEventListener('wheel',e=>{e.preventDefault();renderer.zoom(e.deltaY<0?1.1:1/1.1,e.clientX,e.clientY);},{passive:false});
 }
 distance(){const p=[...this.active.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
 down(e){this.canvas.setPointerCapture(e.pointerId);this.active.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.active.size===1){this.start={x:e.clientX,y:e.clientY};this.moved=false;}if(this.active.size===2){this.pinch=this.distance();this.moved=true;}}
 move(e){
  if(!this.active.has(e.pointerId)){if(e.pointerType==='mouse')this.renderer.hover=this.renderer.hit(e.clientX,e.clientY);return;}
  const old=this.active.get(e.pointerId);this.active.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(this.active.size>=2){
   const pts=[...this.active.values()],d=this.distance();if(this.pinch)this.renderer.zoom(d/this.pinch,(pts[0].x+pts[1].x)/2,(pts[0].y+pts[1].y)/2);
   this.pinch=d;this.moved=true;return;
  }
  if(this.start&&Math.hypot(e.clientX-this.start.x,e.clientY-this.start.y)>7)this.moved=true;
  if(this.moved){this.renderer.x+=e.clientX-old.x;this.renderer.y+=e.clientY-old.y;this.renderer.manualView=true;}
  else this.renderer.hover=this.renderer.hit(e.clientX,e.clientY);
 }
 up(e,cancelled=false){
  if(!this.active.has(e.pointerId))return;
  if(!cancelled&&!this.moved&&this.active.size===1){const pos=this.renderer.hit(e.clientX,e.clientY);if(pos)this.onTile(pos.r,pos.c);}
  this.active.delete(e.pointerId);
  if(!this.active.size){this.moved=false;this.pinch=0;this.start=null;}else this.moved=true;
 }
}
