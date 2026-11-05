// Ilustração da sede renderizada sobre a posição lógica fixa.
// Trocar de sede apenas muda o nível do estado e a entrada no catálogo.
import {headquartersAssetUrl,headquartersForLevel} from '../../data/headquarters.js';
import {drawFarmSprite} from './sprites.js';
export class HeadquartersArt{
  constructor(){this.images=new Map();}
  imageFor(level){
    const def=headquartersForLevel(level);
    if(!this.images.has(def.level)){
      if(typeof Image==='undefined')return null;
      const img=new Image();
      img.decoding='async';
      img.src=headquartersAssetUrl(def.level);
      this.images.set(def.level,img);
    }
    return this.images.get(def.level);
  }
  draw(ctx,level,x,y){
    const def=headquartersForLevel(level);
    const sprite=this.imageFor(def.level);
    return drawFarmSprite(ctx,sprite,x-def.width/2,y+def.bottomOffset-def.height,def.width,def.height);
  }
}
