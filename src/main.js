import {CROPS} from './config/gameConfig.js?v=034';
import {loadState,saveState,interact,levelOf} from './systems/farm.js?v=034';
import {Renderer} from './world/renderer.js?v=035';
import {minimumFarmZoom,maximumFarmZoom} from './world/camera.js?v=029';
import {PointerControls} from './input/pointer.js?v=028';
import {setupFullscreen} from './ui/fullscreen.js';
const state=loadState(),canvas=document.getElementById('map'),renderer=new Renderer(canvas,state);
const $=id=>document.getElementById(id),seeds=$('seeds');
let timer;
function updateZoomButtons(){
 const min=minimumFarmZoom(renderer.width,renderer.height);
 const max=maximumFarmZoom(renderer.width,renderer.height);
 $('minus').disabled=renderer.scale<=min+.0001;
 $('plus').disabled=renderer.scale>=max-.0001;
}
function update(){
 $('coins').textContent=state.coins.toLocaleString('pt-BR');
 $('level').textContent=levelOf(state.xp).level;
 const count=Object.keys(state.plants).length;
 $('status').textContent=count?count+' em cultivo · 6 livres / 22 bloqueados':'6 livres · 22 com mato';
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
 onResize:()=>{renderer.resize();updateZoomButtons();}
});
new PointerControls(canvas,renderer,(r,c)=>{const res=interact(state,r,c);if(res.changed)update();notify(res.message);},updateZoomButtons);
$('plus').onclick=()=>{renderer.zoom(1.14);updateZoomButtons();};
$('minus').onclick=()=>{renderer.zoom(1/1.14);updateZoomButtons();};
$('center').onclick=()=>{renderer.recenter();updateZoomButtons();};
addEventListener('resize',()=>{renderer.resize();updateZoomButtons();});
update();
updateZoomButtons();
let last=0;
function frame(t){requestAnimationFrame(frame);if(t-last<33)return;last=t;renderer.render(t);}
requestAnimationFrame(frame);
