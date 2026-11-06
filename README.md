# 🌾 Fazenda Aurora

Jogo de fazenda 2D isométrico inspirado na jogabilidade social clássica, com visual modernizado. **Mobile-first em landscape**, também compatível com PC.

## V0.3.4 — horta na posição de referência, validada em captura real
- A captura de Chrome 925×390 revelou que a V0.3.3 ainda deixava a horta pequena e muito à esquerda.
- Horta ampliada para 1,85×, com centro mundial (15,460); a área livre de 6 terrenos agora é um grupo 3×2 na parte superior esquerda, não uma faixa diagonal.
- Os 22 com mato seguem à direita e abaixo, com o mesmo desenho e ângulo isométrico da terra e das plantações.
- Migração 32→33 preserva plantios existentes e move apenas o cultivo de 5:3 para 7:2; mantém moedas, XP, colheitas e sede.
- Câmera, lago, sede, curral e sistema de toque continuam independentes do posicionamento da horta.
- Captura de navegador horizontal arquivada em cada execução de testes do GitHub Actions.

## V0.3.3 — composição visual baseada na foto-matriz do Colheita Feliz
- **Somente a horta** foi deslocada para a parte inferior esquerda e ampliada, ficando abaixo da casinha do cachorro e próxima ao caminho.
- Grade de 28 canteiros preservada, inclusive seis livres e 22 com mato. Não houve troca de IDs nem reset das plantas e moedas.
- Terra, mato, plantações, contorno de seleção e toque aplicam a MESMA transformação isométrica 2D (1,45×), evitando desenhos desconectados.
- A antiga posição dos canteiros agora é gramado; não existe uma segunda horta invisível ou clicável.
- Posição e escala centralizadas em `src/world/plotLayout.js`. Em futuras alterações basta editar o layout.
- Sede, lago e cercado continuam em suas posições, sem alteração das mecânicas.
- Testes de hitbox e smoke test mobile verificam a localização dos terrenos de forma determinística.

## V0.3.2 — horta com encaixe isométrico contínuo
- Reconstruímos a horta como **4 × 7 = 28** losangos, sem lacunas ou sobreposições.
- O sprite aprovado de mato é recortado para remover a margem transparente (fonte 140×140, recorte y=30–140), e então encaixado precisamente em 100×54 unidades do mundo.
- Terra arada usa o mesmo ângulo, largura e perímetro; lado de relevo de 3 unidades sem sombra lateral solta.
- Seis primeiros canteiros pela posição visual (do alto para baixo), agrupados e não mais em uma faixa diagonal comprida.
- Migração `plotLayoutVersion=32`: remove culturas da distribuição anterior uma única vez e preserva moedas, XP, colheitas e sede.
- Geometria própria em `src/world/art/plotTiles.js`, pronta para evoluir junto com os sprites.

## V0.3.1 — grama no lugar da terra, nunca por cima
- A grade da horta continua com 28 espaços: seis livres na PRIMEIRA fileira (5:2 a 5:7), 22 bloqueados nas demais.
- Cada sprite bloqueado cabe no próprio losango (100×55 unidades), sem encobrir as parcelas vizinhas.
- O mato substitui o desenho de terra na camada estática, em vez de ser sobreposto durante a animação.
- Na primeira abertura desta versão, removemos **todas** as plantações anteriores e os desbloqueios do protótipo; o jogador pediu uma horta limpa para avaliar o novo visual.
- Moedas, experiência, colheitas acumuladas e nível da sede são mantidos.
- A migração tem versão (`plotLayoutVersion=31`) e ocorre apenas uma vez.
- Compra de terrenos continua desligada.

## V0.3.0 — canteiros com mato e progressão inicial nostálgica
- 28 terrenos de horta conforme relatos históricos do Colheita Feliz: 6 livres e 22 bloqueados por grama alta.
- Sprite de grama inteiriça, sem sombra externa, em `public/assets/plots/grass-blocked-01.webp`.
- Compra e desbloqueio ainda não implementados; canteiros bloqueados não recebem sementes nem cobram moedas.
- Terrenos já plantados em versões antigas continuam colhíveis, inclusive nos dois endereços removidos do novo conjunto de 28; depois da colheita ficam indisponíveis.
- Mesmo identificador de salvamento, preservando XP, moedas, sede e culturas existentes.
- Estrutura prevista para futura expansão de 7 terrenos, sem ativar compras nesta etapa.

## V0.2.9 — visual clássico com cercado no canto direito
- Enquadramento mais próximo no celular horizontal, com limite mínimo de zoom ajustado.
- Sede inicial posicionada na parte superior central, com sprite de nível independente.
- Casinha do cachorro e lago deslocados à esquerda; lago ligeiramente maior.
- Curral ilustrado à direita, com cerca em camadas e vaca, ovelha e galinha em sprites próprios.
- Animais são decorações temporárias: criação e alimentação serão mecânicas futuras.
- Posições em `src/world/layout.js`; cercado em `src/world/art/animalPen.js`.
- 30 terrenos, plantações, moedas, experiência e salvamento preservados.
- Testes automatizados e verificação em navegador fazem parte da publicação.

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
