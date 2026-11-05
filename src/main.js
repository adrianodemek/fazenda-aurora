import {CROPS} from './config/gameConfig.js';
import {loadState,saveState,interact,levelOf} from './systems/farm.js?v=027';
import {Renderer} from './world/renderer.js?v=027';
import {PointerControls} from './input/pointer.js?v=025';
import {setupFullscreen} from './ui/fullscreen.js';
const state=loadState(),canvas=document.getElementById('map'),renderer=new Renderer(canvas,state);
const $=id=>document.getElementById(id),seeds=$('seeds');
let timer;
function update(){
 $('coins').textContent=state.coins.toLocaleString('pt-BR');
 $('level').textContent=levelOf(state.xp).level;
 const count=Object.keys(state.plants).length;
 $('status').textContent=count?count+' canteiros em cultivo':'Toque num canteiro para plantar';
 for(const button of seeds.querySelectorAll('button')){const active=button.dataset.seed===state.selectedSeed;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
}
function notify(message){const el=$('message');el.textContent=message;el.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('visible'),2200);}
for(const [id,item] of Object.entries(CROPS)){
 const button=document.createElement('button');button.className='seed';button.dataset.seed=id;button.innerHTML='<span class="emoji">'+item.icon+'</span><span class="detail"><b>'+item.name+'</b><small>🪙 '+item.cost+' · '+(item.ms/1000)+'s</small></span>';
 button.onclick=()=>{state.selectedSeed=id;saveState(state);update();notify(item.name+' selecionado');};
 seeds.append(button);
}
setupFullscreen({
 root:document.getElementById('game'),
 button:$('fullscreen'),
 onFeedback:notify,
 onResize:()=>renderer.resize()
});
new PointerControls(canvas,renderer,(r,c)=>{const res=interact(state,r,c);if(res.changed)update();notify(res.message);});
$('plus').onclick=()=>renderer.zoom(1.14);
$('minus').onclick=()=>renderer.zoom(1/1.14);
$('center').onclick=()=>renderer.recenter();
addEventListener('resize',()=>renderer.resize());
update();
let last=0;
function frame(t){requestAnimationFrame(frame);if(t-last<33)return;last=t;renderer.render(t);}
requestAnimationFrame(frame);
