// O motor da interação. Aqui construiremos funções essenciais de acessibilidade, como o controle de abertura e fechamento, a armadilha de foco (Focus trap) para quem navega por teclado, o retorno do foco ao botão de origem e o mapeamento dos eventos de clique.

// vanilla/js/accessibility-ui.js
import {
  getState,
  saveState,
} from './accessibility-state.js';

const rootElement = document.documentElement;

// Mapeia os atalhos para as alterações granulares nas variáveis CSS
const applyCSSVariables = (state) => {
  // Facilitar Leitura
  if (state.quickSettings.readingEase) {
    rootElement.style.setProperty(
      '--font-family-current',
      'var(--a11y-font-family-dyslexia)'
    );
    rootElement.style.setProperty(
      '--a11y-line-height-base',
      '1.8'
    );
  } else {
    rootElement.style.setProperty(
      '--font-family-current',
      state.granular.fontFamily
    );
    rootElement.style.setProperty(
      '--a11y-line-height-base',
      state.granular.lineHeight
    );
  }

  // Aumentar Visibilidade (Aqui entraria as paletas de alto contraste posteriormente)
  if (state.quickSettings.highVisibility) {
    rootElement.style.setProperty(
      '--a11y-font-scale',
      '1.2'
    );
    rootElement.style.setProperty(
      '--font-family-current',
      'var(--a11y-font-family-hyperlegible)'
    );
  } else if (!state.quickSettings.readingEase) {
    rootElement.style.setProperty(
      '--a11y-font-scale',
      state.granular.fontScale
    );
  }
};

export function initQuickSettings() {
  const btnRead = document.getElementById('btn-quick-read');
  const btnVis = document.getElementById(
    'btn-quick-visibility'
  );

  // Sincroniza botões com o estado inicial
  const state = getState();
  btnRead.setAttribute(
    'aria-pressed',
    state.quickSettings.readingEase
  );
  btnVis.setAttribute(
    'aria-pressed',
    state.quickSettings.highVisibility
  );
  applyCSSVariables(state);

  // Evento: Facilitar Leitura
  btnRead.addEventListener('click', () => {
    const isPressed =
      btnRead.getAttribute('aria-pressed') === 'true';
    const newState = !isPressed;

    btnRead.setAttribute('aria-pressed', newState);

    const updatedState = saveState({
      quickSettings: {
        ...getState().quickSettings,
        readingEase: newState,
      },
    });

    applyCSSVariables(updatedState);
  });

  // Evento: Aumentar Visibilidade
  btnVis.addEventListener('click', () => {
    const isPressed =
      btnVis.getAttribute('aria-pressed') === 'true';
    const newState = !isPressed;

    btnVis.setAttribute('aria-pressed', newState);

    const updatedState = saveState({
      quickSettings: {
        ...getState().quickSettings,
        highVisibility: newState,
      },
    });

    applyCSSVariables(updatedState);
  });
}

// vanilla/js/accessibility-ui.js (Adicionar ao final)

export function initModal() {
  const modal = document.getElementById('a11y-modal');
  const btnOpen = document.getElementById('btn-open-a11y');
  const btnClose = document.getElementById('btn-close-a11y');
  
  // Variável para guardar de onde o usuário veio
  let lastFocusedElement; 

  // 1. Abrir Modal
  btnOpen.addEventListener('click', () => {
    lastFocusedElement = document.activeElement; // Salva o elemento atual (o botão)
    modal.showModal(); // API nativa: prende o foco e ativa o 'Escape' automaticamente
    btnOpen.setAttribute('aria-expanded', 'true');
  });

  // 2. Fechar Modal (pelo botão X)
  btnClose.addEventListener('click', () => {
    modal.close();
  });

  // 3. Devolver o Foco (Ocorre sempre que o modal fecha, seja pelo X ou pelo Escape)
  modal.addEventListener('close', () => {
    btnOpen.setAttribute('aria-expanded', 'false');
    if (lastFocusedElement) {
      lastFocusedElement.focus(); // Retorna o teclado para o botão inicial
    }
  });

  // 4. (Opcional) Fechar ao clicar fora do modal (no backdrop)
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    // Se o clique foi fora das dimensões do dialog, fecha
    if (!isInDialog) {
      modal.close();
    }
  });
}