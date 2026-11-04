import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles/game.css',import.meta.url),'utf8');

test('botão de tela cheia aparece uma única vez na página',()=>{
  assert.equal((page.match(/id="fullscreen"/g)||[]).length,1);
  assert.match(page,/TELA CHEIA/);
  assert.match(page,/aria-label="Entrar em tela cheia"/);
});

test('tela cheia tem posição fixa, prioridade e espaço reservado',()=>{
  assert.match(page,/position:fixed;z-index:1000/);
  assert.match(page,/right:calc\(10px \+ env\(safe-area-inset-right,0px\)\)/);
  assert.match(css,/topbar\{padding-right:calc\(147px/);
});

test('versão visível e assets com cache atualizado',()=>{
  assert.match(page,/V0\.2\.3/);
  assert.match(page,/game\.css\?v=023/);
  assert.match(page,/main\.js\?v=023/);
});

test('jogo mantém entrada modular',()=>{
  assert.match(page,/type="module" src="\.\/src\/main\.js/);
  assert.ok(page.length<6000,'HTML principal não deve virar arquivo monolítico');
});
