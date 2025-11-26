/**
 * 0RB SYSTEM - Copa Context
 * AUGMENTATION > AUTOMATION
 */

import { createContext, useContext, useReducer } from 'react';

// ═══════════════════════════════════════════════════════════════
// COPA VERTICALS
// ═══════════════════════════════════════════════════════════════

export const VERTICALS = {
  LEGAL: { id: 'LEGAL', name: 'Copa Legal', icon: '⚖️', color: '#8B4513' },
  MEDICAL: { id: 'MEDICAL', name: 'Copa Medical', icon: '🏥', color: '#2ECC71' },
  SALES: { id: 'SALES', name: 'Copa Sales', icon: '💼', color: '#E74C3C' },
  FINANCE: { id: 'FINANCE', name: 'Copa Finance', icon: '📊', color: '#27AE60' },
  CREATIVE: { id: 'CREATIVE', name: 'Copa Creative', icon: '🎨', color: '#9B59B6' },
  CODE: { id: 'CODE', name: 'Copa Code', icon: '💻', color: '#3498DB' },
  SUPPORT: { id: 'SUPPORT', name: 'Copa Support', icon: '🎧', color: '#1ABC9C' },
  HR: { id: 'HR', name: 'Copa HR', icon: '👥', color: '#E67E22' },
  OPS: { id: 'OPS', name: 'Copa Ops', icon: '⚙️', color: '#95A5A6' },
  EXECUTIVE: { id: 'EXECUTIVE', name: 'Copa Executive', icon: '👔', color: '#34495E' }
};

// ═══════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════

const initialState = {
  verticals: VERTICALS,
  activeCopa: null,
  conversations: [],
  statistics: {
    tasksCompleted: 0,
    hoursAugmented: 0,
    jobsSaved: 0
  }
};

// ═══════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════

function copaReducer(state, action) {
  switch (action.type) {
    case 'INIT_COPA':
      return {
        ...state,
        activeCopa: {
          id: `copa-${Date.now()}`,
          vertical: action.payload,
          ...VERTICALS[action.payload],
          history: []
        }
      };

    case 'ADD_MESSAGE':
      if (!state.activeCopa) return state;
      return {
        ...state,
        activeCopa: {
          ...state.activeCopa,
          history: [...state.activeCopa.history, action.payload]
        }
      };

    case 'CLEAR_COPA':
      return { ...state, activeCopa: null };

    case 'UPDATE_STATS':
      return {
        ...state,
        statistics: {
          ...state.statistics,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const CopaContext = createContext(null);

export function CopaProvider({ children }) {
  const [state, dispatch] = useReducer(copaReducer, initialState);

  const actions = {
    initCopa: (vertical) => dispatch({ type: 'INIT_COPA', payload: vertical }),
    addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    clearCopa: () => dispatch({ type: 'CLEAR_COPA' }),
    updateStats: (stats) => dispatch({ type: 'UPDATE_STATS', payload: stats })
  };

  return (
    <CopaContext.Provider value={{ state, actions }}>
      {children}
    </CopaContext.Provider>
  );
}

export function useCopa() {
  const context = useContext(CopaContext);
  if (!context) {
    throw new Error('useCopa must be used within a CopaProvider');
  }
  return context;
}

export default CopaContext;
