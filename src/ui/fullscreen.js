// Controle separado de tela cheia. A API exige gesto direto do jogador.
// Alguns navegadores mobile (especialmente Safari no iPhone) não permitem
// fullscreen para páginas HTML; nesse caso informamos a limitação.
export function setupFullscreen({root,button,onFeedback,onResize}) {
  if (!root || !button) throw new Error('Elementos de tela cheia não encontrados');

  const current = () => document.fullscreenElement || document.webkitFullscreenElement;
  const requesting = () => root.requestFullscreen || root.webkitRequestFullscreen;
  const leaving = () => document.exitFullscreen || document.webkitExitFullscreen;

  const sync = () => {
    const active = current() === root;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Entrar em tela cheia');
    button.title = active ? 'Sair da tela cheia' : 'Tela cheia';
    if (typeof onResize === 'function') requestAnimationFrame(onResize);
  };

  const toggle = async () => {
    try {
      if (current()) {
        const exit = leaving();
        if (!exit) throw new Error('Saída do modo tela cheia indisponível');
        await exit.call(document);
      } else {
        const enter = requesting();
        if (!enter) {
          onFeedback?.('Tela cheia não disponível neste navegador. No iPhone, experimente adicionar à Tela de Início.');
          return;
        }
        await enter.call(root);
        // Travar paisagem é opcional: a maioria dos browsers já permite girar.
        // Se não for suportado, simplesmente mantemos a orientação do aparelho.
        try {
          if (screen.orientation?.lock) await screen.orientation.lock('landscape');
        } catch { /* compatibilidade: sem bloqueio automático */ }
      }
    } catch {
      onFeedback?.('O navegador não permitiu tela cheia. Gire o celular e tente novamente.');
    } finally {
      sync();
    }
  };
  button.addEventListener('click', toggle);
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  sync();
}
