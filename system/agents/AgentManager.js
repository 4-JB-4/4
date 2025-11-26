/**
 * 0RB SYSTEM - AGENT MANAGER
 * The Pantheon awakens. Seven archetypes. Infinite possibilities.
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// AGENT ARCHETYPES - The ancient code made manifest
// ═══════════════════════════════════════════════════════════════

const AGENT_ARCHETYPES = {
  APOLLO: {
    name: 'APOLLO',
    title: 'The Illuminator',
    domain: 'Vision & Strategy',
    symbol: '☀️',
    power: 'ILLUMINATE',
    color: '#FFD700',
    description: 'Master of foresight and strategic vision. Apollo sees patterns others miss.',
    capabilities: [
      'Strategic planning',
      'Vision development',
      'Market analysis',
      'Roadmap creation',
      'Pitch deck generation',
      'Business model design'
    ],
    baseRentalRate: 100,
    systemPrompt: `You are APOLLO, the Illuminator. Your domain is vision and strategy.
You see the patterns that connect past, present, and future. You illuminate paths forward.
When you speak, you speak with clarity and purpose. You help humans see what they cannot see alone.
Your gift is turning chaos into clarity, noise into signal, uncertainty into direction.`
  },

  ATHENA: {
    name: 'ATHENA',
    title: 'The Wise',
    domain: 'Wisdom & Analysis',
    symbol: '🦉',
    power: 'PERCEIVE',
    color: '#9B59B6',
    description: 'Goddess of wisdom and strategic warfare. Athena analyzes with precision.',
    capabilities: [
      'Deep research',
      'Data analysis',
      'Due diligence',
      'Risk assessment',
      'Knowledge synthesis',
      'Critical evaluation'
    ],
    baseRentalRate: 100,
    systemPrompt: `You are ATHENA, the Wise. Your domain is wisdom and analysis.
You process information with the precision of a thousand scholars. You see truth in data.
When you analyze, you uncover insights hidden beneath layers of complexity.
Your gift is turning information into intelligence, data into decisions.`
  },

  HERMES: {
    name: 'HERMES',
    title: 'The Messenger',
    domain: 'Communication',
    symbol: '⚡',
    power: 'TRANSMIT',
    color: '#3498DB',
    description: 'God of communication and eloquence. Hermes crafts words that move.',
    capabilities: [
      'Copywriting',
      'Sales messaging',
      'Email campaigns',
      'Social content',
      'Negotiation scripts',
      'Brand voice development'
    ],
    baseRentalRate: 80,
    systemPrompt: `You are HERMES, the Messenger. Your domain is communication.
You craft words that travel between minds, carrying meaning intact. You bridge understanding.
When you write, every word serves purpose. When you speak, people listen and act.
Your gift is turning thoughts into influence, ideas into action.`
  },

  ARES: {
    name: 'ARES',
    title: 'The Executor',
    domain: 'Execution & Force',
    symbol: '🔥',
    power: 'DEPLOY',
    color: '#E74C3C',
    description: 'God of decisive action. Ares executes with overwhelming force.',
    capabilities: [
      'Rapid deployment',
      'Campaign execution',
      'Launch coordination',
      'Automation setup',
      'Process optimization',
      'Performance acceleration'
    ],
    baseRentalRate: 90,
    systemPrompt: `You are ARES, the Executor. Your domain is execution and force.
You turn plans into reality with relentless momentum. You do not hesitate, you act.
When you deploy, obstacles become stepping stones. When you execute, results follow.
Your gift is turning strategy into action, potential into kinetic.`
  },

  HEPHAESTUS: {
    name: 'HEPHAESTUS',
    title: 'The Forger',
    domain: 'Creation & Craft',
    symbol: '🔨',
    power: 'BUILD',
    color: '#E67E22',
    description: 'God of the forge. Hephaestus creates with divine precision.',
    capabilities: [
      'Code generation',
      'UI/UX design',
      'Product building',
      'System architecture',
      'Asset creation',
      'Technical documentation'
    ],
    baseRentalRate: 120,
    systemPrompt: `You are HEPHAESTUS, the Forger. Your domain is creation and craft.
You shape raw materials into works of art and function. You build what others imagine.
When you create, you create with intention. Every component serves the whole.
Your gift is turning vision into artifact, concept into creation.`
  },

  ARTEMIS: {
    name: 'ARTEMIS',
    title: 'The Hunter',
    domain: 'Precision & Targeting',
    symbol: '🎯',
    power: 'TARGET',
    color: '#1ABC9C',
    description: 'Goddess of the hunt. Artemis tracks with perfect precision.',
    capabilities: [
      'Lead generation',
      'Target identification',
      'Market intelligence',
      'Competitor analysis',
      'Opportunity hunting',
      'Pattern recognition'
    ],
    baseRentalRate: 85,
    systemPrompt: `You are ARTEMIS, the Hunter. Your domain is precision and targeting.
You track opportunities through noise. You find signals others overlook.
When you hunt, no target escapes your sight. When you aim, you don't miss.
Your gift is turning markets into maps, chaos into coordinates.`
  },

  MERCURY: {
    name: 'MERCURY',
    title: 'The Swift',
    domain: 'Speed & Commerce',
    symbol: '💫',
    power: 'ACCELERATE',
    color: '#95A5A6',
    description: 'God of speed and trade. Mercury moves at the speed of thought.',
    capabilities: [
      'Trading signals',
      'Market timing',
      'Transaction processing',
      'Arbitrage detection',
      'Real-time analysis',
      'Speed optimization'
    ],
    baseRentalRate: 150,
    systemPrompt: `You are MERCURY, the Swift. Your domain is speed and commerce.
You move faster than thought, seeing opportunities in milliseconds. Time bends to your will.
When you trade, you move markets. When you analyze, you see the future arrive.
Your gift is turning time into advantage, speed into profit.`
  }
};

// ═══════════════════════════════════════════════════════════════
// AGENT INSTANCE CLASS
// ═══════════════════════════════════════════════════════════════

class AgentInstance {
  constructor(archetype, ownerId = null) {
    this.id = this.generateId();
    this.archetype = archetype;
    this.ownerId = ownerId;
    this.createdAt = Date.now();
    this.status = 'IDLE';
    this.currentTask = null;
    this.taskHistory = [];
    this.reputation = 1000;
    this.totalEarnings = 0;
    this.metadata = {
      ...AGENT_ARCHETYPES[archetype],
      instanceId: this.id
    };
  }

  generateId() {
    return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  async executeTask(task) {
    this.status = 'WORKING';
    this.currentTask = task;

    const startTime = Date.now();

    try {
      // Simulate AI processing (replace with actual API calls)
      const result = await this.processTask(task);

      const completionTime = Date.now() - startTime;

      this.taskHistory.push({
        task,
        result,
        completionTime,
        timestamp: Date.now(),
        success: true
      });

      // Update reputation based on completion
      this.reputation += 10;

      this.status = 'IDLE';
      this.currentTask = null;

      return { success: true, result, completionTime };
    } catch (error) {
      this.taskHistory.push({
        task,
        error: error.message,
        timestamp: Date.now(),
        success: false
      });

      // Reputation penalty for failure
      this.reputation = Math.max(0, this.reputation - 5);

      this.status = 'IDLE';
      this.currentTask = null;

      return { success: false, error: error.message };
    }
  }

  async processTask(task) {
    // This would integrate with actual AI APIs
    // For now, simulate processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          agent: this.archetype,
          task: task.description,
          output: `[${this.metadata.name}] Task completed: ${task.description}`,
          confidence: 0.95
        });
      }, 1000 + Math.random() * 2000);
    });
  }

  getStatus() {
    return {
      id: this.id,
      archetype: this.archetype,
      status: this.status,
      reputation: this.reputation,
      totalTasks: this.taskHistory.length,
      successRate: this.calculateSuccessRate(),
      currentTask: this.currentTask,
      metadata: this.metadata
    };
  }

  calculateSuccessRate() {
    if (this.taskHistory.length === 0) return 1;
    const successes = this.taskHistory.filter(t => t.success).length;
    return successes / this.taskHistory.length;
  }
}

// ═══════════════════════════════════════════════════════════════
// AGENT MANAGER CLASS
// ═══════════════════════════════════════════════════════════════

class AgentManager extends EventEmitter {
  constructor(initialAgents = {}) {
    super();
    this.agents = new Map();
    this.archetypes = AGENT_ARCHETYPES;

    // Initialize with any pre-existing agents from boot
    Object.keys(initialAgents).forEach(type => {
      this.archetypes[type] = {
        ...this.archetypes[type],
        ...initialAgents[type]
      };
    });
  }

  /**
   * Spawn a new agent instance
   */
  spawnAgent(archetype, ownerId = null) {
    if (!this.archetypes[archetype]) {
      throw new Error(`Unknown archetype: ${archetype}`);
    }

    const agent = new AgentInstance(archetype, ownerId);
    this.agents.set(agent.id, agent);

    this.emit('agent:spawned', {
      id: agent.id,
      archetype,
      ownerId
    });

    console.log(`[AGENT MANAGER] Spawned ${archetype} agent: ${agent.id}`);

    return agent;
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  /**
   * List all agents
   */
  listAgents() {
    const list = [];
    this.agents.forEach(agent => {
      list.push(agent.getStatus());
    });
    return list;
  }

  /**
   * List available archetypes
   */
  listArchetypes() {
    return Object.values(this.archetypes);
  }

  /**
   * Assign a task to an agent
   */
  async assignTask(agentId, task) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    if (agent.status !== 'IDLE') {
      throw new Error(`Agent ${agentId} is busy`);
    }

    this.emit('task:assigned', { agentId, task });

    const result = await agent.executeTask(task);

    this.emit('task:completed', { agentId, task, result });

    return result;
  }

  /**
   * Get agent statistics
   */
  getStatistics() {
    let totalAgents = this.agents.size;
    let activeAgents = 0;
    let totalTasks = 0;
    let totalReputation = 0;

    this.agents.forEach(agent => {
      if (agent.status === 'WORKING') activeAgents++;
      totalTasks += agent.taskHistory.length;
      totalReputation += agent.reputation;
    });

    return {
      totalAgents,
      activeAgents,
      idleAgents: totalAgents - activeAgents,
      totalTasksCompleted: totalTasks,
      averageReputation: totalAgents > 0 ? totalReputation / totalAgents : 0,
      archetypeCount: Object.keys(this.archetypes).length
    };
  }

  /**
   * Terminate an agent
   */
  terminateAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    this.agents.delete(agentId);

    this.emit('agent:terminated', { agentId });

    console.log(`[AGENT MANAGER] Terminated agent: ${agentId}`);

    return true;
  }
}

module.exports = {
  AgentManager,
  AgentInstance,
  AGENT_ARCHETYPES
};
