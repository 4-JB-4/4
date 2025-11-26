/**
 * 0RB SYSTEM - System Context
 * Global state management for the simulation
 */

import { createContext, useContext, useReducer, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════

const initialState = {
  isBooted: false,
  bootPhase: 0,
  systemStatus: 'INITIALIZING',
  config: {
    name: '0RB SYSTEM',
    version: '1.0.0',
    codename: 'THE_AWAKENING'
  },
  user: null,
  notifications: [],
  activeGame: null,
  theme: 'dark'
};

// ═══════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════

const ACTIONS = {
  SET_BOOTED: 'SET_BOOTED',
  SET_BOOT_PHASE: 'SET_BOOT_PHASE',
  SET_STATUS: 'SET_STATUS',
  SET_USER: 'SET_USER',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_ACTIVE_GAME: 'SET_ACTIVE_GAME',
  SET_THEME: 'SET_THEME'
};

// ═══════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════

function systemReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOOTED:
      return { ...state, isBooted: action.payload };

    case ACTIONS.SET_BOOT_PHASE:
      return { ...state, bootPhase: action.payload };

    case ACTIONS.SET_STATUS:
      return { ...state, systemStatus: action.payload };

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    case ACTIONS.SET_ACTIVE_GAME:
      return { ...state, activeGame: action.payload };

    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const SystemContext = createContext(null);

export function SystemProvider({ children }) {
  const [state, dispatch] = useReducer(systemReducer, initialState);

  // Boot sequence effect
  useEffect(() => {
    const bootSequence = async () => {
      const phases = [
        'CORE_INIT',
        'AGENT_MANIFEST',
        'COPA_INIT',
        'CRYPTO_CONNECT',
        'GAME_LOAD',
        'UI_RENDER',
        'FINAL_CHECK'
      ];

      for (let i = 0; i < phases.length; i++) {
        dispatch({ type: ACTIONS.SET_BOOT_PHASE, payload: i });
        dispatch({ type: ACTIONS.SET_STATUS, payload: phases[i] });
        await new Promise(resolve => setTimeout(resolve, 700));
      }

      dispatch({ type: ACTIONS.SET_BOOTED, payload: true });
      dispatch({ type: ACTIONS.SET_STATUS, payload: 'ONLINE' });
    };

    if (!state.isBooted) {
      bootSequence();
    }
  }, [state.isBooted]);

  // Actions
  const actions = {
    setBooted: (value) => dispatch({ type: ACTIONS.SET_BOOTED, payload: value }),
    setBootPhase: (phase) => dispatch({ type: ACTIONS.SET_BOOT_PHASE, payload: phase }),
    setStatus: (status) => dispatch({ type: ACTIONS.SET_STATUS, payload: status }),
    setUser: (user) => dispatch({ type: ACTIONS.SET_USER, payload: user }),
    addNotification: (notification) => dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (id) => dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id }),
    setActiveGame: (game) => dispatch({ type: ACTIONS.SET_ACTIVE_GAME, payload: game }),
    setTheme: (theme) => dispatch({ type: ACTIONS.SET_THEME, payload: theme })
  };

  return (
    <SystemContext.Provider value={{ state, actions }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}

export default SystemContext;
