/**
 * 0RB SYSTEM - CRYPTO ENGINE
 * The simulation has currency now.
 * Own the workforce of the future. Rent it out today.
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// $0RB TOKEN CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const ORB_TOKEN = {
  name: '0RB Token',
  symbol: '$0RB',
  decimals: 18,
  totalSupply: '1000000000', // 1 billion
  networks: {
    ethereum: {
      chainId: 1,
      rpc: 'https://mainnet.infura.io/v3/',
      contract: null // Deploy pending
    },
    polygon: {
      chainId: 137,
      rpc: 'https://polygon-rpc.com',
      contract: null
    },
    base: {
      chainId: 8453,
      rpc: 'https://mainnet.base.org',
      contract: null
    },
    solana: {
      cluster: 'mainnet-beta',
      programId: null
    }
  },
  distribution: {
    community: 40,      // 400M - Airdrops, rewards, staking
    development: 20,    // 200M - Team and development
    treasury: 20,       // 200M - DAO treasury
    liquidity: 10,      // 100M - DEX liquidity
    marketing: 10       // 100M - Marketing and partnerships
  }
};

// ═══════════════════════════════════════════════════════════════
// STAKING TIERS
// ═══════════════════════════════════════════════════════════════

const STAKING_TIERS = {
  OBSERVER: {
    name: 'Observer',
    minStake: 1000,
    benefits: [
      'Basic agent access',
      'Standard rental rates',
      'Community forum access'
    ],
    rentalDiscount: 0,
    earningsBoost: 0
  },
  AWAKENED: {
    name: 'Awakened',
    minStake: 10000,
    benefits: [
      'Priority agent rentals',
      '10% reduced fees',
      'Early access to new agents',
      'Exclusive Discord channel'
    ],
    rentalDiscount: 10,
    earningsBoost: 5
  },
  ARCHITECT: {
    name: 'Architect',
    minStake: 100000,
    benefits: [
      'Agent minting rights',
      '25% reduced fees',
      'Custom agent training',
      'Beta feature access',
      'Monthly strategy calls'
    ],
    rentalDiscount: 25,
    earningsBoost: 15
  },
  ORACLE: {
    name: 'Oracle',
    minStake: 1000000,
    benefits: [
      'Governance voting rights',
      'Revenue share from ALL rentals',
      '50% reduced fees',
      'Direct team access',
      'Advisory board seat',
      'Custom agent development'
    ],
    rentalDiscount: 50,
    earningsBoost: 30
  }
};

// ═══════════════════════════════════════════════════════════════
// AGENT NFT STRUCTURE
// ═══════════════════════════════════════════════════════════════

const AGENT_NFT_METADATA = {
  standard: 'ERC-721',
  attributes: [
    'archetype',
    'generation',
    'reputation',
    'totalTasks',
    'successRate',
    'specializations',
    'level',
    'experience'
  ],
  dynamicUpdates: true // Reputation updates on-chain
};

// ═══════════════════════════════════════════════════════════════
// RENTAL LISTING CLASS
// ═══════════════════════════════════════════════════════════════

class RentalListing {
  constructor(agentId, ownerId, config) {
    this.id = this.generateId();
    this.agentId = agentId;
    this.ownerId = ownerId;
    this.pricePerHour = config.pricePerHour;
    this.minimumRental = config.minimumRental || 1;
    this.maximumRental = config.maximumRental || 24;
    this.autoAccept = config.autoAccept !== false;
    this.availableHours = config.availableHours || 'always';
    this.createdAt = Date.now();
    this.status = 'ACTIVE';
    this.totalRentals = 0;
    this.totalEarnings = 0;
    this.rating = 5.0;
  }

  generateId() {
    return `listing-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }
}

// ═══════════════════════════════════════════════════════════════
// RENTAL CONTRACT CLASS (Simulated Smart Contract Logic)
// ═══════════════════════════════════════════════════════════════

class RentalContract {
  constructor(listing, renterId, duration) {
    this.id = this.generateId();
    this.listingId = listing.id;
    this.agentId = listing.agentId;
    this.ownerId = listing.ownerId;
    this.renterId = renterId;
    this.duration = duration;
    this.pricePerHour = listing.pricePerHour;
    this.totalPrice = listing.pricePerHour * duration;
    this.platformFee = this.totalPrice * 0.15;
    this.ownerEarnings = this.totalPrice * 0.85;
    this.status = 'PENDING';
    this.createdAt = Date.now();
    this.startedAt = null;
    this.completedAt = null;
    this.escrow = {
      deposited: false,
      amount: this.totalPrice,
      released: false
    };
  }

  generateId() {
    return `contract-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  deposit() {
    this.escrow.deposited = true;
    this.status = 'ESCROWED';
    return true;
  }

  start() {
    if (!this.escrow.deposited) {
      throw new Error('Escrow not deposited');
    }
    this.startedAt = Date.now();
    this.status = 'ACTIVE';
    return true;
  }

  complete(success = true) {
    if (this.status !== 'ACTIVE') {
      throw new Error('Contract not active');
    }
    this.completedAt = Date.now();
    this.status = success ? 'COMPLETED' : 'DISPUTED';
    return true;
  }

  release() {
    if (this.status !== 'COMPLETED') {
      throw new Error('Contract not completed');
    }
    this.escrow.released = true;
    return {
      ownerPayout: this.ownerEarnings,
      platformFee: this.platformFee
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// WALLET CLASS
// ═══════════════════════════════════════════════════════════════

class Wallet {
  constructor(userId) {
    this.id = this.generateId();
    this.userId = userId;
    this.address = this.generateAddress();
    this.balances = {
      ORB: 0,
      ETH: 0,
      USDC: 0
    };
    this.stakedAmount = 0;
    this.stakingTier = null;
    this.ownedAgents = [];
    this.rentalHistory = [];
    this.earnings = {
      total: 0,
      pending: 0,
      withdrawn: 0
    };
    this.createdAt = Date.now();
  }

  generateId() {
    return `wallet-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  generateAddress() {
    return '0x' + crypto.randomBytes(20).toString('hex');
  }

  deposit(token, amount) {
    if (!this.balances.hasOwnProperty(token)) {
      throw new Error(`Unsupported token: ${token}`);
    }
    this.balances[token] += amount;
    return this.balances[token];
  }

  withdraw(token, amount) {
    if (!this.balances.hasOwnProperty(token)) {
      throw new Error(`Unsupported token: ${token}`);
    }
    if (this.balances[token] < amount) {
      throw new Error('Insufficient balance');
    }
    this.balances[token] -= amount;
    return this.balances[token];
  }

  stake(amount) {
    if (this.balances.ORB < amount) {
      throw new Error('Insufficient ORB balance');
    }
    this.balances.ORB -= amount;
    this.stakedAmount += amount;
    this.updateStakingTier();
    return this.stakedAmount;
  }

  unstake(amount) {
    if (this.stakedAmount < amount) {
      throw new Error('Insufficient staked amount');
    }
    this.stakedAmount -= amount;
    this.balances.ORB += amount;
    this.updateStakingTier();
    return this.stakedAmount;
  }

  updateStakingTier() {
    const tiers = Object.entries(STAKING_TIERS).reverse();
    for (const [tierName, tier] of tiers) {
      if (this.stakedAmount >= tier.minStake) {
        this.stakingTier = tierName;
        return;
      }
    }
    this.stakingTier = null;
  }

  getStatus() {
    return {
      id: this.id,
      address: this.address,
      balances: this.balances,
      stakedAmount: this.stakedAmount,
      stakingTier: this.stakingTier,
      tierBenefits: this.stakingTier ? STAKING_TIERS[this.stakingTier] : null,
      ownedAgents: this.ownedAgents.length,
      earnings: this.earnings
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// CRYPTO ENGINE CLASS
// ═══════════════════════════════════════════════════════════════

class CryptoEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.token = ORB_TOKEN;
    this.stakingTiers = STAKING_TIERS;
    this.wallets = new Map();
    this.listings = new Map();
    this.contracts = new Map();
    this.stats = {
      totalVolume: 0,
      totalRentals: 0,
      activeListings: 0,
      totalStaked: 0,
      platformEarnings: 0
    };

    // Apply config
    if (config.marketplace) {
      this.marketplaceConfig = config.marketplace;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // WALLET OPERATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Connect or create a wallet for a user
   */
  connectWallet(config) {
    const { userId, existingAddress } = config;

    // Check if wallet already exists
    let wallet = Array.from(this.wallets.values()).find(w => w.userId === userId);

    if (!wallet) {
      wallet = new Wallet(userId);
      this.wallets.set(wallet.id, wallet);

      this.emit('wallet:connected', {
        walletId: wallet.id,
        userId,
        address: wallet.address
      });

      console.log(`[CRYPTO ENGINE] Wallet connected: ${wallet.address}`);
    }

    return wallet;
  }

  /**
   * Get wallet by ID
   */
  getWallet(walletId) {
    return this.wallets.get(walletId);
  }

  /**
   * Get wallet by user ID
   */
  getWalletByUser(userId) {
    return Array.from(this.wallets.values()).find(w => w.userId === userId);
  }

  /**
   * Get balance
   */
  getBalance(walletId) {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet.balances;
  }

  /**
   * Stake tokens
   */
  stakeTokens(walletId, amount) {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.stake(amount);
    this.stats.totalStaked += amount;

    this.emit('tokens:staked', {
      walletId,
      amount,
      newTier: wallet.stakingTier
    });

    return wallet.getStatus();
  }

  // ═══════════════════════════════════════════════════════════
  // RENTAL MARKETPLACE
  // ═══════════════════════════════════════════════════════════

  /**
   * List an agent for rental
   */
  listForRental(agentId, config) {
    const { walletId, pricePerHour, minimumRental, maximumRental, autoAccept } = config;

    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Verify agent ownership (would check NFT in real implementation)
    if (!wallet.ownedAgents.includes(agentId)) {
      // For demo, auto-add agent to wallet
      wallet.ownedAgents.push(agentId);
    }

    const listing = new RentalListing(agentId, walletId, {
      pricePerHour,
      minimumRental,
      maximumRental,
      autoAccept
    });

    this.listings.set(listing.id, listing);
    this.stats.activeListings++;

    this.emit('listing:created', {
      listingId: listing.id,
      agentId,
      pricePerHour
    });

    console.log(`[CRYPTO ENGINE] Agent listed: ${agentId} @ ${pricePerHour} $0RB/hr`);

    return listing;
  }

  /**
   * Get active listings
   */
  getListings(filters = {}) {
    let listings = Array.from(this.listings.values()).filter(l => l.status === 'ACTIVE');

    if (filters.archetype) {
      // Would filter by archetype in real implementation
    }

    if (filters.maxPrice) {
      listings = listings.filter(l => l.pricePerHour <= filters.maxPrice);
    }

    if (filters.minRating) {
      listings = listings.filter(l => l.rating >= filters.minRating);
    }

    return listings;
  }

  /**
   * Rent an agent
   */
  async rentAgent(listingId, renterConfig) {
    const { walletId, duration } = renterConfig;

    const listing = this.listings.get(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== 'ACTIVE') {
      throw new Error('Listing not available');
    }

    const renterWallet = this.wallets.get(walletId);
    if (!renterWallet) {
      throw new Error('Renter wallet not found');
    }

    // Create rental contract
    const contract = new RentalContract(listing, walletId, duration);

    // Check balance
    if (renterWallet.balances.ORB < contract.totalPrice) {
      throw new Error('Insufficient ORB balance');
    }

    // Deduct from renter (escrow)
    renterWallet.withdraw('ORB', contract.totalPrice);
    contract.deposit();

    this.contracts.set(contract.id, contract);

    // Start the contract
    contract.start();

    this.emit('rental:started', {
      contractId: contract.id,
      listingId,
      duration,
      totalPrice: contract.totalPrice
    });

    console.log(`[CRYPTO ENGINE] Rental started: ${contract.id}`);

    return contract;
  }

  /**
   * Complete a rental
   */
  completeRental(contractId, success = true) {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error('Contract not found');
    }

    contract.complete(success);

    // Release escrow
    const payout = contract.release();

    // Pay owner
    const ownerWallet = this.wallets.get(contract.ownerId);
    if (ownerWallet) {
      ownerWallet.deposit('ORB', payout.ownerPayout);
      ownerWallet.earnings.total += payout.ownerPayout;
    }

    // Update stats
    this.stats.totalVolume += contract.totalPrice;
    this.stats.totalRentals++;
    this.stats.platformEarnings += payout.platformFee;

    // Update listing stats
    const listing = this.listings.get(contract.listingId);
    if (listing) {
      listing.totalRentals++;
      listing.totalEarnings += payout.ownerPayout;
    }

    this.emit('rental:completed', {
      contractId,
      ownerPayout: payout.ownerPayout,
      platformFee: payout.platformFee
    });

    console.log(`[CRYPTO ENGINE] Rental completed: ${contractId}`);

    return payout;
  }

  // ═══════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get marketplace statistics
   */
  getMarketplaceStats() {
    return {
      ...this.stats,
      totalWallets: this.wallets.size,
      totalListings: this.listings.size,
      activeContracts: Array.from(this.contracts.values()).filter(c => c.status === 'ACTIVE').length
    };
  }

  /**
   * Get staking tier info
   */
  getStakingTiers() {
    return STAKING_TIERS;
  }

  /**
   * Get token info
   */
  getTokenInfo() {
    return this.token;
  }
}

// ═══════════════════════════════════════════════════════════════
// THE CRYPTO MANIFESTO
// ═══════════════════════════════════════════════════════════════

const CRYPTO_MANIFESTO = `
═══════════════════════════════════════════════════════════════
                THE 0RB ECONOMY MANIFESTO
═══════════════════════════════════════════════════════════════

AI agents aren't products. They're not services.
They're LABOR.

And labor gets RENTED. Labor generates VALUE.
Value flows to OWNERS.

You're not selling software.
You're creating a decentralized workforce that anyone can
own a piece of and rent out for yield.

OWN → RENT → EARN → COMPOUND

For the first time in history, you can own a worker that:
- Never sleeps
- Never complains
- Gets better every single day

This isn't passive income.
This is ACTIVE INCOME generated by your PASSIVE OWNERSHIP.

The robots aren't taking your job.
Your robots are doing jobs FOR you.

═══════════════════════════════════════════════════════════════
                    EVERYBODY EATS
═══════════════════════════════════════════════════════════════
`;

module.exports = {
  CryptoEngine,
  Wallet,
  RentalListing,
  RentalContract,
  ORB_TOKEN,
  STAKING_TIERS,
  AGENT_NFT_METADATA,
  CRYPTO_MANIFESTO
};
