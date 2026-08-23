// O motor da interação. Aqui construiremos funções essenciais de acessibilidade, como o controle de abertura e fechamento, a armadilha de foco (Focus trap) para quem navega por teclado, o retorno do foco ao botão de origem e o mapeamento dos eventos de clique.

// scripts/accessibility-ui.js
import { getState, saveState, defaultState } from './accessibility-state.js';

const rootElement = document.documentElement;

// Mapeia os estados para as alterações nas variáveis CSS
export const applyCSSVariables = (state) => {
  // 1. Facilitar Leitura (Dislexia / Carga Cognitiva)
  if (state.quickSettings.readingEase) {
    rootElement.style.setProperty(
      '--font-family-current',
      'var(--a11y-font-family-dyslexia)'
    );
    rootElement.style.setProperty(
      '--a11y-line-height-base',
      '1.8'
    );
  } else if (!state.quickSettings.highVisibility) {
    rootElement.style.removeProperty(
      '--font-family-current'
    );
    rootElement.style.removeProperty(
      '--a11y-line-height-base'
    );
  }

  // 2. Aumentar Visibilidade (Baixa Visão / Daltonismo)
  if (state.quickSettings.highVisibility) {
    rootElement.style.setProperty(
      '--a11y-font-scale',
      '1.2'
    );
    rootElement.style.setProperty(
      '--font-family-current',
      'var(--a11y-font-family-hyperlegible)'
    );
  } else {
    // Retorna para a escala definida pelo usuário (via slider ou padrão)
    rootElement.style.setProperty(
      '--a11y-font-scale',
      state.granular.fontScale
    );

    // Se 'Facilitar Leitura' também estiver desligada, remove a fonte personalizada
    if (!state.quickSettings.readingEase) {
      rootElement.style.removeProperty(
        '--font-family-current'
      );
    }
  }

  // 3. Reduzir Distrações (TDAH / Epilepsia / Animações)
  if (state.quickSettings.reducedDistraction) {
    rootElement.classList.add('reduce-motion');
  } else {
    rootElement.classList.remove('reduce-motion');
  }

  // Reduzir Distrações
  if (state.quickSettings.reducedDistraction) {
    rootElement.setAttribute(
      'data-reduce-distractions',
      'true'
    );
  } else {
    rootElement.removeAttribute('data-reduce-distractions');
  }
};

// Inicializa os botões e regras da Configuração Rápida
export function initQuickSettings() {
  const btnRead = document.getElementById('btn-quick-read');
  const btnVis = document.getElementById('btn-quick-visibility');
  const btnFocus = document.getElementById('btn-quick-focus');

  const state = getState();

  // Sincroniza botões com o estado inicial
  if (btnRead) {
    btnRead.setAttribute('aria-pressed', String(state.quickSettings.readingEase));
    btnRead.addEventListener('click', () => {
      const isPressed = btnRead.getAttribute('aria-pressed') === 'true';
      const newState = !isPressed;
      btnRead.setAttribute('aria-pressed', String(newState));

      const updatedState = saveState({
        quickSettings: {
          ...getState().quickSettings,
          readingEase: newState,
        },
      });

      applyCSSVariables(updatedState);
    });
  }

  if (btnVis) {
    btnVis.setAttribute('aria-pressed', String(state.quickSettings.highVisibility));
    btnVis.addEventListener('click', () => {
      const isPressed = btnVis.getAttribute('aria-pressed') === 'true';
      const newState = !isPressed;
      btnVis.setAttribute('aria-pressed', String(newState));

      const updatedState = saveState({
        quickSettings: {
          ...getState().quickSettings,
          highVisibility: newState,
        },
      });

      // Atualiza também o slider se existir
      const slider = document.getElementById('font-scale-slider');
      if (slider) {
        slider.value = newState ? '1.2' : String(updatedState.granular.fontScale);
      }

      applyCSSVariables(updatedState);
    });
  }

  if (btnFocus) {
    btnFocus.setAttribute(
      'aria-pressed',
      String(state.quickSettings.reducedDistraction)
    );
    btnFocus.addEventListener('click', () => {
      const isPressed = btnFocus.getAttribute('aria-pressed') === 'true';
      const newState = !isPressed;
      btnFocus.setAttribute('aria-pressed', String(newState));

      const updatedState = saveState({
        quickSettings: {
          ...getState().quickSettings,
          reducedDistraction: newState,
        },
      });

      applyCSSVariables(updatedState);
    });
  }

  applyCSSVariables(state);
}

// Inicializa configurações personalizadas (sliders, granular)
export function initCustomSettings() {
  const slider = document.getElementById(
    'font-scale-slider'
  );
  const btnVis = document.getElementById(
    'btn-quick-visibility'
  ); // 1. Capturamos o Botão 2
  const state = getState();

  if (slider) {
    // Sincroniza o valor inicial do slider
    slider.value = state.quickSettings.highVisibility
      ? '1.2'
      : String(state.granular.fontScale);

    slider.addEventListener('input', (event) => {
      const newScale = parseFloat(event.target.value);
      const currentState = getState();
      let isVisActive =
        currentState.quickSettings.highVisibility;

      // 2. A trava de segurança que havia sumido: se o Botão 2 estiver ligado, desliga ele!
      if (isVisActive) {
        isVisActive = false;
        if (btnVis)
          btnVis.setAttribute('aria-pressed', 'false'); // Atualiza o visual do botão
      }

      // 3. Salva a nova realidade no estado
      const updatedState = saveState({
        quickSettings: {
          ...currentState.quickSettings,
          highVisibility: isVisActive, // Garante que o motor saiba que o botão 2 desligou
        },
        granular: {
          ...currentState.granular,
          fontScale: newScale,
        },
      });

      // 4. Manda o motor atualizar a tela
      applyCSSVariables(updatedState);
    });
  }
}

// Inicializa o controle do Modal (abrir/fechar/foco/backdrop)
export function initModal() {
  const modal = document.getElementById('a11y-modal');
  const btnOpen = document.getElementById('btn-open-a11y');
  const btnClose = document.getElementById('btn-close-a11y');

  if (!modal || !btnOpen || !btnClose) return;

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

  // 4. Fechar ao clicar fora do modal (no backdrop)
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    // Se o clique foi fora das dimensões do dialog, fecha
    if (!isInDialog) {
      modal.close();
    }
  });
}

// scripts/accessibility-ui.js

export function initThemeSettings() {
  const themeRadios = document.querySelectorAll('input[name="a11y-theme"]');
  const rootElement = document.documentElement;
  
  // 1. Sincroniza a interface com as preferências salvas no localStorage
  const state = getState();
  const currentTheme = state.granular.theme || 'default';
  
  themeRadios.forEach(radio => {
    if (radio.value === currentTheme) {
      radio.checked = true;
    }
  });
  
  // Aplica o tema visualmente logo ao carregar a página
  if (currentTheme !== 'default') {
    rootElement.setAttribute('data-theme', currentTheme);
  }

  // 2. Escuta quando o usuário escolhe uma nova paleta
  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      
      // Injeta ou remove o data-attribute na tag <html>
      if (selectedTheme !== 'default') {
        rootElement.setAttribute('data-theme', selectedTheme);
      } else {
        rootElement.removeAttribute('data-theme');
      }
      
      // Salva a decisão na nossa fonte única de verdade
      saveState({
        granular: { ...getState().granular, theme: selectedTheme }
      });
    });
  });
}
// Inicializa o botão de restauração das configurações padrão
export function initResetButton() {
  const btnReset = document.getElementById(
    'btn-reset-a11y'
  );

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      // 1. Limpeza absoluta: destrói a chave do localStorage completamente
      localStorage.removeItem('a11y_preferences');

      // 2. Recarrega a página, simulando uma primeira visita virgem ao site
      window.location.reload();
    });
  }
}

export function initDarkModeToggle() {
  const btnDark = document.getElementById('btn-dark-mode');
  const rootElement = document.documentElement;
  const themeRadios = document.querySelectorAll(
    'input[name="a11y-theme"]'
  );

  if (!btnDark) return;

  // 1. Sincroniza o botão ao carregar a página
  const state = getState();
  const isDark = state.granular.theme === 'dark';
  btnDark.setAttribute('aria-checked', isDark);

  // 2. Evento de Clique no Toggle
  btnDark.addEventListener('click', () => {
    const isCurrentlyDark =
      btnDark.getAttribute('aria-checked') === 'true';
    const newDarkState = !isCurrentlyDark;

    // Atualiza o visual do botão
    btnDark.setAttribute('aria-checked', newDarkState);

    // Atualiza o tema da página
    const newTheme = newDarkState ? 'dark' : 'default';
    if (newDarkState) {
      rootElement.setAttribute('data-theme', 'dark');
    } else {
      rootElement.removeAttribute('data-theme');
    }

    // REGRA DE CONFLITO: Se ligou o Modo Escuro, reseta os Radio Buttons para "Padrão"
    themeRadios.forEach((radio) => {
      if (radio.value === 'default') {
        radio.checked = true;
      }
    });

    // Salva no estado
    saveState({
      granular: { ...getState().granular, theme: newTheme },
    });
  });

  // 3. REGRA DE CONFLITO REVERSA: Se o usuário clicar em uma Paleta, desliga o Modo Escuro
  themeRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (e.target.value !== 'dark') {
        btnDark.setAttribute('aria-checked', 'false');
      }
    });
  });
}
