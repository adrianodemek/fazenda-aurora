import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {PLOTS,FREE_PLOTS,LOCKED_PLOTS,LEGACY_PLOTS,PLOT_EXPANSION_NEXT,PLOT_VISUAL_ORDER,PLOT_ROWS,PLOT_COLUMNS} from '../src/config/gameConfig.js';
import {loadState,freshState,isPlotUnlocked,interact} from '../src/systems/farm.js';

test('estado inicial segue a proporção histórica de terrenos',()=>{
 assert.equal(PLOTS.size,28);
 assert.equal(FREE_PLOTS.size,6);
 assert.equal(LOCKED_PLOTS.size,22);
 assert.equal(PLOT_EXPANSION_NEXT,7);
 assert.equal(LEGACY_PLOTS.size,30);
 assert.deepEqual([...FREE_PLOTS],['5:1','6:1','5:2','7:1','6:2','5:3']);
 assert.equal(PLOT_ROWS,4);assert.equal(PLOT_COLUMNS,7);
 assert.deepEqual([...FREE_PLOTS],PLOT_VISUAL_ORDER.slice(0,6));
 for(const id of FREE_PLOTS)assert.equal(PLOTS.has(id),true);
 for(const id of LOCKED_PLOTS)assert.equal(PLOTS.has(id),true);
 for(const id of FREE_PLOTS)assert.equal(LOCKED_PLOTS.has(id),false);
});
test('sprite aprovado está em arquivo próprio WebP transparente',()=>{
 const file=new URL('../public/assets/plots/grass-blocked-01.webp',import.meta.url);
 const buf=readFileSync(file);
 assert.equal(buf.toString('ascii',0,4),'RIFF');
 assert.equal(buf.toString('ascii',8,12),'WEBP');
 assert.ok(statSync(file).size>2000);
});
test('somente terrenos livres aceitam plantio; futuro desbloqueio é extensível',()=>{
 const s=freshState();
 assert.equal(interact(s,8,7,100).changed,false);
 assert.equal(interact(s,5,1,100).changed,true);
 assert.equal(isPlotUnlocked(s,'8:7'),false);
 s.unlockedPlots=['8:7'];
 assert.equal(isPlotUnlocked(s,'8:7'),true);
 assert.equal(interact(s,8,7,100).changed,true);
});

test('canteiros bloqueados substituem terra, não são sobrepostos',()=>{
 const terrain=readFileSync(new URL('../src/world/art/terrain.js',import.meta.url),'utf8');
 const renderer=readFileSync(new URL('../src/world/renderer.js',import.meta.url),'utf8');
 assert.match(terrain,/if\(FREE_PLOTS\.has\(id\)\)plot\(/);
 assert.match(terrain,/else drawBlockedTile\(/);
 assert.doesNotMatch(renderer,/type:'blocked'/);
 assert.match(renderer,/this\.terrain=createTerrainLayer\(image\)/);
 assert.match(renderer,/grass-blocked-01\.webp\?v=032/);
});
