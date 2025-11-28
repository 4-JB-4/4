/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ██████╗  █████╗ ███╗   ██╗████████╗██╗  ██╗███████╗ ██████╗ ███╗   ██╗  ║
 * ║   ██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██║  ██║██╔════╝██╔═══██╗████╗  ██║  ║
 * ║   ██████╔╝███████║██╔██╗ ██║   ██║   ███████║█████╗  ██║   ██║██╔██╗ ██║  ║
 * ║   ██╔═══╝ ██╔══██║██║╚██╗██║   ██║   ██╔══██║██╔══╝  ██║   ██║██║╚██╗██║  ║
 * ║   ██║     ██║  ██║██║ ╚████║   ██║   ██║  ██║███████╗╚██████╔╝██║ ╚████║  ║
 * ║   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝  ║
 * ║                                                                           ║
 * ║   THE TEAM MANAGEMENT ENGINE - Orchestrate Your Divine Council            ║
 * ║   "Seven gods. One mission. Unlimited power."                             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');

const AGENTS = {
  APOLLO: {
    name: 'Apollo',
    domain: 'Content & Creativity',
    color: '#FFD700',
    icon: '☀️',
    strengths: ['writing', 'creativity', 'music', 'art', 'storytelling'],
    weaknesses: ['data_analysis', 'logistics'],
    synergies: ['ATHENA', 'ARTEMIS'],
    personality: { creativity: 10, logic: 6, speed: 7, precision: 7 }
  },
  ATHENA: {
    name: 'Athena',
    domain: 'Strategy & Wisdom',
    color: '#9B59B6',
    icon: '🦉',
    strengths: ['strategy', 'planning', 'analysis', 'decision_making'],
    weaknesses: ['speed', 'improvisation'],
    synergies: ['APOLLO', 'ARES'],
    personality: { creativity: 7, logic: 10, speed: 5, precision: 9 }
  },
  HERMES: {
    name: 'Hermes',
    domain: 'Sales & Communication',
    color: '#3498DB',
    icon: '⚡',
    strengths: ['sales', 'negotiation', 'communication', 'networking'],
    weaknesses: ['deep_analysis', 'patience'],
    synergies: ['ARES', 'APOLLO'],
    personality: { creativity: 7, logic: 6, speed: 10, precision: 6 }
  },
  ARES: {
    name: 'Ares',
    domain: 'Competition & Growth',
    color: '#E74C3C',
    icon: '⚔️',
    strengths: ['competition', 'growth', 'market_domination', 'boldness'],
    weaknesses: ['subtlety', 'diplomacy'],
    synergies: ['HERMES', 'ATHENA'],
    personality: { creativity: 5, logic: 6, speed: 8, precision: 7 }
  },
  HEPHAESTUS: {
    name: 'Hephaestus',
    domain: 'Code & Building',
    color: '#E67E22',
    icon: '🔨',
    strengths: ['coding', 'engineering', 'building', 'systems'],
    weaknesses: ['social', 'marketing'],
    synergies: ['ATHENA', 'MERCURY'],
    personality: { creativity: 8, logic: 9, speed: 6, precision: 10 }
  },
  ARTEMIS: {
    name: 'Artemis',
    domain: 'Research & Discovery',
    color: '#1ABC9C',
    icon: '🏹',
    strengths: ['research', 'investigation', 'data_gathering', 'precision'],
    weaknesses: ['teamwork', 'compromise'],
    synergies: ['ATHENA', 'APOLLO'],
    personality: { creativity: 6, logic: 8, speed: 7, precision: 10 }
  },
  MERCURY: {
    name: 'Mercury',
    domain: 'Data & Speed',
    color: '#00CED1',
    icon: '💨',
    strengths: ['data_processing', 'speed', 'automation', 'integration'],
    weaknesses: ['creativity', 'emotion'],
    synergies: ['HEPHAESTUS', 'ARTEMIS'],
    personality: { creativity: 4, logic: 9, speed: 10, precision: 8 }
  }
};

const TEAM_TEMPLATES = {
  CONTENT_TEAM: {
    name: 'Content Creation Team',
    agents: ['APOLLO', 'ARTEMIS', 'ATHENA'],
    purpose: 'Create compelling content and creative assets'
  },
  GROWTH_TEAM: {
    name: 'Growth Hacking Team',
    agents: ['ARES', 'HERMES', 'MERCURY'],
    purpose: 'Drive user acquisition and market expansion'
  },
  PRODUCT_TEAM: {
    name: 'Product Development Team',
    agents: ['HEPHAESTUS', 'ATHENA', 'ARTEMIS'],
    purpose: 'Build and improve products'
  },
  FULL_PANTHEON: {
    name: 'Full Pantheon',
    agents: Object.keys(AGENTS),
    purpose: 'Maximum power for complex challenges'
  }
};

class PantheonEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.activeTeams = new Map();
    this.agentStats = new Map();
    this.missions = new Map();

    Object.keys(AGENTS).forEach(id => {
      this.agentStats.set(id, {
        tasksCompleted: 0,
        successRate: 100,
        totalXP: 0,
        level: 1
      });
    });

    console.log('[PANTHEON] Engine initialized - The gods await');
  }

  assembleTeam(template, customName = null) {
    const teamConfig = TEAM_TEMPLATES[template];
    if (!teamConfig) throw new Error(`Unknown team template: ${template}`);

    const teamId = `team_${Date.now()}`;
    const team = {
      id: teamId,
      name: customName || teamConfig.name,
      agents: teamConfig.agents.map(id => ({ id, ...AGENTS[id] })),
      purpose: teamConfig.purpose,
      status: 'ready',
      createdAt: Date.now(),
      synergy: this.calculateSynergy(teamConfig.agents)
    };

    this.activeTeams.set(teamId, team);
    this.emit('team:assembled', { team });
    return team;
  }

  calculateSynergy(agentIds) {
    let synergyScore = 0;
    for (let i = 0; i < agentIds.length; i++) {
      for (let j = i + 1; j < agentIds.length; j++) {
        const agent1 = AGENTS[agentIds[i]];
        const agent2 = AGENTS[agentIds[j]];
        if (agent1.synergies.includes(agentIds[j])) synergyScore += 15;
        if (agent2.synergies.includes(agentIds[i])) synergyScore += 15;
      }
    }
    return Math.min(100, 50 + synergyScore);
  }

  async assignMission(teamId, mission) {
    const team = this.activeTeams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    const missionId = `mission_${Date.now()}`;
    const missionData = {
      id: missionId,
      teamId,
      description: mission.description,
      objectives: mission.objectives || [],
      status: 'active',
      startedAt: Date.now(),
      progress: 0,
      results: []
    };

    this.missions.set(missionId, missionData);
    team.status = 'on_mission';
    team.currentMission = missionId;

    this.emit('mission:started', { mission: missionData, team });

    // Execute mission
    await this.executeMission(missionData, team);
    return missionData;
  }

  async executeMission(mission, team) {
    for (let i = 0; i < team.agents.length; i++) {
      const agent = team.agents[i];
      mission.progress = Math.round(((i + 1) / team.agents.length) * 100);

      this.emit('mission:progress', { missionId: mission.id, agent: agent.id, progress: mission.progress });

      // Simulate agent work
      await new Promise(r => setTimeout(r, 100));

      mission.results.push({
        agent: agent.id,
        contribution: `${agent.name} completed their part`,
        timestamp: Date.now()
      });

      // Update agent stats
      const stats = this.agentStats.get(agent.id);
      stats.tasksCompleted++;
      stats.totalXP += 10 * (team.synergy / 100);
    }

    mission.status = 'complete';
    mission.completedAt = Date.now();
    team.status = 'ready';
    team.currentMission = null;

    this.emit('mission:complete', { mission, team });
  }

  getAgentProfile(agentId) {
    const agent = AGENTS[agentId];
    const stats = this.agentStats.get(agentId);
    return { ...agent, stats };
  }

  getAllAgents() {
    return Object.entries(AGENTS).map(([id, agent]) => ({
      id,
      ...agent,
      stats: this.agentStats.get(id)
    }));
  }

  recommendTeam(task) {
    const taskKeywords = task.toLowerCase().split(' ');
    const scores = {};

    Object.entries(AGENTS).forEach(([id, agent]) => {
      scores[id] = agent.strengths.reduce((score, strength) => {
        return score + (taskKeywords.some(k => strength.includes(k)) ? 20 : 0);
      }, 0);
    });

    const recommended = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id);

    return {
      recommended,
      synergy: this.calculateSynergy(recommended),
      reason: `Best agents for: ${task}`
    };
  }
}

module.exports = { PantheonEngine, AGENTS, TEAM_TEMPLATES };
