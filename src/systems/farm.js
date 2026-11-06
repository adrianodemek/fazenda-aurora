import {CROPS,PLOTS,FREE_PLOTS,LEGACY_PLOTS,SAVE_KEY} from '../config/gameConfig.js';
import {normalizeHeadquartersLevel} from '../data/headquarters.js';
export function freshState(){return {coins:80,xp:0,selectedSeed:'wheat',plants:{},harvests:0,headquartersLevel:1,unlockedPlots:[]};}
export function isPlotUnlocked(state,key){return FREE_PLOTS.has(key) || (Array.isArray(state.unlockedPlots)&&state.unlockedPlots.includes(key));}
export function loadState(){
 const initial=freshState();
 try {
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY));
  if(!raw||typeof raw!=='object')return initial;
  if(Number.isFinite(raw.coins))initial.coins=Math.max(0,Math.floor(raw.coins));
  if(Number.isFinite(raw.xp))initial.xp=Math.max(0,Math.floor(raw.xp));
  if(Number.isFinite(raw.harvests))initial.harvests=Math.max(0,Math.floor(raw.harvests));
  initial.headquartersLevel=normalizeHeadquartersLevel(raw.headquartersLevel);
  if(Array.isArray(raw.unlockedPlots))initial.unlockedPlots=[...new Set(raw.unlockedPlots.filter(key=>typeof key==='string'&&PLOTS.has(key)&&!FREE_PLOTS.has(key)))];
  if(CROPS[raw.selectedSeed])initial.selectedSeed=raw.selectedSeed;
  if(raw.plants&&typeof raw.plants==='object')
   for(const [key,p] of Object.entries(raw.plants))
    if(LEGACY_PLOTS.has(key)&&p&&CROPS[p.seed]&&Number.isFinite(p.at))initial.plants[key]={seed:p.seed,at:p.at};
 } catch { /* navegador pode bloquear armazenamento */ }
 return initial;
}
export function saveState(state){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{}}
export function levelOf(xp){
 let level=1,lower=0,needed=40;
 while(xp>=lower+needed&&level<999){lower+=needed;level++;needed=40+25*(level-1);}
 return {level,progress:(xp-lower)/needed};
}
export function interact(state,row,col,now=Date.now()){
 const key=row+':'+col;
 if(!PLOTS.has(key) && !(LEGACY_PLOTS.has(key)&&state.plants[key]))
  return {changed:false,message:'Selecione um canteiro da horta 🌱'};
 const p=state.plants[key];
 if(p){
  const item=CROPS[p.seed],elapsed=now-p.at;
  if(elapsed<item.ms)return {changed:false,message:item.name+' cresce em '+Math.ceil((item.ms-elapsed)/1000)+' s 🌱'};
  state.coins+=item.sell;state.xp+=item.xp;state.harvests++;
  delete state.plants[key];saveState(state);
  return {changed:true,message:item.name+' colhido! +'+item.sell+' moedas 🪙'};
 }
 if(!PLOTS.has(key)||!isPlotUnlocked(state,key))return {changed:false,message:'Terreno com mato bloqueado — expansão em breve 🔒'};
 const seed=CROPS[state.selectedSeed];
 if(state.coins<seed.cost)return {changed:false,message:'Moedas insuficientes'};
 state.coins-=seed.cost;state.plants[key]={seed:state.selectedSeed,at:now};
 saveState(state);
 return {changed:true,message:seed.name+' plantado! 🌱'};
}
