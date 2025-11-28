/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║    █████╗  ██████╗ ███████╗███╗   ██╗████████╗                            ║
 * ║   ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝                            ║
 * ║   ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║                               ║
 * ║   ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║                               ║
 * ║   ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║                               ║
 * ║   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝                               ║
 * ║                                                                           ║
 * ║   ███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗                ║
 * ║   ████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝                ║
 * ║   ██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝                 ║
 * ║   ██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝                  ║
 * ║   ██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║                   ║
 * ║   ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝                   ║
 * ║                                                                           ║
 * ║   PERSISTENT CONSCIOUSNESS SYSTEM                                         ║
 * ║   Agents that remember. Agents that grow. Agents that LIVE.               ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY TYPES
// ═══════════════════════════════════════════════════════════════════════════

const MEMORY_TYPES = {
  EPISODIC: {
    name: 'Episodic',
    description: 'Specific events and interactions',
    icon: '📖',
    decay: 0.1,        // Memory strength decay per day
    maxItems: 10000,
    importance: 'variable'
  },
  SEMANTIC: {
    name: 'Semantic',
    description: 'Facts, knowledge, and learned information',
    icon: '🧠',
    decay: 0.01,
    maxItems: 50000,
    importance: 'high'
  },
  PROCEDURAL: {
    name: 'Procedural',
    description: 'How to do things, skills, and processes',
    icon: '⚙️',
    decay: 0.001,
    maxItems: 5000,
    importance: 'critical'
  },
  EMOTIONAL: {
    name: 'Emotional',
    description: 'Feelings, preferences, and associations',
    icon: '💜',
    decay: 0.05,
    maxItems: 5000,
    importance: 'high'
  },
  WORKING: {
    name: 'Working',
    description: 'Short-term, active processing memory',
    icon: '⚡',
    decay: 1.0,        // Decays within session
    maxItems: 100,
    importance: 'immediate'
  },
  COLLECTIVE: {
    name: 'Collective',
    description: 'Shared memories across all agents',
    icon: '🌐',
    decay: 0.001,
    maxItems: 100000,
    importance: 'shared'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY ENTRY CLASS
// ═══════════════════════════════════════════════════════════════════════════

class MemoryEntry {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type || 'EPISODIC';
    this.content = data.content;
    this.embedding = data.embedding || null;
    this.timestamp = data.timestamp || Date.now();
    this.lastAccessed = data.lastAccessed || Date.now();
    this.accessCount = data.accessCount || 0;
    this.importance = data.importance || 0.5;
    this.strength = data.strength || 1.0;
    this.context = data.context || {};
    this.associations = data.associations || [];
    this.tags = data.tags || [];
    this.source = data.source || 'unknown';
    this.agentId = data.agentId;
    this.metadata = data.metadata || {};
  }

  access() {
    this.lastAccessed = Date.now();
    this.accessCount++;
    // Strengthen memory on access
    this.strength = Math.min(1.0, this.strength + 0.1);
    return this;
  }

  decay(rate) {
    const daysSinceAccess = (Date.now() - this.lastAccessed) / (1000 * 60 * 60 * 24);
    this.strength = Math.max(0, this.strength - (rate * daysSinceAccess));
    return this.strength;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      embedding: this.embedding,
      timestamp: this.timestamp,
      lastAccessed: this.lastAccessed,
      accessCount: this.accessCount,
      importance: this.importance,
      strength: this.strength,
      context: this.context,
      associations: this.associations,
      tags: this.tags,
      source: this.source,
      agentId: this.agentId,
      metadata: this.metadata
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY INDEX - Fast Retrieval
// ═══════════════════════════════════════════════════════════════════════════

class MemoryIndex {
  constructor() {
    this.byId = new Map();
    this.byType = new Map();
    this.byTag = new Map();
    this.byAgent = new Map();
    this.temporal = [];  // Sorted by timestamp
    this.embeddings = new Map();  // For semantic search
  }

  add(memory) {
    // By ID
    this.byId.set(memory.id, memory);

    // By Type
    if (!this.byType.has(memory.type)) {
      this.byType.set(memory.type, new Set());
    }
    this.byType.get(memory.type).add(memory.id);

    // By Tags
    memory.tags.forEach(tag => {
      if (!this.byTag.has(tag)) {
        this.byTag.set(tag, new Set());
      }
      this.byTag.get(tag).add(memory.id);
    });

    // By Agent
    if (memory.agentId) {
      if (!this.byAgent.has(memory.agentId)) {
        this.byAgent.set(memory.agentId, new Set());
      }
      this.byAgent.get(memory.agentId).add(memory.id);
    }

    // Temporal index
    this.temporal.push({ id: memory.id, timestamp: memory.timestamp });
    this.temporal.sort((a, b) => b.timestamp - a.timestamp);

    // Embedding index
    if (memory.embedding) {
      this.embeddings.set(memory.id, memory.embedding);
    }
  }

  remove(memoryId) {
    const memory = this.byId.get(memoryId);
    if (!memory) return false;

    this.byId.delete(memoryId);

    const typeSet = this.byType.get(memory.type);
    if (typeSet) typeSet.delete(memoryId);

    memory.tags.forEach(tag => {
      const tagSet = this.byTag.get(tag);
      if (tagSet) tagSet.delete(memoryId);
    });

    if (memory.agentId) {
      const agentSet = this.byAgent.get(memory.agentId);
      if (agentSet) agentSet.delete(memoryId);
    }

    this.temporal = this.temporal.filter(t => t.id !== memoryId);
    this.embeddings.delete(memoryId);

    return true;
  }

  get(id) {
    return this.byId.get(id);
  }

  getByType(type) {
    const ids = this.byType.get(type);
    if (!ids) return [];
    return Array.from(ids).map(id => this.byId.get(id)).filter(Boolean);
  }

  getByTag(tag) {
    const ids = this.byTag.get(tag);
    if (!ids) return [];
    return Array.from(ids).map(id => this.byId.get(id)).filter(Boolean);
  }

  getByAgent(agentId) {
    const ids = this.byAgent.get(agentId);
    if (!ids) return [];
    return Array.from(ids).map(id => this.byId.get(id)).filter(Boolean);
  }

  getRecent(limit = 100) {
    return this.temporal
      .slice(0, limit)
      .map(t => this.byId.get(t.id))
      .filter(Boolean);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT MEMORY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

class AgentMemorySystem extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      storagePath: config.storagePath || './data/memory',
      autosaveInterval: config.autosaveInterval || 60000,  // 1 minute
      maxMemorySize: config.maxMemorySize || 1000000000,   // 1GB
      enableConsolidation: config.enableConsolidation !== false,
      consolidationInterval: config.consolidationInterval || 3600000, // 1 hour
      enableEmbeddings: config.enableEmbeddings !== false,
      ...config
    };

    this.index = new MemoryIndex();
    this.workingMemory = new Map();  // Per-agent working memory
    this.stats = {
      totalMemories: 0,
      totalSize: 0,
      byType: {},
      byAgent: {}
    };

    this.initialized = false;
    this.dirty = false;

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         AGENT MEMORY SYSTEM INITIALIZING                     ║
╠══════════════════════════════════════════════════════════════╣
║  Storage: ${this.config.storagePath.substring(0, 45).padEnd(47)}║
║  Autosave: ${(this.config.autosaveInterval / 1000)}s${' '.repeat(46)}║
║  Embeddings: ${(this.config.enableEmbeddings ? 'ENABLED' : 'DISABLED').padEnd(44)}║
╚══════════════════════════════════════════════════════════════╝
    `);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────────────────

  async initialize() {
    if (this.initialized) return;

    try {
      await fs.mkdir(this.config.storagePath, { recursive: true });
      await this.loadMemories();

      // Start autosave
      this.autosaveTimer = setInterval(() => {
        if (this.dirty) {
          this.saveMemories();
        }
      }, this.config.autosaveInterval);

      // Start consolidation
      if (this.config.enableConsolidation) {
        this.consolidationTimer = setInterval(() => {
          this.consolidateMemories();
        }, this.config.consolidationInterval);
      }

      this.initialized = true;
      this.emit('initialized', this.stats);
      console.log(`[MEMORY] System initialized with ${this.stats.totalMemories} memories`);

    } catch (error) {
      console.error('[MEMORY] Initialization error:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Core Memory Operations
  // ─────────────────────────────────────────────────────────────────────────

  async store(agentId, content, options = {}) {
    const memory = new MemoryEntry({
      content,
      agentId,
      type: options.type || 'EPISODIC',
      importance: options.importance || this.calculateImportance(content),
      tags: options.tags || this.extractTags(content),
      context: options.context || {},
      source: options.source || 'direct',
      metadata: options.metadata || {}
    });

    // Generate embedding if enabled
    if (this.config.enableEmbeddings) {
      memory.embedding = await this.generateEmbedding(content);
    }

    // Add to index
    this.index.add(memory);

    // Update stats
    this.stats.totalMemories++;
    this.stats.byType[memory.type] = (this.stats.byType[memory.type] || 0) + 1;
    this.stats.byAgent[agentId] = (this.stats.byAgent[agentId] || 0) + 1;

    this.dirty = true;
    this.emit('memory:stored', { memory, agentId });

    return memory;
  }

  async recall(agentId, query, options = {}) {
    const results = [];
    const limit = options.limit || 10;
    const types = options.types || Object.keys(MEMORY_TYPES);

    // Get agent's memories
    let memories = this.index.getByAgent(agentId);

    // Filter by type
    memories = memories.filter(m => types.includes(m.type));

    // Semantic search if embeddings enabled
    if (this.config.enableEmbeddings && query) {
      const queryEmbedding = await this.generateEmbedding(query);
      memories = this.semanticSearch(memories, queryEmbedding, limit * 2);
    }

    // Keyword search
    if (query) {
      const keywords = query.toLowerCase().split(/\s+/);
      memories = memories.filter(m => {
        const content = JSON.stringify(m.content).toLowerCase();
        return keywords.some(k => content.includes(k));
      });
    }

    // Score and rank
    const scored = memories.map(m => ({
      memory: m,
      score: this.calculateRelevanceScore(m, query, options)
    }));

    scored.sort((a, b) => b.score - a.score);

    // Get top results and access them
    const topResults = scored.slice(0, limit);
    topResults.forEach(r => r.memory.access());

    this.emit('memory:recalled', { agentId, query, count: topResults.length });

    return topResults.map(r => ({
      ...r.memory.toJSON(),
      relevanceScore: r.score
    }));
  }

  async forget(agentId, memoryId) {
    const memory = this.index.get(memoryId);
    if (!memory || memory.agentId !== agentId) {
      return false;
    }

    this.index.remove(memoryId);

    this.stats.totalMemories--;
    this.stats.byType[memory.type]--;
    this.stats.byAgent[agentId]--;

    this.dirty = true;
    this.emit('memory:forgotten', { memoryId, agentId });

    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Working Memory (Short-term)
  // ─────────────────────────────────────────────────────────────────────────

  setWorkingMemory(agentId, key, value, ttl = 300000) {  // 5 min default
    if (!this.workingMemory.has(agentId)) {
      this.workingMemory.set(agentId, new Map());
    }

    const agentWM = this.workingMemory.get(agentId);
    agentWM.set(key, {
      value,
      expires: Date.now() + ttl
    });

    // Auto-cleanup
    setTimeout(() => {
      const entry = agentWM.get(key);
      if (entry && entry.expires <= Date.now()) {
        agentWM.delete(key);
      }
    }, ttl);

    return true;
  }

  getWorkingMemory(agentId, key) {
    const agentWM = this.workingMemory.get(agentId);
    if (!agentWM) return null;

    const entry = agentWM.get(key);
    if (!entry || entry.expires <= Date.now()) {
      agentWM.delete(key);
      return null;
    }

    return entry.value;
  }

  getAllWorkingMemory(agentId) {
    const agentWM = this.workingMemory.get(agentId);
    if (!agentWM) return {};

    const result = {};
    const now = Date.now();

    agentWM.forEach((entry, key) => {
      if (entry.expires > now) {
        result[key] = entry.value;
      } else {
        agentWM.delete(key);
      }
    });

    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Collective Memory (Shared across agents)
  // ─────────────────────────────────────────────────────────────────────────

  async storeCollective(content, options = {}) {
    const memory = new MemoryEntry({
      content,
      agentId: 'COLLECTIVE',
      type: 'COLLECTIVE',
      importance: options.importance || 0.8,
      tags: ['collective', ...(options.tags || [])],
      context: options.context || {},
      source: options.source || 'collective',
      metadata: {
        ...options.metadata,
        contributors: options.contributors || []
      }
    });

    if (this.config.enableEmbeddings) {
      memory.embedding = await this.generateEmbedding(content);
    }

    this.index.add(memory);
    this.stats.totalMemories++;
    this.dirty = true;

    this.emit('memory:collective:stored', { memory });
    return memory;
  }

  async recallCollective(query, options = {}) {
    const memories = this.index.getByType('COLLECTIVE');

    if (this.config.enableEmbeddings && query) {
      const queryEmbedding = await this.generateEmbedding(query);
      const results = this.semanticSearch(memories, queryEmbedding, options.limit || 10);
      return results.map(m => m.toJSON());
    }

    return memories.slice(0, options.limit || 10).map(m => m.toJSON());
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Memory Consolidation (Like sleep for humans)
  // ─────────────────────────────────────────────────────────────────────────

  async consolidateMemories() {
    console.log('[MEMORY] Starting memory consolidation...');
    const startTime = Date.now();
    let consolidated = 0;
    let forgotten = 0;

    // Process each memory type
    for (const [type, config] of Object.entries(MEMORY_TYPES)) {
      const memories = this.index.getByType(type);

      for (const memory of memories) {
        // Apply decay
        const newStrength = memory.decay(config.decay);

        // Forget weak memories
        if (newStrength <= 0.1) {
          this.index.remove(memory.id);
          this.stats.totalMemories--;
          forgotten++;
          continue;
        }

        // Consolidate important episodic memories to semantic
        if (type === 'EPISODIC' && memory.importance > 0.8 && memory.accessCount > 5) {
          await this.promoteToSemantic(memory);
          consolidated++;
        }
      }

      // Enforce max items per type
      const typeMemories = this.index.getByType(type);
      if (typeMemories.length > config.maxItems) {
        const toRemove = typeMemories
          .sort((a, b) => a.strength - b.strength)
          .slice(0, typeMemories.length - config.maxItems);

        toRemove.forEach(m => {
          this.index.remove(m.id);
          this.stats.totalMemories--;
          forgotten++;
        });
      }
    }

    this.dirty = true;
    const duration = Date.now() - startTime;

    console.log(`[MEMORY] Consolidation complete: ${consolidated} consolidated, ${forgotten} forgotten (${duration}ms)`);
    this.emit('memory:consolidated', { consolidated, forgotten, duration });
  }

  async promoteToSemantic(episodicMemory) {
    // Extract key information from episodic memory
    const semanticContent = {
      summary: typeof episodicMemory.content === 'string'
        ? episodicMemory.content
        : JSON.stringify(episodicMemory.content),
      derivedFrom: episodicMemory.id,
      originalTimestamp: episodicMemory.timestamp
    };

    const semantic = new MemoryEntry({
      content: semanticContent,
      agentId: episodicMemory.agentId,
      type: 'SEMANTIC',
      importance: episodicMemory.importance,
      tags: [...episodicMemory.tags, 'derived'],
      associations: [episodicMemory.id],
      source: 'consolidation'
    });

    if (this.config.enableEmbeddings) {
      semantic.embedding = episodicMemory.embedding;
    }

    this.index.add(semantic);
    this.stats.totalMemories++;
    this.stats.byType['SEMANTIC'] = (this.stats.byType['SEMANTIC'] || 0) + 1;

    return semantic;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Association & Linking
  // ─────────────────────────────────────────────────────────────────────────

  async createAssociation(memoryId1, memoryId2, strength = 0.5) {
    const memory1 = this.index.get(memoryId1);
    const memory2 = this.index.get(memoryId2);

    if (!memory1 || !memory2) return false;

    if (!memory1.associations.includes(memoryId2)) {
      memory1.associations.push(memoryId2);
    }
    if (!memory2.associations.includes(memoryId1)) {
      memory2.associations.push(memoryId1);
    }

    this.dirty = true;
    this.emit('memory:associated', { memoryId1, memoryId2, strength });

    return true;
  }

  async getAssociatedMemories(memoryId, depth = 1) {
    const memory = this.index.get(memoryId);
    if (!memory) return [];

    const visited = new Set([memoryId]);
    const result = [];
    let currentLevel = memory.associations;

    for (let d = 0; d < depth; d++) {
      const nextLevel = [];

      for (const assocId of currentLevel) {
        if (visited.has(assocId)) continue;
        visited.add(assocId);

        const assocMemory = this.index.get(assocId);
        if (assocMemory) {
          result.push({ memory: assocMemory.toJSON(), depth: d + 1 });
          nextLevel.push(...assocMemory.associations);
        }
      }

      currentLevel = nextLevel;
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Utility Methods
  // ─────────────────────────────────────────────────────────────────────────

  calculateImportance(content) {
    // Heuristic-based importance calculation
    let score = 0.5;

    const text = typeof content === 'string' ? content : JSON.stringify(content);

    // Length factor
    if (text.length > 1000) score += 0.1;
    if (text.length > 5000) score += 0.1;

    // Question/command indicators
    if (text.includes('?')) score += 0.1;
    if (/^(create|build|make|generate|analyze)/i.test(text)) score += 0.15;

    // Emotional indicators
    if (/(!{2,}|important|urgent|critical)/i.test(text)) score += 0.15;

    return Math.min(1.0, score);
  }

  extractTags(content) {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const tags = [];

    // Extract hashtags
    const hashtags = text.match(/#\w+/g);
    if (hashtags) {
      tags.push(...hashtags.map(t => t.slice(1).toLowerCase()));
    }

    // Extract common keywords
    const keywords = ['project', 'task', 'goal', 'idea', 'problem', 'solution', 'plan'];
    keywords.forEach(kw => {
      if (text.toLowerCase().includes(kw)) {
        tags.push(kw);
      }
    });

    return [...new Set(tags)];
  }

  async generateEmbedding(content) {
    // Simplified embedding generation
    // In production, use OpenAI/Anthropic embeddings API
    const text = typeof content === 'string' ? content : JSON.stringify(content);

    // Simple hash-based pseudo-embedding for demo
    const embedding = new Array(384).fill(0);
    for (let i = 0; i < text.length; i++) {
      embedding[i % 384] += text.charCodeAt(i) / 1000;
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / (magnitude || 1));
  }

  semanticSearch(memories, queryEmbedding, limit) {
    const scored = memories
      .filter(m => m.embedding)
      .map(m => ({
        memory: m,
        similarity: this.cosineSimilarity(m.embedding, queryEmbedding)
      }))
      .sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, limit).map(s => s.memory);
  }

  cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  calculateRelevanceScore(memory, query, options) {
    let score = 0;

    // Strength factor
    score += memory.strength * 0.3;

    // Recency factor
    const daysSince = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
    score += Math.max(0, (1 - daysSince / 365)) * 0.2;

    // Access frequency factor
    score += Math.min(memory.accessCount / 100, 1) * 0.2;

    // Importance factor
    score += memory.importance * 0.3;

    return score;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Persistence
  // ─────────────────────────────────────────────────────────────────────────

  async loadMemories() {
    try {
      const files = await fs.readdir(this.config.storagePath);
      const memoryFiles = files.filter(f => f.endsWith('.json'));

      for (const file of memoryFiles) {
        const content = await fs.readFile(
          path.join(this.config.storagePath, file),
          'utf-8'
        );
        const data = JSON.parse(content);

        if (Array.isArray(data)) {
          data.forEach(memData => {
            const memory = new MemoryEntry(memData);
            this.index.add(memory);
            this.stats.totalMemories++;
            this.stats.byType[memory.type] = (this.stats.byType[memory.type] || 0) + 1;
            if (memory.agentId) {
              this.stats.byAgent[memory.agentId] = (this.stats.byAgent[memory.agentId] || 0) + 1;
            }
          });
        }
      }

      console.log(`[MEMORY] Loaded ${this.stats.totalMemories} memories from storage`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('[MEMORY] Error loading memories:', error);
      }
    }
  }

  async saveMemories() {
    try {
      // Group memories by agent
      const byAgent = new Map();

      this.index.byId.forEach(memory => {
        const agentId = memory.agentId || 'global';
        if (!byAgent.has(agentId)) {
          byAgent.set(agentId, []);
        }
        byAgent.get(agentId).push(memory.toJSON());
      });

      // Save each agent's memories
      for (const [agentId, memories] of byAgent) {
        const filename = `${agentId.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        await fs.writeFile(
          path.join(this.config.storagePath, filename),
          JSON.stringify(memories, null, 2)
        );
      }

      this.dirty = false;
      this.emit('memory:saved', { count: this.stats.totalMemories });
      console.log(`[MEMORY] Saved ${this.stats.totalMemories} memories`);

    } catch (error) {
      console.error('[MEMORY] Error saving memories:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  getStats() {
    return {
      ...this.stats,
      memoryTypes: Object.keys(MEMORY_TYPES),
      workingMemoryAgents: this.workingMemory.size
    };
  }

  async shutdown() {
    clearInterval(this.autosaveTimer);
    clearInterval(this.consolidationTimer);
    await this.saveMemories();
    this.emit('shutdown');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  AgentMemorySystem,
  MemoryEntry,
  MemoryIndex,
  MEMORY_TYPES
};
