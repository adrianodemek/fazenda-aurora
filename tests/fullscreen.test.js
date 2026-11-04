import test from 'node:test';
import assert from 'node:assert/strict';
import {setupFullscreen} from '../src/ui/fullscreen.js';

function environment(supported=true) {
 const events=new Map();
 const attrs={};
 const button={
  handlers:{},
  addEventListener(type,fn){this.handlers[type]=fn;},
  setAttribute(key,value){attrs[key]=value;},
  getAttribute(key){return attrs[key];},
  title:''
 };
 const doc={
  fullscreenElement:null,
  addEventListener(type,fn){events.set(type,fn);},
  exitFullscreen:async()=>{doc.fullscreenElement=null;events.get('fullscreenchange')?.();}
 };
 const root=supported?{
  requestFullscreen:async()=>{doc.fullscreenElement=root;events.get('fullscreenchange')?.();}
 }:{};
 globalThis.document=doc;
 globalThis.screen={orientation:{lock:async()=>{}}};
 globalThis.requestAnimationFrame=(cb)=>cb();
 return {root,button,doc};
}

test('botão entra e sai da tela cheia e atualiza acessibilidade',async()=>{
 const {root,button}=environment();
 setupFullscreen({root,button});
 assert.equal(button.getAttribute('aria-pressed'),'false');
 await button.handlers.click();
 assert.equal(button.getAttribute('aria-pressed'),'true');
 assert.equal(button.getAttribute('aria-label'),'Sair da tela cheia');
 await button.handlers.click();
 assert.equal(button.getAttribute('aria-pressed'),'false');
});

test('navegador sem suporte informa o usuário sem erro',async()=>{
 const {root,button}=environment(false);
 const notices=[];
 setupFullscreen({root,button,onFeedback:msg=>notices.push(msg)});
 await button.handlers.click();
 assert.equal(button.getAttribute('aria-pressed'),'false');
 assert.match(notices[0],/não disponível/);
});
