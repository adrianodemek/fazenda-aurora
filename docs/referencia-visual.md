# Referência visual — Fazenda Aurora (Colheita Feliz)

Esta documentação orienta a direção artística durante o desenvolvimento. **Não incluir imagens ou sprites originais de terceiros no jogo.** Utilizar capturas históricas somente para consulta e produzir recursos próprios.

## Referências históricas encontradas
- [Colheita Feliz em 2010 — cenário com casa, grama, animais e plantações (captura de época)](https://www.dragondicas.com.br/2010/01/dicas-colheita-feliz.html)
- [Tutorial de 2011 — interface, menu inferior e loja](https://www.techtudo.com.br/noticias/2011/04/colheita-feliz-aprenda-como-jogar-este-sucesso-do-orkut.ghtml)
- [Descrição histórica da HUD e das funções do jogo](https://www.blogdozemarcos.com/2009/11/agora-sou-fazendeiro-virtual.html)

## Direção artística escolhida (estilo B)
- Vista **2D isométrica** com grade técnica de terrenos, mas sem aparência de polígonos crus.
- Grama contínua, orgânica, sem linhas de quadrícula fortes entre tiles.
- Canteiros elevados com textura e sombreado coerentes com a direção da luz.
- Construções e árvores com sprites próprios, volumes ilustrados e sombras macias.
- Paleta ensolarada, silhuetas legíveis em telas pequenas; evitar objetos geometricamente rígidos.
- Animações discretas e otimizadas; evitar texturas gigantes ou efeitos 3D pesados.

## Layout do aparelho
- **Mobile primeiro em orientação horizontal**; funcionamento equivalente no PC.
- Fazenda ocupa o miolo da tela, com informações pequenas no topo e ferramentas na base.
- Botão para tela cheia no **canto superior direito**, depois das moedas e do nível.
- Áreas seguras (notch, barras do sistema), sem bloquear os terrenos úteis.
- A barra inferior não deve consumir altura excessiva em aparelhos compactos.
- Em navegadores sem Fullscreen API para páginas HTML, apresentar mensagem de orientação, sem simular fullscreen falso.

## Implementação
- Terreno: `src/world/art/terrain.js` (gráfico provisório).
- Objetos: `src/world/renderer.js` (substituir gradualmente por recursos próprios).
- Tela cheia: `src/ui/fullscreen.js`.
- Regras de plantio e colheita ficam independentes do gráfico.
- Não acrescentar troca de estilo gráfico ao menu do jogador: a direção é decidida durante o desenvolvimento.
