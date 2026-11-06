import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles/game.css',import.meta.url),'utf8');
const controls=html.match(/<aside class="zoom"[\s\S]*?<\/aside>/)?.[0];

test('botão fullscreen aparece uma vez dentro da coluna do zoom',()=>{
 assert.ok(controls,'coluna zoom ausente');
 assert.equal((html.match(/id="fullscreen"/g)||[]).length,1);
 assert.match(controls,/id="fullscreen"/);
 const ids=[...controls.matchAll(/id="(plus|minus|fullscreen|center)"/g)].map(m=>m[1]);
 assert.deepEqual(ids,['plus','minus','fullscreen','center']);
});
test('fullscreen usa a mesma posição dos botões do zoom, sem posição fixa',()=>{
 assert.match(css,/\.zoom\s*\{position:absolute/);
 assert.match(css,/\.zoom #fullscreen\s*\{/);
 assert.doesNotMatch(css,/\.fullscreen-btn|fullscreen-btn\{/);
 assert.doesNotMatch(controls,/position:fixed/);
});
test('versão e assets sem cache antigo',()=>{
 assert.match(html,/V0\.3\.2/);
 assert.match(html,/game\.css\?v=032/);
 assert.match(html,/main\.js\?v=032/);
});
test('interface enxuta e acessível',()=>{
 assert.match(controls,/aria-label="Entrar em tela cheia"/);
 assert.match(html,/type="module" src="\.\/src\/main\.js/);
 assert.ok(html.length<6000);
});
