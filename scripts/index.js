// O ponto de entrada. um script enxuto que reúne o estado e a interface para inicializar o componente na página.

import { loadState } from './accessibility-state.js';
import {
  initQuickSettings,
  initCustomSettings,
  initModal,
  initThemeSettings,
  initResetButton,
  initDarkModeToggle,
  initLibrasProxy,
  initReadAloud
} from './accessibility-ui.js';

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  // 1. Carrega as preferências salvas do usuário (se houver) no localStorage
  loadState();

  // 2. Inicializa os comportamentos mecânicos do Modal (abrir/fechar/foco)
  initModal();

  // 3. Inicializa os botões e regras da Configuração Rápida
  initQuickSettings();

  // 4. Inicializa os controles de Configurações Personalizadas (Sliders e granular)
  initCustomSettings();

  // 5. Inicializa os motores de cores
  initThemeSettings();

  // 6. Inicializa o botão de resetar as configurações
  initResetButton();

  // 7. Altera para a opção de personalização claro/escuro
  initDarkModeToggle();

  // Inicializa o Widget VLibras
  initLibrasProxy();

  // Inicializa o Widget de Leitura em Voz Alta
  initReadAloud();
});
