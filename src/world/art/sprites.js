// Carregamento de sprites ilustrados próprios, independentes do motor
// e das regras de plantio. SVGs preservam nitidez no mobile e PC.
const ASSETS = Object.freeze({
 house:'cottage.svg',
 barn:'barn.svg',
 tree:'oak.svg'
});
export function loadFarmSprites() {
 const sprites={};
 if(typeof Image==='undefined')return sprites; // testes Node / SSR
 for(const [name,file] of Object.entries(ASSETS)){
   const image=new Image();
   image.decoding='async';
   image.src=new URL('../../../public/assets/sprites/'+file+'?v=026',import.meta.url).href;
   sprites[name]=image;
 }
 return sprites;
}
export function drawFarmSprite(ctx,image,x,y,width,height){
 if(!image || !image.complete || !image.naturalWidth)return false;
 ctx.drawImage(image,x,y,width,height);
 return true;
}
