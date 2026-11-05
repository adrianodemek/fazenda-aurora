// Layout da Fazenda Aurora — referência nostálgica Colheita Feliz.
// Todas as coordenadas são do mundo isométrico, independentes do tamanho
// da tela. Mudar zoom não altera o endereço dos 30 canteiros já salvos.
export const FARM_VIEW_REFERENCE = Object.freeze({
  width:1871, height:841,
  plotCenter:Object.freeze({x:-125,y:287.5}),
  plotScreen:Object.freeze({x:.29,y:.52})
});
export const WORLD_BOUNDS=Object.freeze({
 left:-850,right:950,top:-300,bottom:990
});
export const FARM_OBJECTS=Object.freeze({
 headquarters:Object.freeze({x:165,y:245}),
 doghouse:Object.freeze({x:-285,y:180}),
 pond:Object.freeze({x:-455,y:25}),
 animalPen:Object.freeze({x:340,y:145,width:520,height:320})
});
export const SCENERY_TREES=Object.freeze([
 {x:-630,y:210},{x:-530,y:375},{x:-460,y:620},
 {x:-600,y:-30},{x:-315,y:-40},
 {x:-110,y:-85},{x:155,y:-105},
 {x:430,y:-105},{x:760,y:10},
 {x:865,y:430},{x:655,y:575},
 {x:355,y:685},{x:-80,y:740}
]);
export const FARM_PATH=Object.freeze([
 {x:-290,y:205},{x:-190,y:185},{x:-35,y:205},
 {x:105,y:280},{x:265,y:340},{x:390,y:420}
]);
// Metadados do curral: versões futuras poderão manter as cercas
// e renderizar animais dinâmicos por outro sistema.
export const PEN_ANIMAL_SPOTS=Object.freeze([
 Object.freeze({kind:'cow',x:.61,y:.45,width:.28,height:.37}),
 Object.freeze({kind:'sheep',x:.36,y:.49,width:.22,height:.29}),
 Object.freeze({kind:'hen',x:.72,y:.68,width:.12,height:.18})
]);
