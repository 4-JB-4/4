/**
 * HIVE GOVERNANCE
 * ═══════════════════════════════════════════════════════════════════
 * Decentralized Decision Protocol - Collective Intelligence in Action
 *
 * "One mind is limited. The Hive is infinite."
 *
 * Hive Governance enables decentralized decision-making across
 * agents, stakeholders, and systems. Proposals, voting, delegation,
 * and consensus - all orchestrated through collective intelligence.
 * ═══════════════════════════════════════════════════════════════════
 */

const GOVERNANCE_VERSION = '1.0.0';

/**
 * Proposal States
 */
const PROPOSAL_STATES = {
  DRAFT: 'draft',           // Being created
  PENDING: 'pending',       // Awaiting voting period
  ACTIVE: 'active',         // Voting in progress
  SUCCEEDED: 'succeeded',   // Passed threshold
  DEFEATED: 'defeated',     // Failed to pass
  QUEUED: 'queued',         // Awaiting execution
  EXECUTED: 'executed',     // Successfully executed
  CANCELLED: 'cancelled',   // Cancelled by proposer
  EXPIRED: 'expired'        // Voting period ended without quorum
};

/**
 * Vote Types
 */
const VOTE_TYPES = {
  FOR: 'for',
  AGAINST: 'against',
  ABSTAIN: 'abstain'
};

/**
 * Governance Models
 */
const GOVERNANCE_MODELS = {
  TOKEN_WEIGHTED: {
    name: 'Token Weighted',
    description: 'Voting power proportional to token holdings',
    quorumType: 'percentage',
    defaultQuorum: 0.04, // 4%
    defaultThreshold: 0.5 // 50%
  },
  ONE_MEMBER_ONE_VOTE: {
    name: 'Democratic',
    description: 'Each member gets equal voting power',
    quorumType: 'absolute',
    defaultQuorum: 100,
    defaultThreshold: 0.5
  },
  QUADRATIC: {
    name: 'Quadratic',
    description: 'Voting power is square root of holdings',
    quorumType: 'percentage',
    defaultQuorum: 0.04,
    defaultThreshold: 0.5
  },
  CONVICTION: {
    name: 'Conviction',
    description: 'Voting power increases over time',
    quorumType: 'none',
    decayRate: 0.9,
    defaultThreshold: 0.5
  },
  FUTARCHY: {
    name: 'Futarchy',
    description: 'Decisions based on prediction markets',
    marketDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
    defaultThreshold: 0.5
  },
  HOLOGRAPHIC: {
    name: 'Holographic',
    description: 'Staking-based with attention rewards',
    boostThreshold: 100,
    quorumType: 'relative',
    defaultQuorum: 0.1
  }
};

/**
 * Proposal Categories
 */
const PROPOSAL_CATEGORIES = {
  TREASURY: {
    name: 'Treasury',
    icon: '💰',
    requiredThreshold: 0.66, // 66% for treasury
    timelock: 48 * 60 * 60 * 1000 // 48 hours
  },
  PROTOCOL: {
    name: 'Protocol Upgrade',
    icon: '⚙️',
    requiredThreshold: 0.75, // 75% for protocol changes
    timelock: 72 * 60 * 60 * 1000 // 72 hours
  },
  AGENT: {
    name: 'Agent Governance',
    icon: '🤖',
    requiredThreshold: 0.5,
    timelock: 24 * 60 * 60 * 1000 // 24 hours
  },
  COMMUNITY: {
    name: 'Community',
    icon: '👥',
    requiredThreshold: 0.5,
    timelock: 12 * 60 * 60 * 1000 // 12 hours
  },
  EMERGENCY: {
    name: 'Emergency',
    icon: '🚨',
    requiredThreshold: 0.8, // 80% for emergency
    timelock: 0 // Immediate
  }
};

/**
 * Voting Power Calculator
 */
class VotingPowerCalculator {
  constructor(model) {
    this.model = model;
  }

  calculate(holdings, params = {}) {
    switch (this.model) {
      case 'TOKEN_WEIGHTED':
        return this.tokenWeighted(holdings);
      case 'QUADRATIC':
        return this.quadratic(holdings);
      case 'CONVICTION':
        return this.conviction(holdings, params.timeStaked);
      case 'ONE_MEMBER_ONE_VOTE':
        return holdings > 0 ? 1 : 0;
      default:
        return holdings;
    }
  }

  tokenWeighted(holdings) {
    return holdings;
  }

  quadratic(holdings) {
    return Math.sqrt(holdings);
  }

  conviction(holdings, timeStaked = 0) {
    const decayRate = GOVERNANCE_MODELS.CONVICTION.decayRate;
    const maxMultiplier = 10;
    const daysStaked = timeStaked / (24 * 60 * 60 * 1000);
    const multiplier = Math.min(maxMultiplier, 1 + (1 - Math.pow(decayRate, daysStaked)));
    return holdings * multiplier;
  }
}

/**
 * Proposal Class
 */
class Proposal {
  constructor(config) {
    this.id = config.id || `prop_${Date.now()}`;
    this.title = config.title;
    this.description = config.description;
    this.category = config.category || 'COMMUNITY';
    this.proposer = config.proposer;
    this.state = PROPOSAL_STATES.DRAFT;

    // Voting configuration
    this.votingPeriod = config.votingPeriod || 7 * 24 * 60 * 60 * 1000; // 7 days
    this.quorum = config.quorum;
    this.threshold = config.threshold;

    // Execution
    this.actions = config.actions || [];
    this.executionData = config.executionData || {};

    // Timestamps
    this.createdAt = Date.now();
    this.startTime = null;
    this.endTime = null;
    this.executedAt = null;

    // Votes tracking
    this.votes = new Map();
    this.voteTotals = {
      [VOTE_TYPES.FOR]: 0,
      [VOTE_TYPES.AGAINST]: 0,
      [VOTE_TYPES.ABSTAIN]: 0
    };
    this.totalVotingPower = 0;

    // Discussion
    this.comments = [];
    this.amendments = [];
  }

  activate(startTime = Date.now()) {
    if (this.state !== PROPOSAL_STATES.DRAFT && this.state !== PROPOSAL_STATES.PENDING) {
      throw new Error(`Cannot activate proposal in state: ${this.state}`);
    }

    this.state = PROPOSAL_STATES.ACTIVE;
    this.startTime = startTime;
    this.endTime = startTime + this.votingPeriod;
    return this;
  }

  castVote(voter, voteType, votingPower, reason = '') {
    if (this.state !== PROPOSAL_STATES.ACTIVE) {
      throw new Error('Proposal is not active for voting');
    }

    if (Date.now() > this.endTime) {
      throw new Error('Voting period has ended');
    }

    if (!Object.values(VOTE_TYPES).includes(voteType)) {
      throw new Error(`Invalid vote type: ${voteType}`);
    }

    // Remove previous vote if exists
    if (this.votes.has(voter)) {
      const previousVote = this.votes.get(voter);
      this.voteTotals[previousVote.type] -= previousVote.power;
      this.totalVotingPower -= previousVote.power;
    }

    // Record new vote
    const vote = {
      voter,
      type: voteType,
      power: votingPower,
      reason,
      timestamp: Date.now()
    };

    this.votes.set(voter, vote);
    this.voteTotals[voteType] += votingPower;
    this.totalVotingPower += votingPower;

    return vote;
  }

  finalize(totalSupply) {
    if (this.state !== PROPOSAL_STATES.ACTIVE) {
      throw new Error('Proposal is not active');
    }

    if (Date.now() < this.endTime) {
      throw new Error('Voting period has not ended');
    }

    // Check quorum
    const quorumMet = this.checkQuorum(totalSupply);
    if (!quorumMet) {
      this.state = PROPOSAL_STATES.EXPIRED;
      return { success: false, reason: 'Quorum not met' };
    }

    // Check threshold
    const thresholdMet = this.checkThreshold();
    if (thresholdMet) {
      this.state = PROPOSAL_STATES.SUCCEEDED;
      return { success: true, state: this.state };
    } else {
      this.state = PROPOSAL_STATES.DEFEATED;
      return { success: false, reason: 'Threshold not met' };
    }
  }

  checkQuorum(totalSupply) {
    const participation = this.totalVotingPower / totalSupply;
    return participation >= this.quorum;
  }

  checkThreshold() {
    const forVotes = this.voteTotals[VOTE_TYPES.FOR];
    const againstVotes = this.voteTotals[VOTE_TYPES.AGAINST];
    const total = forVotes + againstVotes;

    if (total === 0) return false;
    return (forVotes / total) >= this.threshold;
  }

  queue() {
    if (this.state !== PROPOSAL_STATES.SUCCEEDED) {
      throw new Error('Only succeeded proposals can be queued');
    }

    const category = PROPOSAL_CATEGORIES[this.category];
    this.executionTime = Date.now() + (category?.timelock || 0);
    this.state = PROPOSAL_STATES.QUEUED;
    return this;
  }

  async execute(executor) {
    if (this.state !== PROPOSAL_STATES.QUEUED) {
      throw new Error('Proposal must be queued before execution');
    }

    if (Date.now() < this.executionTime) {
      throw new Error('Timelock not expired');
    }

    try {
      for (const action of this.actions) {
        await executor(action);
      }
      this.state = PROPOSAL_STATES.EXECUTED;
      this.executedAt = Date.now();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  cancel(canceller) {
    if (canceller !== this.proposer) {
      throw new Error('Only proposer can cancel');
    }

    if (this.state === PROPOSAL_STATES.EXECUTED) {
      throw new Error('Cannot cancel executed proposal');
    }

    this.state = PROPOSAL_STATES.CANCELLED;
    return this;
  }

  addComment(author, content) {
    this.comments.push({
      id: `comment_${Date.now()}`,
      author,
      content,
      timestamp: Date.now(),
      votes: 0
    });
    return this;
  }

  proposeAmendment(author, changes) {
    this.amendments.push({
      id: `amend_${Date.now()}`,
      author,
      changes,
      timestamp: Date.now(),
      approved: false
    });
    return this;
  }

  getResults() {
    return {
      id: this.id,
      title: this.title,
      state: this.state,
      votes: this.voteTotals,
      totalVotingPower: this.totalVotingPower,
      participation: this.totalVotingPower,
      forPercentage: this.totalVotingPower > 0
        ? (this.voteTotals[VOTE_TYPES.FOR] / this.totalVotingPower) * 100
        : 0,
      againstPercentage: this.totalVotingPower > 0
        ? (this.voteTotals[VOTE_TYPES.AGAINST] / this.totalVotingPower) * 100
        : 0,
      voterCount: this.votes.size
    };
  }
}

/**
 * Delegation System
 */
class DelegationSystem {
  constructor() {
    this.delegations = new Map(); // delegator -> delegatee
    this.delegatedPower = new Map(); // delegatee -> total power
    this.delegationHistory = [];
  }

  delegate(delegator, delegatee, power, options = {}) {
    if (delegator === delegatee) {
      throw new Error('Cannot delegate to self');
    }

    // Check for delegation loops
    if (this.wouldCreateLoop(delegator, delegatee)) {
      throw new Error('Delegation would create a loop');
    }

    // Remove existing delegation
    this.undelegate(delegator);

    // Create new delegation
    const delegation = {
      delegator,
      delegatee,
      power,
      category: options.category || 'all', // Can delegate for specific categories
      expiresAt: options.expiresAt || null,
      createdAt: Date.now()
    };

    this.delegations.set(delegator, delegation);

    // Update delegated power
    const currentPower = this.delegatedPower.get(delegatee) || 0;
    this.delegatedPower.set(delegatee, currentPower + power);

    this.delegationHistory.push({
      type: 'delegate',
      ...delegation
    });

    return delegation;
  }

  undelegate(delegator) {
    const existing = this.delegations.get(delegator);
    if (existing) {
      const currentPower = this.delegatedPower.get(existing.delegatee) || 0;
      this.delegatedPower.set(existing.delegatee, currentPower - existing.power);
      this.delegations.delete(delegator);

      this.delegationHistory.push({
        type: 'undelegate',
        delegator,
        delegatee: existing.delegatee,
        timestamp: Date.now()
      });
    }
    return existing;
  }

  wouldCreateLoop(delegator, delegatee) {
    let current = delegatee;
    const visited = new Set([delegator]);

    while (current) {
      if (visited.has(current)) {
        return true;
      }
      visited.add(current);

      const delegation = this.delegations.get(current);
      current = delegation?.delegatee;
    }

    return false;
  }

  getEffectiveVotingPower(voter, basePower) {
    // Base power minus delegated away
    const delegatedAway = this.delegations.get(voter)?.power || 0;

    // Plus power delegated to this voter
    const receivedPower = this.delegatedPower.get(voter) || 0;

    return basePower - delegatedAway + receivedPower;
  }

  getDelegationChain(voter) {
    const chain = [voter];
    let current = voter;

    while (true) {
      const delegation = this.delegations.get(current);
      if (!delegation) break;
      chain.push(delegation.delegatee);
      current = delegation.delegatee;
    }

    return chain;
  }

  getDelegators(delegatee) {
    const delegators = [];
    this.delegations.forEach((delegation, delegator) => {
      if (delegation.delegatee === delegatee) {
        delegators.push({ delegator, power: delegation.power });
      }
    });
    return delegators;
  }
}

/**
 * Council System - For multi-sig and committee governance
 */
class Council {
  constructor(config) {
    this.id = config.id || `council_${Date.now()}`;
    this.name = config.name;
    this.members = new Map();
    this.requiredSignatures = config.requiredSignatures || 3;
    this.permissions = config.permissions || [];
    this.proposals = new Map();
  }

  addMember(address, role = 'member', weight = 1) {
    this.members.set(address, {
      address,
      role,
      weight,
      addedAt: Date.now()
    });
    return this;
  }

  removeMember(address) {
    this.members.delete(address);
    return this;
  }

  createProposal(proposer, action) {
    if (!this.members.has(proposer)) {
      throw new Error('Only council members can create proposals');
    }

    const proposal = {
      id: `council_prop_${Date.now()}`,
      proposer,
      action,
      signatures: new Map(),
      createdAt: Date.now(),
      executed: false
    };

    // Auto-sign by proposer
    proposal.signatures.set(proposer, {
      signer: proposer,
      timestamp: Date.now()
    });

    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  sign(proposalId, signer) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (!this.members.has(signer)) {
      throw new Error('Only council members can sign');
    }

    if (proposal.executed) {
      throw new Error('Proposal already executed');
    }

    proposal.signatures.set(signer, {
      signer,
      timestamp: Date.now()
    });

    return {
      signed: true,
      totalSignatures: proposal.signatures.size,
      required: this.requiredSignatures,
      canExecute: proposal.signatures.size >= this.requiredSignatures
    };
  }

  async execute(proposalId, executor) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.signatures.size < this.requiredSignatures) {
      throw new Error(`Need ${this.requiredSignatures} signatures, have ${proposal.signatures.size}`);
    }

    if (proposal.executed) {
      throw new Error('Already executed');
    }

    await executor(proposal.action);
    proposal.executed = true;
    proposal.executedAt = Date.now();

    return { success: true };
  }
}

/**
 * Hive Governance - Main Interface
 */
class HiveGovernance {
  constructor(config = {}) {
    this.version = GOVERNANCE_VERSION;
    this.model = config.model || 'TOKEN_WEIGHTED';
    this.totalSupply = config.totalSupply || 1000000000; // 1B tokens
    this.proposals = new Map();
    this.councils = new Map();
    this.votingPowerCalculator = new VotingPowerCalculator(this.model);
    this.delegation = new DelegationSystem();
    this.history = [];

    // Configuration
    this.quorum = config.quorum || GOVERNANCE_MODELS[this.model].defaultQuorum;
    this.threshold = config.threshold || GOVERNANCE_MODELS[this.model].defaultThreshold;
    this.proposalThreshold = config.proposalThreshold || 100000; // Tokens needed to propose
    this.votingPeriod = config.votingPeriod || 7 * 24 * 60 * 60 * 1000;
  }

  /**
   * Create a new proposal
   */
  createProposal(config) {
    const { proposer, holdings, ...proposalConfig } = config;

    // Check proposal threshold
    if (holdings < this.proposalThreshold) {
      throw new Error(`Need ${this.proposalThreshold} tokens to create proposal`);
    }

    const proposal = new Proposal({
      ...proposalConfig,
      proposer,
      quorum: this.quorum,
      threshold: PROPOSAL_CATEGORIES[proposalConfig.category]?.requiredThreshold || this.threshold,
      votingPeriod: this.votingPeriod
    });

    this.proposals.set(proposal.id, proposal);

    this.history.push({
      type: 'proposal_created',
      proposalId: proposal.id,
      proposer,
      timestamp: Date.now()
    });

    return proposal;
  }

  /**
   * Activate a proposal for voting
   */
  activateProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    proposal.activate();

    this.history.push({
      type: 'proposal_activated',
      proposalId,
      timestamp: Date.now()
    });

    return proposal;
  }

  /**
   * Cast a vote
   */
  vote(proposalId, voter, voteType, holdings, reason = '') {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Calculate effective voting power
    const basePower = this.votingPowerCalculator.calculate(holdings);
    const effectivePower = this.delegation.getEffectiveVotingPower(voter, basePower);

    const vote = proposal.castVote(voter, voteType, effectivePower, reason);

    this.history.push({
      type: 'vote_cast',
      proposalId,
      voter,
      voteType,
      power: effectivePower,
      timestamp: Date.now()
    });

    return vote;
  }

  /**
   * Finalize a proposal after voting ends
   */
  finalizeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const result = proposal.finalize(this.totalSupply);

    this.history.push({
      type: 'proposal_finalized',
      proposalId,
      result: proposal.state,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Queue successful proposal for execution
   */
  queueProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    proposal.queue();

    this.history.push({
      type: 'proposal_queued',
      proposalId,
      executionTime: proposal.executionTime,
      timestamp: Date.now()
    });

    return proposal;
  }

  /**
   * Execute a queued proposal
   */
  async executeProposal(proposalId, executor) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const result = await proposal.execute(executor);

    this.history.push({
      type: 'proposal_executed',
      proposalId,
      success: result.success,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Create a council for multi-sig governance
   */
  createCouncil(config) {
    const council = new Council(config);
    this.councils.set(council.id, council);
    return council;
  }

  /**
   * Delegate voting power
   */
  delegate(delegator, delegatee, power, options = {}) {
    return this.delegation.delegate(delegator, delegatee, power, options);
  }

  /**
   * Get active proposals
   */
  getActiveProposals() {
    return Array.from(this.proposals.values())
      .filter(p => p.state === PROPOSAL_STATES.ACTIVE)
      .map(p => p.getResults());
  }

  /**
   * Get proposal by ID
   */
  getProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    return proposal ? proposal.getResults() : null;
  }

  /**
   * Get governance statistics
   */
  getStats() {
    const proposals = Array.from(this.proposals.values());

    return {
      totalProposals: proposals.length,
      byState: {
        active: proposals.filter(p => p.state === PROPOSAL_STATES.ACTIVE).length,
        succeeded: proposals.filter(p => p.state === PROPOSAL_STATES.SUCCEEDED).length,
        defeated: proposals.filter(p => p.state === PROPOSAL_STATES.DEFEATED).length,
        executed: proposals.filter(p => p.state === PROPOSAL_STATES.EXECUTED).length
      },
      totalVotesCast: proposals.reduce((sum, p) => sum + p.votes.size, 0),
      averageParticipation: proposals.length > 0
        ? proposals.reduce((sum, p) => sum + p.totalVotingPower, 0) / proposals.length / this.totalSupply
        : 0,
      councils: this.councils.size,
      activeDelegations: this.delegation.delegations.size
    };
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      version: this.version,
      model: this.model,
      totalSupply: this.totalSupply,
      quorum: this.quorum,
      threshold: this.threshold,
      proposalThreshold: this.proposalThreshold,
      votingPeriod: this.votingPeriod,
      stats: this.getStats(),
      availableModels: Object.keys(GOVERNANCE_MODELS),
      categories: Object.keys(PROPOSAL_CATEGORIES)
    };
  }

  // Static accessors
  static get MODELS() { return GOVERNANCE_MODELS; }
  static get CATEGORIES() { return PROPOSAL_CATEGORIES; }
  static get STATES() { return PROPOSAL_STATES; }
  static get VOTE_TYPES() { return VOTE_TYPES; }
}

// Export everything
module.exports = {
  HiveGovernance,
  Proposal,
  Council,
  DelegationSystem,
  VotingPowerCalculator,
  GOVERNANCE_MODELS,
  PROPOSAL_CATEGORIES,
  PROPOSAL_STATES,
  VOTE_TYPES
};
