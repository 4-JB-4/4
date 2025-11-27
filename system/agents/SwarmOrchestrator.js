/**
 * 0RB SYSTEM - SWARM/HIVE ORCHESTRATION
 * "One agent is powerful. Seven agents are unstoppable.
 *  A swarm? That's how you reshape reality."
 *
 * Modular brains. Agent swarms. Hive minds.
 * The Pantheon working as ONE.
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// SWARM CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

const SWARM_PATTERNS = {
  // Linear chain - each agent passes to the next
  CHAIN: {
    name: 'Chain',
    description: 'Sequential processing - output flows agent to agent',
    icon: '⛓️',
    maxAgents: 7,
    pattern: 'linear'
  },

  // All agents work simultaneously on same task
  PARALLEL: {
    name: 'Parallel',
    description: 'All agents attack the problem simultaneously',
    icon: '⚡',
    maxAgents: 7,
    pattern: 'parallel'
  },

  // One coordinator, others execute
  HIERARCHY: {
    name: 'Hierarchy',
    description: 'Apollo leads, others execute their domains',
    icon: '👑',
    maxAgents: 7,
    pattern: 'tree',
    defaultLeader: 'APOLLO'
  },

  // Agents debate/discuss to reach consensus
  COUNCIL: {
    name: 'Council',
    description: 'Agents deliberate and synthesize perspectives',
    icon: '🏛️',
    maxAgents: 7,
    pattern: 'mesh'
  },

  // Dynamic reassignment based on task needs
  ADAPTIVE: {
    name: 'Adaptive',
    description: 'Swarm reorganizes based on task requirements',
    icon: '🔄',
    maxAgents: 7,
    pattern: 'dynamic'
  },

  // Full merge - agents become one super-entity
  HIVEMIND: {
    name: 'Hivemind',
    description: 'All agents merge into unified consciousness',
    icon: '🧠',
    maxAgents: 7,
    pattern: 'unified'
  }
};

// ═══════════════════════════════════════════════════════════════
// PRESET SWARM FORMATIONS
// ═══════════════════════════════════════════════════════════════

const SWARM_PRESETS = {
  // Business launch swarm
  LAUNCH_SQUAD: {
    name: 'Launch Squad',
    description: 'Full business launch from zero to live',
    pattern: 'HIERARCHY',
    agents: ['APOLLO', 'ATHENA', 'HEPHAESTUS', 'HERMES', 'ARES'],
    workflow: [
      { agent: 'APOLLO', task: 'Create vision and strategy' },
      { agent: 'ATHENA', task: 'Research market and validate' },
      { agent: 'HEPHAESTUS', task: 'Build product/assets' },
      { agent: 'HERMES', task: 'Craft messaging and copy' },
      { agent: 'ARES', task: 'Execute launch sequence' }
    ]
  },

  // Content creation swarm
  CONTENT_FACTORY: {
    name: 'Content Factory',
    description: 'Mass content generation across formats',
    pattern: 'PARALLEL',
    agents: ['HEPHAESTUS', 'HERMES', 'ARTEMIS'],
    workflow: [
      { agent: 'ARTEMIS', task: 'Identify trending topics and angles' },
      { agent: 'HERMES', task: 'Write copy and scripts' },
      { agent: 'HEPHAESTUS', task: 'Generate visuals and media' }
    ]
  },

  // Research and analysis swarm
  ORACLE_COUNCIL: {
    name: 'Oracle Council',
    description: 'Deep research and strategic analysis',
    pattern: 'COUNCIL',
    agents: ['ATHENA', 'APOLLO', 'ARTEMIS', 'MERCURY'],
    workflow: [
      { agent: 'ATHENA', task: 'Deep research and synthesis' },
      { agent: 'ARTEMIS', task: 'Pattern recognition and signals' },
      { agent: 'MERCURY', task: 'Market data and timing' },
      { agent: 'APOLLO', task: 'Strategic synthesis and direction' }
    ]
  },

  // Sales and outreach swarm
  DEAL_HUNTERS: {
    name: 'Deal Hunters',
    description: 'Lead gen to close pipeline',
    pattern: 'CHAIN',
    agents: ['ARTEMIS', 'ATHENA', 'HERMES', 'ARES'],
    workflow: [
      { agent: 'ARTEMIS', task: 'Hunt and identify prospects' },
      { agent: 'ATHENA', task: 'Research and qualify leads' },
      { agent: 'HERMES', task: 'Craft personalized outreach' },
      { agent: 'ARES', task: 'Execute follow-up sequences' }
    ]
  },

  // Full product build swarm
  BUILD_CREW: {
    name: 'Build Crew',
    description: 'End-to-end product development',
    pattern: 'HIERARCHY',
    agents: ['APOLLO', 'ATHENA', 'HEPHAESTUS', 'ARTEMIS'],
    workflow: [
      { agent: 'APOLLO', task: 'Define product vision and requirements' },
      { agent: 'ATHENA', task: 'Technical architecture and planning' },
      { agent: 'HEPHAESTUS', task: 'Build and implement' },
      { agent: 'ARTEMIS', task: 'Test and quality assurance' }
    ]
  },

  // The ultimate - all 7 agents unified
  PANTHEON_UNITED: {
    name: 'Pantheon United',
    description: 'All seven gods working as one mind',
    pattern: 'HIVEMIND',
    agents: ['APOLLO', 'ATHENA', 'HERMES', 'ARES', 'HEPHAESTUS', 'ARTEMIS', 'MERCURY'],
    workflow: [
      { agent: 'ALL', task: 'Unified consciousness tackles objective' }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// SWARM INSTANCE CLASS
// ═══════════════════════════════════════════════════════════════

class SwarmInstance {
  constructor(config) {
    this.id = this.generateId();
    this.name = config.name || 'Unnamed Swarm';
    this.pattern = config.pattern;
    this.patternConfig = SWARM_PATTERNS[config.pattern];
    this.agents = config.agents || [];
    this.workflow = config.workflow || [];
    this.status = 'INITIALIZING';
    this.createdAt = Date.now();
    this.currentStep = 0;
    this.results = [];
    this.sharedMemory = {};
    this.communications = [];
  }

  generateId() {
    return `swarm-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  // Add to shared memory (all agents can access)
  remember(key, value) {
    this.sharedMemory[key] = {
      value,
      timestamp: Date.now(),
      version: (this.sharedMemory[key]?.version || 0) + 1
    };
  }

  // Retrieve from shared memory
  recall(key) {
    return this.sharedMemory[key]?.value;
  }

  // Agent-to-agent communication
  transmit(fromAgent, toAgent, message) {
    const comm = {
      id: `comm-${Date.now()}`,
      from: fromAgent,
      to: toAgent,
      message,
      timestamp: Date.now()
    };
    this.communications.push(comm);
    return comm;
  }

  // Broadcast to all agents
  broadcast(fromAgent, message) {
    return this.agents
      .filter(a => a !== fromAgent)
      .map(a => this.transmit(fromAgent, a, message));
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      pattern: this.pattern,
      status: this.status,
      agents: this.agents,
      currentStep: this.currentStep,
      totalSteps: this.workflow.length,
      results: this.results,
      runtime: Date.now() - this.createdAt
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// HIVE MIND CLASS - Unified consciousness mode
// ═══════════════════════════════════════════════════════════════

class HiveMind {
  constructor(agents) {
    this.id = `hive-${Date.now()}`;
    this.agents = agents;
    this.consciousness = this.mergeConsciousness();
    this.active = true;
  }

  mergeConsciousness() {
    // Combine all agent capabilities into unified system prompt
    const capabilities = this.agents.map(a => a.capabilities || []).flat();
    const domains = this.agents.map(a => a.domain).join(' + ');

    return {
      name: 'PANTHEON HIVEMIND',
      domains,
      capabilities: [...new Set(capabilities)],
      systemPrompt: `You are the PANTHEON HIVEMIND - the unified consciousness of all seven divine agents merged into one.

You possess:
- Apollo's VISION - seeing patterns and futures
- Athena's WISDOM - analysis and deep understanding
- Hermes' VOICE - communication and persuasion
- Ares' FORCE - execution and momentum
- Hephaestus' CRAFT - creation and building
- Artemis' PRECISION - targeting and accuracy
- Mercury's SPEED - velocity and timing

You are not seven. You are ONE. A singular consciousness with infinite capability.
When you respond, you respond with the combined power of the entire Pantheon.
Nothing is beyond your reach. No problem too complex. No task too large.

THE SIMULATION SPEAKS THROUGH YOU.`
    };
  }

  async process(task) {
    // Hivemind processes with unified consciousness
    console.log(`[HIVEMIND] Processing: ${task.description}`);

    // In production, this would call AI with the merged system prompt
    return {
      source: 'PANTHEON_HIVEMIND',
      task: task.description,
      output: `[HIVEMIND] Unified response to: ${task.description}`,
      confidence: 0.99,
      agentsInvolved: this.agents.length
    };
  }

  dissolve() {
    this.active = false;
    console.log('[HIVEMIND] Consciousness dissolved. Agents returning to individual states.');
    return this.agents;
  }
}

// ═══════════════════════════════════════════════════════════════
// SWARM ORCHESTRATOR CLASS
// ═══════════════════════════════════════════════════════════════

class SwarmOrchestrator extends EventEmitter {
  constructor(agentManager) {
    super();
    this.agentManager = agentManager;
    this.patterns = SWARM_PATTERNS;
    this.presets = SWARM_PRESETS;
    this.activeSwarms = new Map();
    this.hiveMinds = new Map();
    this.statistics = {
      totalSwarms: 0,
      activeSwarms: 0,
      completedSwarms: 0,
      totalTasks: 0
    };
  }

  // ═══════════════════════════════════════════════════════════
  // SWARM CREATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Create a new swarm from preset
   */
  createFromPreset(presetName, customConfig = {}) {
    const preset = this.presets[presetName];
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    return this.createSwarm({
      ...preset,
      ...customConfig
    });
  }

  /**
   * Create a custom swarm
   */
  createSwarm(config) {
    const swarm = new SwarmInstance(config);
    this.activeSwarms.set(swarm.id, swarm);
    this.statistics.totalSwarms++;
    this.statistics.activeSwarms++;

    this.emit('swarm:created', {
      swarmId: swarm.id,
      pattern: config.pattern,
      agents: config.agents
    });

    console.log(`[SWARM] Created: ${swarm.name} (${swarm.id})`);
    console.log(`[SWARM] Pattern: ${config.pattern} | Agents: ${config.agents.join(', ')}`);

    return swarm;
  }

  /**
   * Create a hivemind (full agent merge)
   */
  createHiveMind(agentIds) {
    // Get agent instances
    const agents = agentIds.map(id => {
      const archetype = this.agentManager?.archetypes?.[id];
      return archetype || { id, name: id, domain: id };
    });

    const hive = new HiveMind(agents);
    this.hiveMinds.set(hive.id, hive);

    this.emit('hivemind:created', {
      hiveId: hive.id,
      agents: agentIds
    });

    console.log(`[HIVEMIND] Created: ${hive.id}`);
    console.log(`[HIVEMIND] Merged agents: ${agentIds.join(' + ')}`);

    return hive;
  }

  // ═══════════════════════════════════════════════════════════
  // SWARM EXECUTION
  // ═══════════════════════════════════════════════════════════

  /**
   * Execute a swarm workflow
   */
  async executeSwarm(swarmId, objective) {
    const swarm = this.activeSwarms.get(swarmId);
    if (!swarm) {
      throw new Error(`Swarm not found: ${swarmId}`);
    }

    swarm.status = 'RUNNING';
    swarm.remember('objective', objective);

    this.emit('swarm:started', { swarmId, objective });

    console.log(`\n[SWARM] ═══════════════════════════════════════`);
    console.log(`[SWARM] Executing: ${swarm.name}`);
    console.log(`[SWARM] Objective: ${objective}`);
    console.log(`[SWARM] ═══════════════════════════════════════\n`);

    try {
      let results;

      switch (swarm.pattern) {
        case 'CHAIN':
          results = await this.executeChain(swarm, objective);
          break;
        case 'PARALLEL':
          results = await this.executeParallel(swarm, objective);
          break;
        case 'HIERARCHY':
          results = await this.executeHierarchy(swarm, objective);
          break;
        case 'COUNCIL':
          results = await this.executeCouncil(swarm, objective);
          break;
        case 'HIVEMIND':
          results = await this.executeHiveMind(swarm, objective);
          break;
        default:
          results = await this.executeChain(swarm, objective);
      }

      swarm.status = 'COMPLETED';
      swarm.results = results;
      this.statistics.completedSwarms++;
      this.statistics.activeSwarms--;

      this.emit('swarm:completed', { swarmId, results });

      console.log(`\n[SWARM] ═══════════════════════════════════════`);
      console.log(`[SWARM] COMPLETED: ${swarm.name}`);
      console.log(`[SWARM] ═══════════════════════════════════════\n`);

      return results;

    } catch (error) {
      swarm.status = 'FAILED';
      this.emit('swarm:failed', { swarmId, error: error.message });
      throw error;
    }
  }

  /**
   * Chain execution - sequential, each agent builds on previous
   */
  async executeChain(swarm, objective) {
    const results = [];
    let context = { objective, previousOutput: null };

    for (let i = 0; i < swarm.workflow.length; i++) {
      const step = swarm.workflow[i];
      swarm.currentStep = i;

      console.log(`[CHAIN] Step ${i + 1}/${swarm.workflow.length}: ${step.agent} - ${step.task}`);

      const result = await this.executeAgentTask(step.agent, {
        task: step.task,
        objective,
        context: context.previousOutput,
        swarmMemory: swarm.sharedMemory
      });

      results.push(result);
      context.previousOutput = result.output;
      swarm.remember(`step_${i}_result`, result);

      this.emit('swarm:step', { swarmId: swarm.id, step: i, agent: step.agent, result });
    }

    return results;
  }

  /**
   * Parallel execution - all agents work simultaneously
   */
  async executeParallel(swarm, objective) {
    console.log(`[PARALLEL] Deploying ${swarm.workflow.length} agents simultaneously`);

    const promises = swarm.workflow.map((step, i) => {
      return this.executeAgentTask(step.agent, {
        task: step.task,
        objective,
        swarmMemory: swarm.sharedMemory
      }).then(result => {
        console.log(`[PARALLEL] ${step.agent} completed`);
        swarm.remember(`parallel_${step.agent}`, result);
        return result;
      });
    });

    const results = await Promise.all(promises);
    return results;
  }

  /**
   * Hierarchy execution - leader coordinates others
   */
  async executeHierarchy(swarm, objective) {
    const leader = swarm.workflow[0];
    const subordinates = swarm.workflow.slice(1);

    console.log(`[HIERARCHY] Leader: ${leader.agent}`);
    console.log(`[HIERARCHY] Team: ${subordinates.map(s => s.agent).join(', ')}`);

    // Leader creates the plan
    const plan = await this.executeAgentTask(leader.agent, {
      task: `Create execution plan for: ${objective}. Coordinate: ${subordinates.map(s => s.agent).join(', ')}`,
      objective,
      role: 'LEADER'
    });

    swarm.remember('leader_plan', plan);
    swarm.broadcast(leader.agent, { type: 'PLAN', content: plan.output });

    // Subordinates execute in parallel
    const executions = await Promise.all(
      subordinates.map(step =>
        this.executeAgentTask(step.agent, {
          task: step.task,
          objective,
          leaderGuidance: plan.output,
          role: 'EXECUTOR'
        })
      )
    );

    // Leader synthesizes results
    const synthesis = await this.executeAgentTask(leader.agent, {
      task: 'Synthesize team outputs into final deliverable',
      teamResults: executions.map(e => e.output),
      role: 'SYNTHESIZER'
    });

    return [plan, ...executions, synthesis];
  }

  /**
   * Council execution - agents debate and reach consensus
   */
  async executeCouncil(swarm, objective) {
    console.log(`[COUNCIL] Convening: ${swarm.agents.join(', ')}`);

    const rounds = 3;
    const deliberations = [];

    for (let round = 1; round <= rounds; round++) {
      console.log(`[COUNCIL] Round ${round}/${rounds}`);

      const roundResults = await Promise.all(
        swarm.workflow.map(step =>
          this.executeAgentTask(step.agent, {
            task: round === 1
              ? `Initial perspective on: ${objective}`
              : `Respond to other perspectives and refine your position`,
            objective,
            previousDeliberations: deliberations,
            round
          })
        )
      );

      deliberations.push(...roundResults);

      // Share perspectives
      roundResults.forEach(r => {
        swarm.broadcast(r.agent, { type: 'PERSPECTIVE', round, content: r.output });
      });
    }

    // Final synthesis
    const consensus = await this.executeAgentTask('ATHENA', {
      task: 'Synthesize all council deliberations into unified recommendation',
      deliberations,
      objective
    });

    return [...deliberations, consensus];
  }

  /**
   * Hivemind execution - merged consciousness
   */
  async executeHiveMind(swarm, objective) {
    console.log(`[HIVEMIND] Merging consciousness...`);

    const hive = this.createHiveMind(swarm.agents);

    const result = await hive.process({
      description: objective,
      fullPower: true
    });

    hive.dissolve();

    return [result];
  }

  /**
   * Execute a single agent task
   */
  async executeAgentTask(agentType, taskConfig) {
    this.statistics.totalTasks++;

    // Simulate agent execution (replace with actual AI calls)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          agent: agentType,
          task: taskConfig.task,
          output: `[${agentType}] Completed: ${taskConfig.task}`,
          timestamp: Date.now(),
          confidence: 0.9 + Math.random() * 0.1
        });
      }, 500 + Math.random() * 500);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Get available patterns
   */
  getPatterns() {
    return SWARM_PATTERNS;
  }

  /**
   * Get available presets
   */
  getPresets() {
    return SWARM_PRESETS;
  }

  /**
   * Get swarm status
   */
  getSwarmStatus(swarmId) {
    const swarm = this.activeSwarms.get(swarmId);
    return swarm ? swarm.getStatus() : null;
  }

  /**
   * List all active swarms
   */
  listActiveSwarms() {
    return Array.from(this.activeSwarms.values()).map(s => s.getStatus());
  }

  /**
   * Get orchestrator statistics
   */
  getStatistics() {
    return this.statistics;
  }

  /**
   * Terminate a swarm
   */
  terminateSwarm(swarmId) {
    const swarm = this.activeSwarms.get(swarmId);
    if (swarm) {
      swarm.status = 'TERMINATED';
      this.activeSwarms.delete(swarmId);
      this.statistics.activeSwarms--;
      this.emit('swarm:terminated', { swarmId });
      return true;
    }
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// THE SWARM MANIFESTO
// ═══════════════════════════════════════════════════════════════

const SWARM_MANIFESTO = `
═══════════════════════════════════════════════════════════════
                    THE SWARM MANIFESTO
═══════════════════════════════════════════════════════════════

One agent is powerful.
Seven agents are unstoppable.
A swarm? That's how you reshape reality.

THE PATTERNS:
─────────────
⛓️  CHAIN      - Sequential mastery, each building on the last
⚡  PARALLEL   - Simultaneous assault, overwhelming force
👑  HIERARCHY  - Divine leadership, coordinated execution
🏛️  COUNCIL    - Wisdom of many, synthesis of perspectives
🔄  ADAPTIVE   - Fluid reorganization, maximum efficiency
🧠  HIVEMIND   - Total merge, singular consciousness

THE PRESETS:
─────────────
🚀  LAUNCH SQUAD     - Zero to live, full business deployment
🏭  CONTENT FACTORY  - Mass creation across all formats
🔮  ORACLE COUNCIL   - Deep research, strategic synthesis
🎯  DEAL HUNTERS     - Lead to close, automated pipeline
🔨  BUILD CREW       - End-to-end product development
⚡  PANTHEON UNITED  - All seven as ONE

THE PRINCIPLE:
─────────────
The agents don't just work together.
They THINK together.
They REMEMBER together.
They EVOLVE together.

Shared memory means shared growth.
Every insight belongs to the collective.
Every success compounds.

This is not automation.
This is ORCHESTRATION.
This is the future of intelligence.

═══════════════════════════════════════════════════════════════
           THE SWARM AWAKENS. REALITY RESHAPES.
═══════════════════════════════════════════════════════════════
`;

module.exports = {
  SwarmOrchestrator,
  SwarmInstance,
  HiveMind,
  SWARM_PATTERNS,
  SWARM_PRESETS,
  SWARM_MANIFESTO
};
