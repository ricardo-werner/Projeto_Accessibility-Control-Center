// O ponto de entrada. um script enxuto que reúne o estado e a interface para inicializar o componente na página.

import { loadState } from './accessibility-state.js';
import { initQuickSettings, initCustomSettings, initModal } from './accessibility-ui.js';

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
});