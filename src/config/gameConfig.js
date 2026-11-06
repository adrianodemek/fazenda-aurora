export const MAP_SIZE=14;
export const TILE_W=100, TILE_H=50;
export const SAVE_KEY='fazenda-aurora-demo-v01';
export const CROPS=Object.freeze({
 wheat:{name:'Trigo',icon:'🌾',cost:2,sell:7,ms:15000,xp:4,color:'#edc75c'},
 carrot:{name:'Cenoura',icon:'🥕',cost:4,sell:13,ms:25000,xp:7,color:'#ed9549'},
 strawberry:{name:'Morango',icon:'🍓',cost:6,sell:21,ms:40000,xp:11,color:'#da5665'}
});
// Versão original do Colheita Feliz (registro de 2011): 6 terrenos
// iniciais e expansão até 28. Mais sete podem ser adicionados no futuro.
export const LEGACY_PLOTS=new Set(Array.from({length:5},(_,r)=>Array.from({length:6},(_,c)=>(r+5)+':'+(c+2))).flat());
// Horta isométrica 4×7: todos os 28 losangos dividem suas arestas.
export const PLOT_ROWS=4, PLOT_COLUMNS=7;
export const PLOTS=new Set(Array.from({length:PLOT_ROWS},(_,r)=>
 Array.from({length:PLOT_COLUMNS},(_,c)=>(5+r)+':'+(1+c))).flat());
// Os seis primeiros formam um grupo de 3x2 à esquerda da horta,
// como a área plantada na imagem-matriz do Colheita Feliz.
export const INITIAL_FREE_PLOTS=Object.freeze(['5:1','5:2','6:1','6:2','7:1','7:2']);
const remaining=[...PLOTS].filter(id=>!INITIAL_FREE_PLOTS.includes(id));
remaining.sort((a,b)=>{
 const [ar,ac]=a.split(':').map(Number),[br,bc]=b.split(':').map(Number);
 return (ar+ac)-(br+bc) || (ac-ar)-(bc-br);
});
export const PLOT_VISUAL_ORDER=Object.freeze([...INITIAL_FREE_PLOTS,...remaining]);
export const FREE_PLOTS=new Set(INITIAL_FREE_PLOTS);
export const LOCKED_PLOTS=new Set([...PLOTS].filter(key=>!FREE_PLOTS.has(key)));
export const PLOT_EXPANSION_NEXT=7;
export const PLOT_LAYOUT_VERSION=33;
export const TREES=[[1,2],[2,3],[3,1],[2,11],[5,12],[9,1],[11,2],[12,4],[12,11],[10,12]];
