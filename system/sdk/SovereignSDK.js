/**
 * SOVEREIGN SDK
 * ═══════════════════════════════════════════════════════════════════
 * Developer Tools for Reality Extension
 *
 * "Give builders the power to build universes."
 *
 * The SDK that lets developers extend every aspect of the 0RB System.
 * Custom agents, games, integrations, and entirely new capabilities.
 * ═══════════════════════════════════════════════════════════════════
 */

const SDK_VERSION = '1.0.0';

/**
 * Extension Types
 */
const EXTENSION_TYPES = {
  AGENT: {
    name: 'Custom Agent',
    description: 'Create new agent archetypes with unique capabilities',
    requires: ['personality', 'capabilities', 'triggers']
  },
  GAME: {
    name: 'Game Engine',
    description: 'Build new reality games for the platform',
    requires: ['mechanics', 'interface', 'outputs']
  },
  CONNECTOR: {
    name: 'Integration Connector',
    description: 'Connect new external services',
    requires: ['protocol', 'endpoints', 'auth']
  },
  COPA: {
    name: 'Industry Copilot',
    description: 'Create industry-specific AI assistants',
    requires: ['industry', 'workflows', 'tools']
  },
  PLUGIN: {
    name: 'System Plugin',
    description: 'Extend core system functionality',
    requires: ['hooks', 'handlers']
  },
  THEME: {
    name: 'Visual Theme',
    description: 'Custom UI themes and experiences',
    requires: ['colors', 'typography', 'components']
  }
};

/**
 * SDK Events
 */
const SDK_EVENTS = {
  // Lifecycle
  INIT: 'sdk:init',
  READY: 'sdk:ready',
  SHUTDOWN: 'sdk:shutdown',

  // Extension
  EXTENSION_LOAD: 'extension:load',
  EXTENSION_UNLOAD: 'extension:unload',
  EXTENSION_ERROR: 'extension:error',

  // Agent
  AGENT_SPAWN: 'agent:spawn',
  AGENT_TASK: 'agent:task',
  AGENT_COMPLETE: 'agent:complete',

  // Game
  GAME_START: 'game:start',
  GAME_ACTION: 'game:action',
  GAME_END: 'game:end',

  // System
  SYSTEM_MESSAGE: 'system:message',
  SYSTEM_ERROR: 'system:error'
};

/**
 * Event Emitter for SDK
 */
class EventEmitter {
  constructor() {
    this.listeners = new Map();
    this.onceListeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, []);
    }
    this.onceListeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.listeners.get(event) || [];
    const onceListeners = this.onceListeners.get(event) || [];

    listeners.forEach(callback => callback(data));
    onceListeners.forEach(callback => callback(data));

    this.onceListeners.delete(event);

    return listeners.length + onceListeners.length;
  }
}

/**
 * Extension Base Class
 */
class Extension {
  constructor(config) {
    this.id = config.id || `ext_${Date.now()}`;
    this.name = config.name;
    this.version = config.version || '1.0.0';
    this.type = config.type;
    this.author = config.author;
    this.description = config.description;
    this.permissions = config.permissions || [];
    this.dependencies = config.dependencies || [];
    this.status = 'inactive';
    this.metadata = config.metadata || {};
    this.events = new EventEmitter();
  }

  async initialize(sdk) {
    this.sdk = sdk;
    this.status = 'initializing';
    await this.onInit();
    this.status = 'active';
    return this;
  }

  async shutdown() {
    this.status = 'shutting_down';
    await this.onShutdown();
    this.status = 'inactive';
  }

  // Override in subclasses
  async onInit() {}
  async onShutdown() {}

  // Logging
  log(message, level = 'info') {
    this.sdk?.log(`[${this.name}] ${message}`, level);
  }

  // API access
  getAPI() {
    return this.sdk?.getPublicAPI();
  }
}

/**
 * Agent Extension - Create custom agents
 */
class AgentExtension extends Extension {
  constructor(config) {
    super({ ...config, type: EXTENSION_TYPES.AGENT.name });
    this.personality = config.personality || {};
    this.capabilities = config.capabilities || [];
    this.triggers = config.triggers || [];
    this.memory = {};
    this.taskHistory = [];
  }

  definePersonality(personality) {
    this.personality = {
      name: personality.name,
      archetype: personality.archetype,
      traits: personality.traits || [],
      communication: personality.communication || 'professional',
      expertise: personality.expertise || [],
      voice: personality.voice || 'neutral'
    };
    return this;
  }

  addCapability(capability) {
    this.capabilities.push({
      name: capability.name,
      description: capability.description,
      handler: capability.handler,
      inputs: capability.inputs || [],
      outputs: capability.outputs || []
    });
    return this;
  }

  addTrigger(trigger) {
    this.triggers.push({
      event: trigger.event,
      condition: trigger.condition,
      action: trigger.action
    });
    return this;
  }

  async executeTask(task) {
    const startTime = Date.now();
    const capability = this.capabilities.find(c => c.name === task.type);

    if (!capability) {
      throw new Error(`Unknown capability: ${task.type}`);
    }

    try {
      const result = await capability.handler(task.input, this);
      const execution = {
        taskId: task.id,
        type: task.type,
        input: task.input,
        output: result,
        duration: Date.now() - startTime,
        success: true
      };
      this.taskHistory.push(execution);
      return result;
    } catch (error) {
      const execution = {
        taskId: task.id,
        type: task.type,
        input: task.input,
        error: error.message,
        duration: Date.now() - startTime,
        success: false
      };
      this.taskHistory.push(execution);
      throw error;
    }
  }

  remember(key, value) {
    this.memory[key] = {
      value,
      timestamp: Date.now()
    };
  }

  recall(key) {
    return this.memory[key]?.value;
  }

  getManifest() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      personality: this.personality,
      capabilities: this.capabilities.map(c => ({
        name: c.name,
        description: c.description,
        inputs: c.inputs,
        outputs: c.outputs
      })),
      triggers: this.triggers.map(t => ({ event: t.event }))
    };
  }
}

/**
 * Game Extension - Create custom games
 */
class GameExtension extends Extension {
  constructor(config) {
    super({ ...config, type: EXTENSION_TYPES.GAME.name });
    this.mechanics = config.mechanics || [];
    this.states = new Map();
    this.currentState = 'idle';
    this.players = new Map();
    this.actions = new Map();
    this.outputs = config.outputs || [];
  }

  defineMechanic(mechanic) {
    this.mechanics.push({
      name: mechanic.name,
      description: mechanic.description,
      rules: mechanic.rules,
      effects: mechanic.effects
    });
    return this;
  }

  defineState(name, config) {
    this.states.set(name, {
      name,
      transitions: config.transitions || [],
      onEnter: config.onEnter,
      onExit: config.onExit,
      actions: config.actions || []
    });
    return this;
  }

  registerAction(name, handler) {
    this.actions.set(name, handler);
    return this;
  }

  async transition(toState, context = {}) {
    const currentConfig = this.states.get(this.currentState);
    const targetConfig = this.states.get(toState);

    if (!targetConfig) {
      throw new Error(`Unknown state: ${toState}`);
    }

    // Check if transition is allowed
    if (currentConfig && !currentConfig.transitions.includes(toState)) {
      throw new Error(`Cannot transition from ${this.currentState} to ${toState}`);
    }

    // Exit current state
    if (currentConfig?.onExit) {
      await currentConfig.onExit(context);
    }

    // Enter new state
    this.currentState = toState;
    if (targetConfig.onEnter) {
      await targetConfig.onEnter(context);
    }

    this.events.emit('state_change', { from: currentConfig?.name, to: toState, context });
    return this;
  }

  async performAction(actionName, input, playerId) {
    const handler = this.actions.get(actionName);
    if (!handler) {
      throw new Error(`Unknown action: ${actionName}`);
    }

    const player = this.players.get(playerId);
    const result = await handler(input, { player, game: this });

    this.events.emit('action', { action: actionName, input, result, playerId });
    return result;
  }

  addPlayer(playerId, data = {}) {
    this.players.set(playerId, {
      id: playerId,
      ...data,
      joinedAt: Date.now(),
      score: 0
    });
    return this;
  }

  generateOutput(type, context) {
    const outputDef = this.outputs.find(o => o.type === type);
    if (!outputDef) return null;

    return outputDef.generator(context, this);
  }

  getGameState() {
    return {
      id: this.id,
      name: this.name,
      currentState: this.currentState,
      players: Array.from(this.players.values()),
      mechanics: this.mechanics.map(m => m.name),
      availableActions: Array.from(this.actions.keys())
    };
  }
}

/**
 * Connector Extension - Create integrations
 */
class ConnectorExtension extends Extension {
  constructor(config) {
    super({ ...config, type: EXTENSION_TYPES.CONNECTOR.name });
    this.protocol = config.protocol || 'REST';
    this.baseUrl = config.baseUrl;
    this.endpoints = new Map();
    this.auth = config.auth || {};
    this.rateLimit = config.rateLimit || { requests: 100, window: 60000 };
    this.requestCount = 0;
    this.lastReset = Date.now();
  }

  defineEndpoint(name, config) {
    this.endpoints.set(name, {
      name,
      path: config.path,
      method: config.method || 'GET',
      params: config.params || [],
      transform: config.transform,
      cache: config.cache || false,
      cacheTTL: config.cacheTTL || 60000
    });
    return this;
  }

  setAuth(auth) {
    this.auth = auth;
    return this;
  }

  async call(endpointName, params = {}) {
    const endpoint = this.endpoints.get(endpointName);
    if (!endpoint) {
      throw new Error(`Unknown endpoint: ${endpointName}`);
    }

    // Rate limiting
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    // Build request
    const url = this.buildUrl(endpoint.path, params);
    const headers = this.buildHeaders();

    // Simulated request
    const response = await this.executeRequest({
      url,
      method: endpoint.method,
      headers,
      body: endpoint.method !== 'GET' ? params.body : undefined
    });

    // Transform if needed
    if (endpoint.transform) {
      return endpoint.transform(response);
    }

    return response;
  }

  checkRateLimit() {
    const now = Date.now();
    if (now - this.lastReset > this.rateLimit.window) {
      this.requestCount = 0;
      this.lastReset = now;
    }
    this.requestCount++;
    return this.requestCount <= this.rateLimit.requests;
  }

  buildUrl(path, params) {
    let url = `${this.baseUrl}${path}`;
    Object.entries(params.path || {}).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
    if (params.query) {
      const queryString = new URLSearchParams(params.query).toString();
      url += `?${queryString}`;
    }
    return url;
  }

  buildHeaders() {
    const headers = { 'Content-Type': 'application/json' };

    if (this.auth.type === 'bearer') {
      headers['Authorization'] = `Bearer ${this.auth.token}`;
    } else if (this.auth.type === 'apiKey') {
      headers[this.auth.headerName || 'X-API-Key'] = this.auth.key;
    }

    return headers;
  }

  async executeRequest(config) {
    // Placeholder - actual implementation would use fetch
    return { success: true, data: {}, config };
  }

  getEndpoints() {
    return Array.from(this.endpoints.values()).map(e => ({
      name: e.name,
      path: e.path,
      method: e.method
    }));
  }
}

/**
 * Plugin Extension - Extend core system
 */
class PluginExtension extends Extension {
  constructor(config) {
    super({ ...config, type: EXTENSION_TYPES.PLUGIN.name });
    this.hooks = new Map();
    this.commands = new Map();
    this.middleware = [];
  }

  registerHook(hookName, handler) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(handler);
    return this;
  }

  registerCommand(name, handler) {
    this.commands.set(name, {
      name,
      handler,
      registeredAt: Date.now()
    });
    return this;
  }

  use(middlewareFn) {
    this.middleware.push(middlewareFn);
    return this;
  }

  async executeHook(hookName, context) {
    const handlers = this.hooks.get(hookName) || [];
    let result = context;

    for (const handler of handlers) {
      result = await handler(result);
    }

    return result;
  }

  async executeCommand(name, args) {
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Unknown command: ${name}`);
    }
    return command.handler(args);
  }

  async applyMiddleware(context) {
    let result = context;
    for (const mw of this.middleware) {
      result = await mw(result);
    }
    return result;
  }
}

/**
 * Extension Registry
 */
class ExtensionRegistry {
  constructor() {
    this.extensions = new Map();
    this.byType = new Map();
    this.loadOrder = [];
  }

  register(extension) {
    this.extensions.set(extension.id, extension);

    const type = extension.type;
    if (!this.byType.has(type)) {
      this.byType.set(type, []);
    }
    this.byType.get(type).push(extension.id);

    this.loadOrder.push(extension.id);
    return extension;
  }

  get(id) {
    return this.extensions.get(id);
  }

  getByType(type) {
    const ids = this.byType.get(type) || [];
    return ids.map(id => this.extensions.get(id));
  }

  unregister(id) {
    const extension = this.extensions.get(id);
    if (extension) {
      this.extensions.delete(id);
      const typeList = this.byType.get(extension.type);
      if (typeList) {
        const index = typeList.indexOf(id);
        if (index > -1) {
          typeList.splice(index, 1);
        }
      }
      this.loadOrder = this.loadOrder.filter(eid => eid !== id);
    }
    return extension;
  }

  list() {
    return Array.from(this.extensions.values()).map(ext => ({
      id: ext.id,
      name: ext.name,
      type: ext.type,
      version: ext.version,
      status: ext.status
    }));
  }
}

/**
 * Developer Console
 */
class DevConsole {
  constructor(sdk) {
    this.sdk = sdk;
    this.logs = [];
    this.maxLogs = 1000;
    this.filters = {
      level: ['debug', 'info', 'warn', 'error'],
      source: []
    };
  }

  log(message, level = 'info', source = 'sdk') {
    const entry = {
      timestamp: Date.now(),
      level,
      source,
      message
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Output to console in development
    if (process.env.NODE_ENV === 'development') {
      const levelColors = {
        debug: '\x1b[36m',
        info: '\x1b[32m',
        warn: '\x1b[33m',
        error: '\x1b[31m'
      };
      console.log(
        `${levelColors[level] || ''}[${level.toUpperCase()}]\x1b[0m [${source}] ${message}`
      );
    }

    return entry;
  }

  debug(message, source) { return this.log(message, 'debug', source); }
  info(message, source) { return this.log(message, 'info', source); }
  warn(message, source) { return this.log(message, 'warn', source); }
  error(message, source) { return this.log(message, 'error', source); }

  getLogs(options = {}) {
    let filtered = this.logs;

    if (options.level) {
      filtered = filtered.filter(l => l.level === options.level);
    }
    if (options.source) {
      filtered = filtered.filter(l => l.source === options.source);
    }
    if (options.since) {
      filtered = filtered.filter(l => l.timestamp >= options.since);
    }
    if (options.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  clear() {
    this.logs = [];
  }
}

/**
 * Sovereign SDK - Main Interface
 */
class SovereignSDK {
  constructor(config = {}) {
    this.version = SDK_VERSION;
    this.config = config;
    this.registry = new ExtensionRegistry();
    this.events = new EventEmitter();
    this.console = new DevConsole(this);
    this.initialized = false;
    this.publicAPI = {};
  }

  async initialize() {
    if (this.initialized) return this;

    this.console.info('Initializing Sovereign SDK...');
    this.events.emit(SDK_EVENTS.INIT);

    // Initialize all registered extensions
    for (const ext of this.registry.extensions.values()) {
      await ext.initialize(this);
    }

    this.initialized = true;
    this.events.emit(SDK_EVENTS.READY);
    this.console.info('Sovereign SDK ready');

    return this;
  }

  async shutdown() {
    this.console.info('Shutting down Sovereign SDK...');
    this.events.emit(SDK_EVENTS.SHUTDOWN);

    // Shutdown extensions in reverse order
    const extensions = [...this.registry.extensions.values()].reverse();
    for (const ext of extensions) {
      await ext.shutdown();
    }

    this.initialized = false;
  }

  // Extension Creation Shortcuts
  createAgent(config) {
    const agent = new AgentExtension(config);
    this.registry.register(agent);
    if (this.initialized) agent.initialize(this);
    return agent;
  }

  createGame(config) {
    const game = new GameExtension(config);
    this.registry.register(game);
    if (this.initialized) game.initialize(this);
    return game;
  }

  createConnector(config) {
    const connector = new ConnectorExtension(config);
    this.registry.register(connector);
    if (this.initialized) connector.initialize(this);
    return connector;
  }

  createPlugin(config) {
    const plugin = new PluginExtension(config);
    this.registry.register(plugin);
    if (this.initialized) plugin.initialize(this);
    return plugin;
  }

  // Event handling
  on(event, callback) {
    return this.events.on(event, callback);
  }

  emit(event, data) {
    return this.events.emit(event, data);
  }

  // Logging
  log(message, level = 'info') {
    return this.console.log(message, level, 'sdk');
  }

  // Public API for extensions
  exposeAPI(name, handler) {
    this.publicAPI[name] = handler;
  }

  getPublicAPI() {
    return { ...this.publicAPI };
  }

  // Get status
  getStatus() {
    return {
      version: this.version,
      initialized: this.initialized,
      extensions: this.registry.list(),
      events: Object.keys(SDK_EVENTS),
      extensionTypes: Object.keys(EXTENSION_TYPES)
    };
  }

  // Static accessors
  static get EVENTS() { return SDK_EVENTS; }
  static get EXTENSION_TYPES() { return EXTENSION_TYPES; }
  static get VERSION() { return SDK_VERSION; }
}

// Export everything
module.exports = {
  SovereignSDK,
  Extension,
  AgentExtension,
  GameExtension,
  ConnectorExtension,
  PluginExtension,
  ExtensionRegistry,
  EventEmitter,
  DevConsole,
  EXTENSION_TYPES,
  SDK_EVENTS
};
