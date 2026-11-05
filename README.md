# 🌾 Fazenda Aurora

Jogo de fazenda 2D isométrico inspirado na jogabilidade social clássica, com visual modernizado. **Mobile-first em landscape**, também compatível com PC.

## V0.2.8 — composição mobile conforme referência
- Posição da sede, casinha do cachorro, lago e horta ajustada aos pontos de referência enviados.
- Posições separadas em `src/world/layout.js`; tamanho da tela e enquadramento em `src/world/camera.js`.
- Casinha do cachorro ganhou sprite independente em `public/assets/buildings/doghouse/level-01.svg`.
- Gramado contínuo substitui o chão em ilha com bordas: laterais não ficam vazias.
- Botão de afastar limita o zoom à escala inicial; arrasto e pinça também respeitam limites de mundo.
- A referência descreve posições aproximadas, não substitui a cena por uma imagem estática.
- 30 canteiros, cultivos, moedas, experiência e nível da sede continuam preservados.

## V0.2.7 — Sede Inicial nostálgica
- Novo sprite da Sede Inicial em `public/assets/buildings/headquarters/level-01.webp` (WebP com transparência, otimizado para mobile).
- A sede é controlada por `headquartersLevel`, separado do nível de experiência.
- Registro de sedes em `src/data/headquarters.js`, renderização isolada em `src/world/art/headquarters.js`.
- Nenhuma opção de evolução foi ativada nesta versão; futuras sedes poderão substituir apenas a imagem e dimensões da construção.
- Jogadores com progresso existente continuam com os mesmos canteiros, moedas, plantas e experiência.
- Se a imagem não carregar, a casa anterior é exibida temporariamente como reserva.

## V0.2.6 — primeira arte ilustrada
- Sprites SVG autorais e separados para casa, celeiro e árvores em `public/assets/sprites/`.
- Cultivos redesenhados em módulo `src/world/art/crops.js`, com folhas e frutos por fase.
- Gramado suavizado para reduzir aparência de grade quadriculada.
- A lógica de plantio, os valores de moedas e os 30 canteiros não foram alterados.
- Mantemos a câmera atual nesta etapa; vamos ajustar zoom depois que a direção artística for aprovada.
- Se um sprite falhar, o jogo ainda desenha o elemento provisório em Canvas.

## V0.2.5 — enquadramento clássico no mobile
- Zoom inicial maior: fazenda ocupa a área útil do celular horizontal
- Casa, celeiro e plantações aumentados proporcionalmente
- Lago ilustrado em módulo próprio e desenhado na camada estática do terreno
- O mapa pode sair da área visível: arraste e zoom continuam disponíveis
- Salvamento e canteiros preservados, sem alterar a economia ou o progresso
- Regras de escala separadas em `src/world/camera.js`

## V0.2 (primeira etapa: terreno e canteiros)
- Grama com variação de tons, pequenos tufos, flores e caminhos
- Canteiros com profundidade, sulcos e relevo em desenho 2D isométrico
- Renderização do chão armazenada em uma camada Canvas estática para poupar processamento
- Sem mudanças nas regras de plantio, colheita, moedas e salvamento
- Os desenhos ainda são provisórios; sprites artísticos definitivos virão em etapas

## Base funcional herdada da V0.1
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
- `src/world/renderer.js`: câmera, composição do cenário e objetos dinâmicos
- `src/world/art/terrain.js`: terreno isométrico estático, independente das regras
- `src/world/art/pond.js`: lago ilustrado independente
- `src/world/art/sprites.js`: carregador dos sprites autorais em SVG
- `src/world/art/crops.js`: ilustrações dos cultivos com seus estágios
- `src/world/camera.js`: escala e foco inicial por tamanho da tela
- `src/input/pointer.js`: controle por toque e mouse
- `src/main.js`: integração da interface com os módulos
- `tests/`: testes automatizados (executar `npm test`)

### Direção do projeto
A primeira fase será simples e social. Depois de tudo funcional, iremos ampliar economia e sistemas. O estilo gráfico não será selecionável pelo jogador: poderemos refazê-lo durante o desenvolvimento conforme a direção artística escolhida.
