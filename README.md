# 🌾 Fazenda Aurora

Jogo de fazenda 2D isométrico inspirado na jogabilidade social clássica, com visual modernizado. **Mobile-first em landscape**, também compatível com PC.

## V0.1
- Mapa isométrico 14 × 14 com 30 canteiros e elementos provisórios
- Trigo, cenoura e morango; crescimento mesmo quando o jogo está fechado
- Moedas, experiência, nível e salvamento local (neste navegador)
- Controles de toque, arrasto, pinça e zoom; suporte a mouse
- Arquivos separados para interface, regras, renderização e entrada
- Sem dependências de bibliotecas externas nesta base inicial

## Rodar no navegador
É necessário servir os arquivos via HTTP, pois o projeto utiliza ES Modules:

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000 . Para publicar, configure GitHub Pages com a branch `main` e diretório `/` (raiz).

## Organização
- `index.html`: página enxuta
- `src/styles/game.css`: interface e orientação horizontal
- `src/config/gameConfig.js`: mapa e definições de cultivos
- `src/systems/farm.js`: plantio, colheita, progressão e salvamento
- `src/world/renderer.js`: mapa e desenhos isométricos (temporários)
- `src/input/pointer.js`: controle por toque e mouse
- `src/main.js`: integração da interface com os módulos
- `tests/`: testes automatizados (executar `npm test`)

### Direção do projeto
A primeira fase será simples e social. Depois de tudo funcional, iremos ampliar economia e sistemas. O estilo gráfico não será selecionável pelo jogador: poderemos refazê-lo durante o desenvolvimento conforme a direção artística escolhida.
