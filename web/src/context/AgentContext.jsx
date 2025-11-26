/**
 * 0RB SYSTEM - Agent Context
 * The Pantheon management
 */

import { createContext, useContext, useReducer } from 'react';

// ═══════════════════════════════════════════════════════════════
// AGENT ARCHETYPES
// ═══════════════════════════════════════════════════════════════

export const ARCHETYPES = {
  APOLLO: {
    id: 'APOLLO',
    name: 'Apollo',
    title: 'The Illuminator',
    domain: 'Vision & Strategy',
    emoji: '☀️',
    color: '#FFD700'
  },
  ATHENA: {
    id: 'ATHENA',
    name: 'Athena',
    title: 'The Wise',
    domain: 'Wisdom & Analysis',
    emoji: '🦉',
    color: '#9B59B6'
  },
  HERMES: {
    id: 'HERMES',
    name: 'Hermes',
    title: 'The Messenger',
    domain: 'Communication',
    emoji: '⚡',
    color: '#3498DB'
  },
  ARES: {
    id: 'ARES',
    name: 'Ares',
    title: 'The Executor',
    domain: 'Execution & Force',
    emoji: '🔥',
    color: '#E74C3C'
  },
  HEPHAESTUS: {
    id: 'HEPHAESTUS',
    name: 'Hephaestus',
    title: 'The Forger',
    domain: 'Creation & Craft',
    emoji: '🔨',
    color: '#E67E22'
  },
  ARTEMIS: {
    id: 'ARTEMIS',
    name: 'Artemis',
    title: 'The Hunter',
    domain: 'Precision & Targeting',
    emoji: '🎯',
    color: '#1ABC9C'
  },
  MERCURY: {
    id: 'MERCURY',
    name: 'Mercury',
    title: 'The Swift',
    domain: 'Speed & Commerce',
    emoji: '💫',
    color: '#95A5A6'
  }
};

// ═══════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════

const initialState = {
  archetypes: ARCHETYPES,
  activeAgents: [],
  selectedAgent: null,
  taskQueue: [],
  statistics: {
    totalSpawned: 0,
    totalTasks: 0,
    activeCount: 0
  }
};

// ═══════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════

function agentReducer(state, action) {
  switch (action.type) {
    case 'SPAWN_AGENT':
      const newAgent = {
        id: `agent-${Date.now()}`,
        archetype: action.payload,
        ...ARCHETYPES[action.payload],
        status: 'IDLE',
        tasks: [],
        reputation: 1000
      };
      return {
        ...state,
        activeAgents: [...state.activeAgents, newAgent],
        statistics: {
          ...state.statistics,
          totalSpawned: state.statistics.totalSpawned + 1,
          activeCount: state.statistics.activeCount + 1
        }
      };

    case 'SELECT_AGENT':
      return { ...state, selectedAgent: action.payload };

    case 'ASSIGN_TASK':
      return {
        ...state,
        activeAgents: state.activeAgents.map(agent =>
          agent.id === action.payload.agentId
            ? { ...agent, tasks: [...agent.tasks, action.payload.task], status: 'WORKING' }
            : agent
        ),
        statistics: {
          ...state.statistics,
          totalTasks: state.statistics.totalTasks + 1
        }
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        activeAgents: state.activeAgents.map(agent =>
          agent.id === action.payload.agentId
            ? {
                ...agent,
                tasks: agent.tasks.filter(t => t.id !== action.payload.taskId),
                status: agent.tasks.length <= 1 ? 'IDLE' : 'WORKING',
                reputation: agent.reputation + 10
              }
            : agent
        )
      };

    case 'TERMINATE_AGENT':
      return {
        ...state,
        activeAgents: state.activeAgents.filter(a => a.id !== action.payload),
        selectedAgent: state.selectedAgent === action.payload ? null : state.selectedAgent,
        statistics: {
          ...state.statistics,
          activeCount: state.statistics.activeCount - 1
        }
      };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const AgentContext = createContext(null);

export function AgentProvider({ children }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  const actions = {
    spawnAgent: (archetype) => dispatch({ type: 'SPAWN_AGENT', payload: archetype }),
    selectAgent: (agentId) => dispatch({ type: 'SELECT_AGENT', payload: agentId }),
    assignTask: (agentId, task) => dispatch({ type: 'ASSIGN_TASK', payload: { agentId, task } }),
    completeTask: (agentId, taskId) => dispatch({ type: 'COMPLETE_TASK', payload: { agentId, taskId } }),
    terminateAgent: (agentId) => dispatch({ type: 'TERMINATE_AGENT', payload: agentId })
  };

  return (
    <AgentContext.Provider value={{ state, actions }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
}

export default AgentContext;
