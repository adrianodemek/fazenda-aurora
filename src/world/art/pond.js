// Lago ornamental desenhado como um recurso gráfico independente.
// Não ocupa nem substitui canteiros e não interfere com as regras do jogo.
function shore(ctx,x,y,rx,ry,color,seed=0){
  const steps=64;
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
    const a=i/steps*Math.PI*2;
    const wave=1+.045*Math.sin(5*a+seed)+.03*Math.cos(9*a-seed);
    const px=x+Math.cos(a)*rx*wave,py=y+Math.sin(a)*ry*wave;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function oval(ctx,x,y,rx,ry,color){
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
  ctx.fillStyle=color;ctx.fill();
}
export function drawPond(ctx,x=175,y=145){
  // Formato baixo e largo, coerente com a projeção isométrica de 2:1.
  shore(ctx,x+2,y+5,132,47,'#719d69');
  shore(ctx,x,y,133,45,'#d9cd91');
  shore(ctx,x,y-2,125,39,'#68b4c7');
  shore(ctx,x+1,y-7,116,31,'#77c8d9');
  shore(ctx,x-4,y-11,88,18,'#9bdce2');
  // Ondulações suaves, pontos de luz e pequenas pedras na margem.
  for(const [dx,dy,rx] of [[-68,-13,19],[22,-13,25],[60,0,15],[-24,7,13]]){
    ctx.beginPath();ctx.ellipse(x+dx,y+dy,rx,2.1,-.08,0,Math.PI);
    ctx.strokeStyle='#e0fcf3b0';ctx.lineWidth=2;ctx.stroke();
  }
  for(const [dx,dy,r] of [[-111,15,5],[-78,35,4],[40,40,5],[115,14,4]]){
    oval(ctx,x+dx,y+dy,r+2,r*.65,'#a2ae7e');
    oval(ctx,x+dx-1,y+dy-2,r,r*.6,'#e4d7a2');
  }
  for(const [dx,dy] of [[-102,-22],[-73,29],[94,22]]){
    for(let i=0;i<3;i++){
      ctx.beginPath();ctx.moveTo(x+dx+i*3,y+dy);
      ctx.lineTo(x+dx+i*3-3,y+dy-8-i*2);
      ctx.strokeStyle=i===1?'#547b42':'#638d48';ctx.lineWidth=1.6;ctx.stroke();
    }
  }
  // Vitória-régia discreta para escala e leitura da superfície.
  oval(ctx,x+48,y+12,10,4,'#4d9d70');
  oval(ctx,x+46,y+10,4,2,'#86c28b');
}
