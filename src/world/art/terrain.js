// Terreno estático da fazenda. A camada é desenhada uma vez e reutilizada
// pela câmera: evita redesenhar cada losango em todos os frames no celular.
import {MAP_SIZE, TILE_W, TILE_H, PLOTS} from '../../config/gameConfig.js';
import {drawPond} from './pond.js?v=025';
import {FARM_OBJECTS,FARM_PATH} from '../layout.js?v=029';

const H_W = TILE_W / 2;
const H_H = TILE_H / 2;
const GRASS = ['#a9d17a', '#a8d27b', '#aad17c', '#a8d17b', '#a9d27b'];
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
  poly(ctx,diamond(x,y),color);

  // Pequenos tufos e pontos de luz preservam a leitura do grid isométrico.
  ctx.save();
  path(ctx,diamond(x,y,48,23));
  ctx.clip();
  for(let i=0;i<10;i++){
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
function drawSoftPath(ctx){
 // Caminho não clicável, fica atrás das plantações e das construções.
 const p=FARM_PATH;
 ctx.save();
 ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);
 for(let i=1;i<p.length-1;i++){
  const midX=(p[i].x+p[i+1].x)/2;
  const midY=(p[i].y+p[i+1].y)/2;
  ctx.quadraticCurveTo(p[i].x,p[i].y,midX,midY);
 }
 ctx.lineTo(p[p.length-1].x,p[p.length-1].y);
 ctx.strokeStyle='#a27d4e33';ctx.lineWidth=64;ctx.stroke();
 ctx.strokeStyle='#d4b987';ctx.lineWidth=55;ctx.stroke();
 ctx.strokeStyle='#dfc99c';ctx.lineWidth=35;ctx.stroke();
 ctx.restore();
}

export function createTerrainLayer() {
  // A grama continua para fora da antiga ilha. Mesmo arrastando e
  // aproximando, nenhuma borda vazia é exposta.
  const canvas=document.createElement('canvas');
  canvas.width=2000;
  canvas.height=1450;
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Canvas 2D indisponível para o terreno');
  const offsetX=1000,offsetY=350;
  ctx.translate(offsetX,offsetY);
  ctx.fillStyle='#a9d17b';
  ctx.fillRect(-offsetX,-offsetY,canvas.width,canvas.height);
  // Textura gramada determinística: cache único, não por frame.
  for(let i=0;i<1800;i++){
    const x=-990+randomish(i,5,10)*1980;
    const y=-345+randomish(i,3,15)*1435;
    const h=2+randomish(i,13,8)*6;
    line(ctx,x,y,x-2,y-h,'#78b05a90',1);
    line(ctx,x,y,x+1.8,y-h*.78,'#88bb66b0',1);
    if(i%39===0){
      oval(ctx,x,y-4,3,2.3,i%2?'#fcf8ce':'#f6d8c6');
      oval(ctx,x+.4,y-4,1,1,'#e3c467');
    }
  }

  // Desenha grama e detalhes de todos os tiles, mas SEM borda de ilha.
  for(let depth=0;depth<MAP_SIZE*2-1;depth++)
   for(let r=Math.max(0,depth-MAP_SIZE+1);r<=Math.min(depth,MAP_SIZE-1);r++){
    const c=depth-r,p=tileAt(r,c);
    if(!PLOTS.has(r+':'+c))meadow(ctx,p.x,p.y,r,c);
   }

  drawSoftPath(ctx);

  // Canteiros são as únicas células com relevo e continuam
  // exatamente nos mesmos endereços (r,c) do salvamento antigo.
  for(let depth=0;depth<MAP_SIZE*2-1;depth++)
   for(let r=Math.max(0,depth-MAP_SIZE+1);r<=Math.min(depth,MAP_SIZE-1);r++){
    const c=depth-r;
    if(PLOTS.has(r+':'+c)){const p=tileAt(r,c);plot(ctx,p.x,p.y,r,c);}
   }

  // Lago maior, parcialmente entrando pelo alto esquerdo como no original.
  ctx.save();
  ctx.translate(FARM_OBJECTS.pond.x,FARM_OBJECTS.pond.y);
  ctx.scale(1.42,1.30);
  drawPond(ctx,0,0);
  ctx.restore();
  return {canvas,offsetX:-offsetX,offsetY:-offsetY};
}
