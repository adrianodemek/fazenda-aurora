export const MAP_SIZE=14;
export const TILE_W=100, TILE_H=50;
export const SAVE_KEY='fazenda-aurora-demo-v01';
export const CROPS=Object.freeze({
 wheat:{name:'Trigo',icon:'🌾',cost:2,sell:7,ms:15000,xp:4,color:'#edc75c'},
 carrot:{name:'Cenoura',icon:'🥕',cost:4,sell:13,ms:25000,xp:7,color:'#ed9549'},
 strawberry:{name:'Morango',icon:'🍓',cost:6,sell:21,ms:40000,xp:11,color:'#da5665'}
});
export const PLOTS=new Set(Array.from({length:5},(_,r)=>Array.from({length:6},(_,c)=>(r+5)+':'+(c+2))).flat());
export const TREES=[[1,2],[2,3],[3,1],[2,11],[5,12],[9,1],[11,2],[12,4],[12,11],[10,12]];
