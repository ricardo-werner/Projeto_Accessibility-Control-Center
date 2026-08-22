// A fonte única de verdade dos dados. Vai conter o objeto padrão de configuração de acessibilidade, bem como os dados de estado atuais. O estado será atualizado com base nas ações do usuário e nos eventos do sistema, garantindo que a interface seja acessível e responsiva às necessidades dos usuários. Gravação no localStorage.

// vanilla/js/accessibility-state.js

const STORAGE_KEY = 'a11y_preferences';

// Nossa fonte única de verdade
export const defaultState = {
  quickSettings: {
    readingEase: false,
    highVisibility: false,
    reducedDistraction: false,
  },
  granular: {
    fontScale: 1,
    fontFamily: 'var(--a11y-font-family-base)',
    lineHeight: 'var(--a11y-line-height-base)',
    theme: 'default',
    contrastMode: 'default',
    reduceMotion: false
  },
};

let currentState = { ...defaultState };

export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    currentState = { ...defaultState, ...JSON.parse(saved) };
  }
  return currentState;
}

export function saveState(newState) {
  currentState = { ...currentState, ...newState };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  return currentState;
}

export function getState() {
  return currentState;
}