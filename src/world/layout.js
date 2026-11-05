// Composição do cenário isométrico — referência mobile horizontal.
// As posições são unidades de mundo, NÃO pixels do aparelho.
// Os elementos permanecem no mesmo local ao mudar zoom ou resolução.
export const FARM_VIEW_REFERENCE = Object.freeze({
  width:1871, height:841,
  plotCenter:Object.freeze({x:-125,y:287.5}),
  plotScreen:Object.freeze({x:.30,y:.51})
});

// O piso ilustrado cobre toda esta região; não há bordas de ilha vazias.
export const WORLD_BOUNDS=Object.freeze({
  left:-850, right:950, top:-300, bottom:990
});

export const FARM_OBJECTS=Object.freeze({
  headquarters:Object.freeze({x:400,y:260}),
  doghouse:Object.freeze({x:135,y:238}),
  pond:Object.freeze({x:-55,y:52})
});

// Árvores nas bordas, afastadas da horta, da sede e do lago.
export const SCENERY_TREES=Object.freeze([
 {x:-600,y:210},{x:-455,y:350},{x:-500,y:590},
 {x:-350,y:70},{x:-300,y:15},{x:-290,y:165},
 {x:95,y:-65},{x:275,y:-95},
 {x:670,y:205},{x:585,y:435},{x:395,y:610},
 {x:150,y:675},{x:-150,y:665}
]);

// Traçado da estrada decorativa: entre o lago, a casinha e a sede.
export const FARM_PATH=Object.freeze([
 {x:-10,y:153},
 {x:95,y:172},
 {x:250,y:210},
 {x:375,y:280},
 {x:535,y:420}
]);
