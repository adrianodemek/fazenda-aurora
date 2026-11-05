// Catálogo de sedes. Níveis de sede são independentes do nível de experiência.
// Adicionar novas sedes aqui e seus sprites em public/assets/buildings/headquarters.
export const HEADQUARTERS = Object.freeze({
  1: Object.freeze({
    level:1,
    name:'Sede Inicial',
    sprite:'../../public/assets/buildings/headquarters/level-01.webp?v=027',
    row:3, col:9,
    width:270, height:196,
    bottomOffset:27
  })
});
export function headquartersForLevel(level=1){
  return HEADQUARTERS[level] || HEADQUARTERS[1];
}
export function normalizeHeadquartersLevel(level){
  return Number.isInteger(level) && HEADQUARTERS[level] ? level : 1;
}
export function headquartersAssetUrl(level=1){
  return new URL(headquartersForLevel(level).sprite,import.meta.url).href;
}
