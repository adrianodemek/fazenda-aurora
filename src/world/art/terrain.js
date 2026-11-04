// Terreno estático da fazenda. A camada é desenhada uma vez e reutilizada
// pela câmera: evita redesenhar cada losango em todos os frames no celular.
import {MAP_SIZE, TILE_W, TILE_H, PLOTS} from '../../config/gameConfig.js';

const H_W = TILE_W / 2;
const H_H = TILE_H / 2;
const GRASS = ['#a9d47f', '#a5d078', '#aed782', '#a2cc75', '#b2d986'];
const SOIL = ['#bc8050', '#bb7c4d', '#b7824e'];

function path(ctx, coords) {
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i][0], coords[i][1]);
  ctx.closePath();
}
function poly(ctx, coords, fill, stroke) {
  path(ctx, coords);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
}
function diamond(x, y, halfWidth=H_W, halfHeight=H_H) {
  return [[x, y-halfHeight], [x+halfWidth, y],
    [x, y+halfHeight], [x-halfWidth, y]];
}
function line(ctx, x, y, xx, yy, stroke, width=1) {
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(xx,yy);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}
function oval(ctx,x,y,rx,ry,color) {
  ctx.beginPath();
  ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
  ctx.fillStyle=color;
  ctx.fill();
}
function randomish(r,c,salt) {
  // Mesmas variações em todas as renderizações, sem aleatoriedade por frame.
  const n=Math.sin(r*137.23+c*73.47+salt*47.11)*43758.54;
  return n-Math.floor(n);
}
function meadow(ctx,x,y,r,c) {
  const color=GRASS[(r*3+c*7)%GRASS.length];
  poly(ctx,diamond(x,y),color,'#8cbf70');

  // Pequenos tufos e pontos de luz preservam a leitura do grid isométrico.
  ctx.save();
  path(ctx,diamond(x,y,48,23));
  ctx.clip();
  for(let i=0;i<8;i++){
    const px=x+(randomish(r,c,i+1)-0.5)*74;
    const py=y+(randomish(r,c,i+21)-0.5)*28;
    const len=2+randomish(r,c,i+31)*4;
    line(ctx,px,py,px-1.2,py-len,'#76b05b',1.2);
    line(ctx,px,py,px+1.3,py-len*.8,'#7ab860',1);
  }
  if ((r*19+c*23)%9===0) {
    const px=x+(randomish(r,c,55)-.5)*36;
    const py=y+(randomish(r,c,56)-.5)*14;
    oval(ctx,px,py,3.6,2.6,'#fff8ca');
    oval(ctx,px+1,py-.4,1.25,1.25,'#d8b455');
  }
  if ((r*17+c*11)%13===0) {
    const px=x+(randomish(r,c,61)-.5)*42;
    const py=y+(randomish(r,c,62)-.5)*15;
    oval(ctx,px,py,3.1,2.1,'#efc2b5');
  }
  ctx.restore();
}
function plot(ctx,x,y,r,c) {
  // Canteiro levantado, com profundidade e três sulcos paralelos.
  oval(ctx,x+2,y+5,44,17,'#46653832');
  const left=[x-48,y-3], bottom=[x,y+21], right=[x+48,y-3];
  poly(ctx,[left,bottom,[x,y+27],[x-48,y+3]],'#855738');
  poly(ctx,[bottom,right,[x+48,y+3],[x,y+27]],'#95603c');
  poly(ctx,diamond(x,y-3,48,24),SOIL[(r+c)%SOIL.length],'#996844');

  // O sulco fica dentro do canteiro e é estável em cada posição.
  ctx.save();
  path(ctx,diamond(x,y-3,46,22));
  ctx.clip();
  for(let i=-2;i<=2;i++){
    const dx=i*12;
    line(ctx,x-24+dx,y+4,x+10+dx,y-14,'#885a3b',2.3);
    line(ctx,x-23+dx,y+5,x+11+dx,y-13,'#d69b66',.8);
  }
  for(let i=0;i<7;i++){
    const px=x+(randomish(r,c,i+70)-.5)*62;
    const py=y-3+(randomish(r,c,i+80)-.5)*16;
    oval(ctx,px,py,1.3,.8,'#d8a46d');
  }
  ctx.restore();
}
function pathway(ctx,x,y){
  poly(ctx,diamond(x,y,49,24),'#d8c692','#b2b87d');
  ctx.save();
  path(ctx,diamond(x,y,48,23));
  ctx.clip();
  for(let i=0;i<10;i++){
    const dx=((i*23)%72)-36,dy=((i*13)%25)-12;
    oval(ctx,x+dx,y+dy,2.8,1.5,i%2?'#c6b583':'#eee0ac');
  }
  ctx.restore();
}
function tileAt(r,c){
  return {x:(c-r)*H_W,y:(c+r)*H_H};
}
export function createTerrainLayer() {
  const canvas=document.createElement('canvas');
  canvas.width=(MAP_SIZE+1)*TILE_W;
  canvas.height=(MAP_SIZE+2)*TILE_H;
  const ctx=canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível para o terreno');
  const offsetX=canvas.width/2, offsetY=TILE_H;
  ctx.translate(offsetX,offsetY);

  const a=tileAt(0,0),b=tileAt(0,MAP_SIZE-1);
  const d=tileAt(MAP_SIZE-1,MAP_SIZE-1),e=tileAt(MAP_SIZE-1,0);
  // Laterais da ilha conferem volume sem alterar o grid lógico.
  poly(ctx,[[a.x,a.y-H_H],[b.x+H_W,b.y],[d.x,d.y+H_H+15],
    [e.x-H_W,e.y+15]],'#69995b');
  poly(ctx,[[e.x-H_W,e.y],[d.x,d.y+H_H],[d.x,d.y+H_H+15],
    [e.x-H_W,e.y+15]],'#608f54');

  for(let depth=0;depth<MAP_SIZE*2-1;depth++){
    for(let r=Math.max(0,depth-MAP_SIZE+1);r<=Math.min(depth,MAP_SIZE-1);r++){
      const c=depth-r,p=tileAt(r,c),isPlot=PLOTS.has(r+':'+c);
      const road=!isPlot&&(
        (r===3&&c===8)||(r===4&&c===9)||(r===4&&c===10)||
        (r===7&&c===11)||(r===9&&c===11)
      );
      if (isPlot) plot(ctx,p.x,p.y,r,c);
      else if (road) pathway(ctx,p.x,p.y);
      else meadow(ctx,p.x,p.y,r,c);
    }
  }
  return {canvas,offsetX:-offsetX,offsetY:-offsetY};
}
