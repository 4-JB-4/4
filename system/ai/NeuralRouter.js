/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███╗   ██╗███████╗██╗   ██╗██████╗  █████╗ ██╗                          ║
 * ║   ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔══██╗██║                          ║
 * ║   ██╔██╗ ██║█████╗  ██║   ██║██████╔╝███████║██║                          ║
 * ║   ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██╔══██║██║                          ║
 * ║   ██║ ╚████║███████╗╚██████╔╝██║  ██║██║  ██║███████╗                     ║
 * ║   ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝                     ║
 * ║                                                                           ║
 * ║   ██████╗  ██████╗ ██╗   ██╗████████╗███████╗██████╗                      ║
 * ║   ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗                     ║
 * ║   ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ██████╔╝                     ║
 * ║   ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ██╔══██╗                     ║
 * ║   ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗██║  ██║                     ║
 * ║   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝                     ║
 * ║                                                                           ║
 * ║   INTELLIGENT AI MODEL ORCHESTRATION                                      ║
 * ║   Route tasks to the optimal model. Automatically.                        ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');

// ═══════════════════════════════════════════════════════════════════════════
// MODEL DEFINITIONS - The Neural Pathways
// ═══════════════════════════════════════════════════════════════════════════

const AI_MODELS = {
  // OpenAI Models
  GPT4_TURBO: {
    id: 'gpt-4-turbo-preview',
    provider: 'openai',
    name: 'GPT-4 Turbo',
    strengths: ['reasoning', 'coding', 'analysis', 'creative', 'math'],
    contextWindow: 128000,
    costPer1kTokens: { input: 0.01, output: 0.03 },
    speed: 'medium',
    quality: 10,
    icon: '🧠'
  },
  GPT4: {
    id: 'gpt-4',
    provider: 'openai',
    name: 'GPT-4',
    strengths: ['reasoning', 'coding', 'analysis'],
    contextWindow: 8192,
    costPer1kTokens: { input: 0.03, output: 0.06 },
    speed: 'slow',
    quality: 9,
    icon: '🎯'
  },
  GPT35_TURBO: {
    id: 'gpt-3.5-turbo',
    provider: 'openai',
    name: 'GPT-3.5 Turbo',
    strengths: ['chat', 'simple_tasks', 'quick_responses'],
    contextWindow: 16385,
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    speed: 'fast',
    quality: 7,
    icon: '⚡'
  },

  // Anthropic Models
  CLAUDE_3_OPUS: {
    id: 'claude-3-opus-20240229',
    provider: 'anthropic',
    name: 'Claude 3 Opus',
    strengths: ['reasoning', 'analysis', 'writing', 'coding', 'safety'],
    contextWindow: 200000,
    costPer1kTokens: { input: 0.015, output: 0.075 },
    speed: 'medium',
    quality: 10,
    icon: '👁️'
  },
  CLAUDE_3_SONNET: {
    id: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    name: 'Claude 3 Sonnet',
    strengths: ['balanced', 'coding', 'analysis', 'writing'],
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    speed: 'fast',
    quality: 8,
    icon: '🎭'
  },
  CLAUDE_3_HAIKU: {
    id: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    name: 'Claude 3 Haiku',
    strengths: ['speed', 'simple_tasks', 'chat'],
    contextWindow: 200000,
    costPer1kTokens: { input: 0.00025, output: 0.00125 },
    speed: 'fastest',
    quality: 6,
    icon: '🌸'
  },

  // Local/Open Models
  LLAMA_70B: {
    id: 'llama-2-70b',
    provider: 'local',
    name: 'Llama 2 70B',
    strengths: ['offline', 'privacy', 'coding'],
    contextWindow: 4096,
    costPer1kTokens: { input: 0, output: 0 },
    speed: 'variable',
    quality: 7,
    icon: '🦙'
  },
  MIXTRAL: {
    id: 'mixtral-8x7b',
    provider: 'local',
    name: 'Mixtral 8x7B',
    strengths: ['offline', 'coding', 'multilingual'],
    contextWindow: 32000,
    costPer1kTokens: { input: 0, output: 0 },
    speed: 'fast',
    quality: 7,
    icon: '🌀'
  },
  CODELLAMA: {
    id: 'codellama-34b',
    provider: 'local',
    name: 'Code Llama 34B',
    strengths: ['coding', 'offline', 'code_completion'],
    contextWindow: 16000,
    costPer1kTokens: { input: 0, output: 0 },
    speed: 'fast',
    quality: 8,
    icon: '💻'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TASK CLASSIFIERS - Understanding Intent
// ═══════════════════════════════════════════════════════════════════════════

const TASK_TYPES = {
  CODING: {
    keywords: ['code', 'function', 'bug', 'debug', 'implement', 'refactor', 'api', 'database', 'script'],
    preferredModels: ['GPT4_TURBO', 'CLAUDE_3_OPUS', 'CODELLAMA'],
    priority: 'quality'
  },
  CREATIVE: {
    keywords: ['write', 'story', 'creative', 'poem', 'script', 'content', 'blog', 'article'],
    preferredModels: ['CLAUDE_3_OPUS', 'GPT4_TURBO', 'CLAUDE_3_SONNET'],
    priority: 'quality'
  },
  ANALYSIS: {
    keywords: ['analyze', 'research', 'compare', 'evaluate', 'review', 'assess', 'study'],
    preferredModels: ['CLAUDE_3_OPUS', 'GPT4_TURBO', 'GPT4'],
    priority: 'quality'
  },
  CHAT: {
    keywords: ['chat', 'talk', 'hello', 'hi', 'hey', 'question', 'quick'],
    preferredModels: ['CLAUDE_3_HAIKU', 'GPT35_TURBO', 'CLAUDE_3_SONNET'],
    priority: 'speed'
  },
  MATH: {
    keywords: ['calculate', 'math', 'equation', 'formula', 'solve', 'compute'],
    preferredModels: ['GPT4_TURBO', 'CLAUDE_3_OPUS', 'GPT4'],
    priority: 'quality'
  },
  TRANSLATION: {
    keywords: ['translate', 'language', 'spanish', 'french', 'german', 'chinese', 'japanese'],
    preferredModels: ['GPT4_TURBO', 'MIXTRAL', 'CLAUDE_3_SONNET'],
    priority: 'balanced'
  },
  SUMMARIZATION: {
    keywords: ['summarize', 'summary', 'tldr', 'brief', 'condense', 'shorten'],
    preferredModels: ['CLAUDE_3_SONNET', 'GPT35_TURBO', 'CLAUDE_3_HAIKU'],
    priority: 'speed'
  },
  DATA_PROCESSING: {
    keywords: ['json', 'csv', 'data', 'parse', 'extract', 'transform', 'format'],
    preferredModels: ['GPT35_TURBO', 'CLAUDE_3_HAIKU', 'CLAUDE_3_SONNET'],
    priority: 'speed'
  },
  PRIVATE: {
    keywords: ['private', 'confidential', 'secret', 'local', 'offline', 'secure'],
    preferredModels: ['LLAMA_70B', 'MIXTRAL', 'CODELLAMA'],
    priority: 'privacy'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTING STRATEGIES
// ═══════════════════════════════════════════════════════════════════════════

const ROUTING_STRATEGIES = {
  QUALITY_FIRST: {
    name: 'Quality First',
    description: 'Always use the highest quality model',
    icon: '👑',
    selector: (models) => models.sort((a, b) => b.quality - a.quality)[0]
  },
  COST_OPTIMIZED: {
    name: 'Cost Optimized',
    description: 'Minimize cost while maintaining quality',
    icon: '💰',
    selector: (models) => {
      const scored = models.map(m => ({
        ...m,
        score: m.quality / ((m.costPer1kTokens.input + m.costPer1kTokens.output) || 0.001)
      }));
      return scored.sort((a, b) => b.score - a.score)[0];
    }
  },
  SPEED_FIRST: {
    name: 'Speed First',
    description: 'Fastest response time',
    icon: '🚀',
    selector: (models) => {
      const speedRank = { fastest: 4, fast: 3, medium: 2, slow: 1, variable: 2 };
      return models.sort((a, b) => speedRank[b.speed] - speedRank[a.speed])[0];
    }
  },
  PRIVACY_FIRST: {
    name: 'Privacy First',
    description: 'Local models only, no cloud',
    icon: '🔒',
    selector: (models) => {
      const localModels = models.filter(m => m.provider === 'local');
      return localModels.length > 0
        ? localModels.sort((a, b) => b.quality - a.quality)[0]
        : models[0];
    }
  },
  BALANCED: {
    name: 'Balanced',
    description: 'Optimal balance of quality, cost, and speed',
    icon: '⚖️',
    selector: (models) => {
      const speedRank = { fastest: 1, fast: 0.8, medium: 0.5, slow: 0.3, variable: 0.5 };
      const scored = models.map(m => ({
        ...m,
        score: (m.quality * 0.4) +
               (speedRank[m.speed] * 10 * 0.3) +
               ((1 / ((m.costPer1kTokens.input + m.costPer1kTokens.output) || 0.001)) * 0.3)
      }));
      return scored.sort((a, b) => b.score - a.score)[0];
    }
  },
  ROUND_ROBIN: {
    name: 'Round Robin',
    description: 'Distribute load across models',
    icon: '🔄',
    state: { index: 0 },
    selector: function(models) {
      const model = models[this.state.index % models.length];
      this.state.index++;
      return model;
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// NEURAL ROUTER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class NeuralRouter extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      defaultStrategy: 'BALANCED',
      enableFallback: true,
      maxRetries: 3,
      timeout: 30000,
      enableCache: true,
      cacheMaxAge: 3600000, // 1 hour
      enableMetrics: true,
      ...config
    };

    this.providers = new Map();
    this.cache = new Map();
    this.metrics = {
      totalRequests: 0,
      byModel: {},
      byProvider: {},
      errors: 0,
      cacheHits: 0,
      avgLatency: 0,
      totalCost: 0
    };

    this.routingHistory = [];
    this.modelHealth = new Map();

    // Initialize model health
    Object.keys(AI_MODELS).forEach(key => {
      this.modelHealth.set(key, {
        available: true,
        lastCheck: Date.now(),
        errorCount: 0,
        avgLatency: 0
      });
    });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           NEURAL ROUTER INITIALIZED                          ║
╠══════════════════════════════════════════════════════════════╣
║  Models Loaded: ${Object.keys(AI_MODELS).length.toString().padEnd(42)}║
║  Strategy: ${this.config.defaultStrategy.padEnd(47)}║
║  Cache: ${(this.config.enableCache ? 'ENABLED' : 'DISABLED').padEnd(50)}║
╚══════════════════════════════════════════════════════════════╝
    `);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Provider Registration
  // ─────────────────────────────────────────────────────────────────────────

  registerProvider(name, client) {
    this.providers.set(name, client);
    console.log(`[NEURAL] Provider registered: ${name}`);
    this.emit('provider:registered', { name });
    return this;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Task Classification
  // ─────────────────────────────────────────────────────────────────────────

  classifyTask(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const scores = {};

    for (const [taskType, config] of Object.entries(TASK_TYPES)) {
      scores[taskType] = config.keywords.reduce((score, keyword) => {
        return score + (lowerPrompt.includes(keyword) ? 1 : 0);
      }, 0);
    }

    // Find highest scoring task type
    const sortedTasks = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);

    const [topTask, topScore] = sortedTasks[0];

    return {
      type: topScore > 0 ? topTask : 'CHAT',
      confidence: topScore > 0 ? Math.min(topScore / 3, 1) : 0.5,
      allScores: scores
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Model Selection
  // ─────────────────────────────────────────────────────────────────────────

  selectModel(task, options = {}) {
    const strategy = options.strategy || this.config.defaultStrategy;
    const taskConfig = TASK_TYPES[task.type];

    // Get preferred models for this task
    let candidates = taskConfig.preferredModels
      .map(key => ({ key, ...AI_MODELS[key] }))
      .filter(model => {
        // Check if model is healthy
        const health = this.modelHealth.get(model.key);
        return health && health.available;
      });

    // If no candidates, fall back to all models
    if (candidates.length === 0) {
      candidates = Object.entries(AI_MODELS)
        .map(([key, model]) => ({ key, ...model }))
        .filter(model => {
          const health = this.modelHealth.get(model.key);
          return health && health.available;
        });
    }

    // Apply routing strategy
    const routingStrategy = ROUTING_STRATEGIES[strategy];
    const selected = routingStrategy.selector(candidates);

    this.emit('model:selected', {
      model: selected,
      task,
      strategy,
      candidates: candidates.length
    });

    return selected;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Main Routing Function
  // ─────────────────────────────────────────────────────────────────────────

  async route(prompt, options = {}) {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    // Check cache
    if (this.config.enableCache && !options.noCache) {
      const cacheKey = this.generateCacheKey(prompt, options);
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < this.config.cacheMaxAge)) {
        this.metrics.cacheHits++;
        this.emit('cache:hit', { prompt, cached });
        return { ...cached.response, fromCache: true };
      }
    }

    // Classify task
    const task = this.classifyTask(prompt);

    // Select model
    const model = options.forceModel
      ? { key: options.forceModel, ...AI_MODELS[options.forceModel] }
      : this.selectModel(task, options);

    // Record routing decision
    const routingDecision = {
      timestamp: Date.now(),
      prompt: prompt.substring(0, 100),
      task,
      model: model.key,
      strategy: options.strategy || this.config.defaultStrategy
    };
    this.routingHistory.push(routingDecision);
    if (this.routingHistory.length > 1000) this.routingHistory.shift();

    // Execute request with retries
    let lastError;
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response = await this.executeRequest(model, prompt, options);

        // Update metrics
        const latency = Date.now() - startTime;
        this.updateMetrics(model, latency, response.usage);

        // Cache response
        if (this.config.enableCache && !options.noCache) {
          const cacheKey = this.generateCacheKey(prompt, options);
          this.cache.set(cacheKey, {
            response,
            timestamp: Date.now()
          });
        }

        this.emit('route:success', {
          model: model.key,
          task,
          latency,
          attempt
        });

        return {
          ...response,
          _meta: {
            model: model.key,
            modelName: model.name,
            provider: model.provider,
            task: task.type,
            confidence: task.confidence,
            latency,
            strategy: options.strategy || this.config.defaultStrategy
          }
        };

      } catch (error) {
        lastError = error;
        this.metrics.errors++;

        // Update model health
        const health = this.modelHealth.get(model.key);
        if (health) {
          health.errorCount++;
          if (health.errorCount >= 3) {
            health.available = false;
            setTimeout(() => {
              health.available = true;
              health.errorCount = 0;
            }, 60000); // Re-enable after 1 minute
          }
        }

        this.emit('route:error', { model: model.key, error, attempt });

        // Try fallback model
        if (this.config.enableFallback && attempt < this.config.maxRetries - 1) {
          const fallbackModel = this.selectModel(task, {
            ...options,
            exclude: [model.key]
          });
          if (fallbackModel && fallbackModel.key !== model.key) {
            model = fallbackModel;
            continue;
          }
        }
      }
    }

    throw lastError;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Execute Request to Provider
  // ─────────────────────────────────────────────────────────────────────────

  async executeRequest(model, prompt, options = {}) {
    const provider = this.providers.get(model.provider);

    if (!provider) {
      // Simulate response for demo
      return this.simulateResponse(model, prompt);
    }

    const requestConfig = {
      model: model.id,
      messages: options.messages || [{ role: 'user', content: prompt }],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      ...options.providerOptions
    };

    // Provider-specific execution
    switch (model.provider) {
      case 'openai':
        return await this.executeOpenAI(provider, requestConfig);
      case 'anthropic':
        return await this.executeAnthropic(provider, requestConfig);
      case 'local':
        return await this.executeLocal(provider, requestConfig);
      default:
        throw new Error(`Unknown provider: ${model.provider}`);
    }
  }

  async executeOpenAI(client, config) {
    const response = await client.chat.completions.create(config);
    return {
      content: response.choices[0].message.content,
      usage: response.usage,
      finishReason: response.choices[0].finish_reason
    };
  }

  async executeAnthropic(client, config) {
    const response = await client.messages.create({
      model: config.model,
      max_tokens: config.max_tokens,
      messages: config.messages
    });
    return {
      content: response.content[0].text,
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens
      },
      finishReason: response.stop_reason
    };
  }

  async executeLocal(client, config) {
    // For local models (Ollama, vLLM, etc.)
    const response = await client.generate(config);
    return {
      content: response.text,
      usage: response.usage || { total_tokens: 0 },
      finishReason: 'stop'
    };
  }

  simulateResponse(model, prompt) {
    // Demo simulation
    return {
      content: `[${model.name}] Simulated response for: "${prompt.substring(0, 50)}..."`,
      usage: {
        prompt_tokens: Math.floor(prompt.length / 4),
        completion_tokens: 100,
        total_tokens: Math.floor(prompt.length / 4) + 100
      },
      finishReason: 'stop'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Utility Methods
  // ─────────────────────────────────────────────────────────────────────────

  generateCacheKey(prompt, options) {
    const data = JSON.stringify({ prompt, options });
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `cache_${hash}`;
  }

  updateMetrics(model, latency, usage) {
    // Update model metrics
    this.metrics.byModel[model.key] = this.metrics.byModel[model.key] || {
      requests: 0,
      totalLatency: 0,
      totalTokens: 0,
      totalCost: 0
    };

    const modelMetrics = this.metrics.byModel[model.key];
    modelMetrics.requests++;
    modelMetrics.totalLatency += latency;
    modelMetrics.totalTokens += usage?.total_tokens || 0;

    // Calculate cost
    if (usage) {
      const inputCost = (usage.prompt_tokens / 1000) * model.costPer1kTokens.input;
      const outputCost = (usage.completion_tokens / 1000) * model.costPer1kTokens.output;
      modelMetrics.totalCost += inputCost + outputCost;
      this.metrics.totalCost += inputCost + outputCost;
    }

    // Update provider metrics
    this.metrics.byProvider[model.provider] = this.metrics.byProvider[model.provider] || {
      requests: 0
    };
    this.metrics.byProvider[model.provider].requests++;

    // Update average latency
    this.metrics.avgLatency = (
      (this.metrics.avgLatency * (this.metrics.totalRequests - 1)) + latency
    ) / this.metrics.totalRequests;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      healthyModels: Array.from(this.modelHealth.entries())
        .filter(([, h]) => h.available).length,
      totalModels: this.modelHealth.size
    };
  }

  getModelHealth() {
    return Object.fromEntries(this.modelHealth);
  }

  getRoutingHistory(limit = 100) {
    return this.routingHistory.slice(-limit);
  }

  setStrategy(strategy) {
    if (ROUTING_STRATEGIES[strategy]) {
      this.config.defaultStrategy = strategy;
      this.emit('strategy:changed', { strategy });
      return true;
    }
    return false;
  }

  clearCache() {
    this.cache.clear();
    this.emit('cache:cleared');
  }

  getAvailableStrategies() {
    return Object.entries(ROUTING_STRATEGIES).map(([key, strategy]) => ({
      key,
      name: strategy.name,
      description: strategy.description,
      icon: strategy.icon
    }));
  }

  getAvailableModels() {
    return Object.entries(AI_MODELS).map(([key, model]) => ({
      key,
      ...model,
      health: this.modelHealth.get(key)
    }));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  NeuralRouter,
  AI_MODELS,
  TASK_TYPES,
  ROUTING_STRATEGIES
};
