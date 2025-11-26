/**
 * 0RB SYSTEM - Crypto Context
 * The simulation has currency now
 */

import { createContext, useContext, useReducer } from 'react';

// ═══════════════════════════════════════════════════════════════
// STAKING TIERS
// ═══════════════════════════════════════════════════════════════

export const STAKING_TIERS = {
  OBSERVER: { name: 'Observer', minStake: 1000, discount: 0, boost: 0 },
  AWAKENED: { name: 'Awakened', minStake: 10000, discount: 10, boost: 5 },
  ARCHITECT: { name: 'Architect', minStake: 100000, discount: 25, boost: 15 },
  ORACLE: { name: 'Oracle', minStake: 1000000, discount: 50, boost: 30 }
};

// ═══════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════

const initialState = {
  wallet: null,
  balances: {
    ORB: 0,
    ETH: 0,
    USDC: 0
  },
  stakedAmount: 0,
  stakingTier: null,
  ownedAgents: [],
  listings: [],
  rentals: [],
  earnings: {
    total: 0,
    pending: 0
  },
  connected: false
};

// ═══════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════

function cryptoReducer(state, action) {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        wallet: action.payload,
        connected: true
      };

    case 'DISCONNECT_WALLET':
      return {
        ...state,
        wallet: null,
        connected: false
      };

    case 'UPDATE_BALANCES':
      return {
        ...state,
        balances: { ...state.balances, ...action.payload }
      };

    case 'STAKE':
      const newStaked = state.stakedAmount + action.payload;
      let tier = null;
      for (const [key, value] of Object.entries(STAKING_TIERS).reverse()) {
        if (newStaked >= value.minStake) {
          tier = key;
          break;
        }
      }
      return {
        ...state,
        stakedAmount: newStaked,
        stakingTier: tier,
        balances: {
          ...state.balances,
          ORB: state.balances.ORB - action.payload
        }
      };

    case 'UNSTAKE':
      const afterUnstake = Math.max(0, state.stakedAmount - action.payload);
      let newTier = null;
      for (const [key, value] of Object.entries(STAKING_TIERS).reverse()) {
        if (afterUnstake >= value.minStake) {
          newTier = key;
          break;
        }
      }
      return {
        ...state,
        stakedAmount: afterUnstake,
        stakingTier: newTier,
        balances: {
          ...state.balances,
          ORB: state.balances.ORB + action.payload
        }
      };

    case 'ADD_OWNED_AGENT':
      return {
        ...state,
        ownedAgents: [...state.ownedAgents, action.payload]
      };

    case 'CREATE_LISTING':
      return {
        ...state,
        listings: [...state.listings, action.payload]
      };

    case 'ADD_RENTAL':
      return {
        ...state,
        rentals: [...state.rentals, action.payload]
      };

    case 'UPDATE_EARNINGS':
      return {
        ...state,
        earnings: { ...state.earnings, ...action.payload }
      };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const CryptoContext = createContext(null);

export function CryptoProvider({ children }) {
  const [state, dispatch] = useReducer(cryptoReducer, initialState);

  const actions = {
    connectWallet: (wallet) => dispatch({ type: 'CONNECT_WALLET', payload: wallet }),
    disconnectWallet: () => dispatch({ type: 'DISCONNECT_WALLET' }),
    updateBalances: (balances) => dispatch({ type: 'UPDATE_BALANCES', payload: balances }),
    stake: (amount) => dispatch({ type: 'STAKE', payload: amount }),
    unstake: (amount) => dispatch({ type: 'UNSTAKE', payload: amount }),
    addOwnedAgent: (agent) => dispatch({ type: 'ADD_OWNED_AGENT', payload: agent }),
    createListing: (listing) => dispatch({ type: 'CREATE_LISTING', payload: listing }),
    addRental: (rental) => dispatch({ type: 'ADD_RENTAL', payload: rental }),
    updateEarnings: (earnings) => dispatch({ type: 'UPDATE_EARNINGS', payload: earnings })
  };

  return (
    <CryptoContext.Provider value={{ state, actions }}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}

export default CryptoContext;
