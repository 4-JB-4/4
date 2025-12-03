/**
 * NEXUS PROTOCOL
 * ═══════════════════════════════════════════════════════════════════
 * Universal Integration Hub - The Connective Tissue of Reality
 *
 * "Every system speaks. Nexus listens and translates."
 *
 * Nexus is the universal adapter layer that connects any external
 * system to the 0RB ecosystem. APIs, databases, blockchains,
 * IoT devices, legacy systems - Nexus bridges them all.
 * ═══════════════════════════════════════════════════════════════════
 */

const NEXUS_VERSION = '1.0.0';

/**
 * Protocol Types - How systems communicate
 */
const PROTOCOLS = {
  REST: {
    name: 'REST API',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    contentTypes: ['application/json', 'application/xml', 'text/plain']
  },
  GRAPHQL: {
    name: 'GraphQL',
    operations: ['query', 'mutation', 'subscription'],
    contentType: 'application/json'
  },
  WEBSOCKET: {
    name: 'WebSocket',
    events: ['connect', 'message', 'disconnect', 'error'],
    bidirectional: true
  },
  GRPC: {
    name: 'gRPC',
    streaming: ['unary', 'server', 'client', 'bidirectional'],
    protocol: 'HTTP/2'
  },
  WEBHOOK: {
    name: 'Webhook',
    direction: 'inbound',
    verification: ['signature', 'token', 'ip']
  },
  MESSAGE_QUEUE: {
    name: 'Message Queue',
    patterns: ['pub-sub', 'point-to-point', 'request-reply'],
    brokers: ['rabbitmq', 'kafka', 'redis', 'sqs']
  },
  BLOCKCHAIN: {
    name: 'Blockchain',
    operations: ['read', 'write', 'listen'],
    networks: ['ethereum', 'solana', 'polygon', 'base']
  },
  DATABASE: {
    name: 'Database',
    types: ['sql', 'nosql', 'graph', 'timeseries'],
    operations: ['query', 'insert', 'update', 'delete']
  }
};

/**
 * Connector Categories
 */
const CONNECTOR_CATEGORIES = {
  PAYMENTS: ['stripe', 'paypal', 'square', 'plaid', 'wise'],
  CRM: ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'close'],
  COMMUNICATION: ['twilio', 'sendgrid', 'mailchimp', 'slack', 'discord'],
  STORAGE: ['aws-s3', 'gcs', 'azure-blob', 'dropbox', 'box'],
  ANALYTICS: ['mixpanel', 'amplitude', 'segment', 'google-analytics', 'posthog'],
  AI_ML: ['openai', 'anthropic', 'replicate', 'huggingface', 'cohere'],
  SOCIAL: ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'],
  PRODUCTIVITY: ['notion', 'airtable', 'asana', 'monday', 'linear'],
  ECOMMERCE: ['shopify', 'woocommerce', 'magento', 'bigcommerce', 'amazon'],
  BLOCKCHAIN: ['alchemy', 'infura', 'moralis', 'thegraph', 'chainlink']
};

/**
 * Data Transform Pipeline Stage
 */
class TransformStage {
  constructor(config) {
    this.name = config.name;
    this.type = config.type; // 'map', 'filter', 'reduce', 'validate', 'enrich'
    this.transform = config.transform;
    this.condition = config.condition;
    this.errorHandler = config.errorHandler || ((err) => { throw err; });
  }

  async execute(data) {
    try {
      if (this.condition && !this.condition(data)) {
        return data; // Skip if condition not met
      }
      return await this.transform(data);
    } catch (error) {
      return this.errorHandler(error, data);
    }
  }
}

/**
 * Data Pipeline - Chainable transforms
 */
class DataPipeline {
  constructor(name) {
    this.name = name;
    this.stages = [];
    this.metadata = {
      created: Date.now(),
      executions: 0,
      avgDuration: 0
    };
  }

  addStage(stage) {
    this.stages.push(stage instanceof TransformStage ? stage : new TransformStage(stage));
    return this;
  }

  map(name, transform) {
    return this.addStage({ name, type: 'map', transform });
  }

  filter(name, condition) {
    return this.addStage({
      name,
      type: 'filter',
      transform: (data) => Array.isArray(data) ? data.filter(condition) : (condition(data) ? data : null)
    });
  }

  validate(name, schema) {
    return this.addStage({
      name,
      type: 'validate',
      transform: (data) => {
        const errors = this.validateAgainstSchema(data, schema);
        if (errors.length > 0) {
          throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
        return data;
      }
    });
  }

  validateAgainstSchema(data, schema) {
    const errors = [];
    Object.entries(schema).forEach(([key, rules]) => {
      if (rules.required && (data[key] === undefined || data[key] === null)) {
        errors.push(`${key} is required`);
      }
      if (rules.type && data[key] !== undefined && typeof data[key] !== rules.type) {
        errors.push(`${key} must be type ${rules.type}`);
      }
      if (rules.min !== undefined && data[key] < rules.min) {
        errors.push(`${key} must be >= ${rules.min}`);
      }
      if (rules.max !== undefined && data[key] > rules.max) {
        errors.push(`${key} must be <= ${rules.max}`);
      }
    });
    return errors;
  }

  enrich(name, enricher) {
    return this.addStage({
      name,
      type: 'enrich',
      transform: async (data) => {
        const enrichment = await enricher(data);
        return { ...data, ...enrichment };
      }
    });
  }

  async execute(input) {
    const startTime = Date.now();
    let data = input;

    for (const stage of this.stages) {
      data = await stage.execute(data);
      if (data === null) break;
    }

    const duration = Date.now() - startTime;
    this.metadata.executions++;
    this.metadata.avgDuration =
      (this.metadata.avgDuration * (this.metadata.executions - 1) + duration) / this.metadata.executions;

    return data;
  }
}

/**
 * Connector - Base class for all integrations
 */
class Connector {
  constructor(config) {
    this.id = config.id || `conn_${Date.now()}`;
    this.name = config.name;
    this.type = config.type;
    this.protocol = config.protocol;
    this.credentials = config.credentials || {};
    this.baseUrl = config.baseUrl;
    this.headers = config.headers || {};
    this.rateLimits = config.rateLimits || { requests: 100, window: 60000 };
    this.retryPolicy = config.retryPolicy || { maxRetries: 3, backoff: 'exponential' };
    this.status = 'disconnected';
    this.metrics = {
      requests: 0,
      successes: 0,
      failures: 0,
      avgLatency: 0
    };
    this.requestQueue = [];
    this.lastRequest = 0;
  }

  async connect() {
    this.status = 'connecting';
    // Validate credentials and test connection
    try {
      await this.healthCheck();
      this.status = 'connected';
      return { success: true, status: this.status };
    } catch (error) {
      this.status = 'error';
      return { success: false, error: error.message };
    }
  }

  async healthCheck() {
    // Override in subclasses
    return { healthy: true };
  }

  async request(config) {
    const startTime = Date.now();

    // Rate limiting
    await this.enforceRateLimit();

    this.metrics.requests++;

    try {
      const response = await this.executeRequest(config);
      this.metrics.successes++;
      this.metrics.avgLatency = this.updateAvgLatency(startTime);
      return response;
    } catch (error) {
      this.metrics.failures++;

      if (this.shouldRetry(error)) {
        return this.retryRequest(config, 1);
      }

      throw error;
    }
  }

  async executeRequest(config) {
    // Override in subclasses
    throw new Error('executeRequest must be implemented');
  }

  async enforceRateLimit() {
    const now = Date.now();
    const windowStart = now - this.rateLimits.window;

    // Simple rate limiting
    if (this.lastRequest > windowStart) {
      const waitTime = Math.max(0, this.rateLimits.window / this.rateLimits.requests);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequest = Date.now();
  }

  shouldRetry(error) {
    const retryableCodes = [429, 500, 502, 503, 504];
    return error.status && retryableCodes.includes(error.status);
  }

  async retryRequest(config, attempt) {
    if (attempt > this.retryPolicy.maxRetries) {
      throw new Error(`Max retries (${this.retryPolicy.maxRetries}) exceeded`);
    }

    const delay = this.retryPolicy.backoff === 'exponential'
      ? Math.pow(2, attempt) * 1000
      : attempt * 1000;

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      return await this.executeRequest(config);
    } catch (error) {
      return this.retryRequest(config, attempt + 1);
    }
  }

  updateAvgLatency(startTime) {
    const latency = Date.now() - startTime;
    return (this.metrics.avgLatency * (this.metrics.requests - 1) + latency) / this.metrics.requests;
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.requests > 0
        ? (this.metrics.successes / this.metrics.requests) * 100
        : 0,
      status: this.status
    };
  }
}

/**
 * REST Connector
 */
class RESTConnector extends Connector {
  constructor(config) {
    super({ ...config, protocol: PROTOCOLS.REST });
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    };
  }

  async healthCheck() {
    if (this.healthEndpoint) {
      const response = await this.get(this.healthEndpoint);
      return { healthy: response.status === 200 };
    }
    return { healthy: true };
  }

  async executeRequest(config) {
    const { method = 'GET', path, body, headers = {}, params = {} } = config;

    const url = new URL(path, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
      ...this.getAuthHeaders()
    };

    const options = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    };

    // Simulated response for now
    return {
      status: 200,
      data: { success: true, path, method },
      headers: {}
    };
  }

  getAuthHeaders() {
    if (this.credentials.apiKey) {
      return { 'Authorization': `Bearer ${this.credentials.apiKey}` };
    }
    if (this.credentials.basicAuth) {
      const encoded = Buffer.from(
        `${this.credentials.basicAuth.username}:${this.credentials.basicAuth.password}`
      ).toString('base64');
      return { 'Authorization': `Basic ${encoded}` };
    }
    return {};
  }

  async get(path, params = {}) {
    return this.request({ method: 'GET', path, params });
  }

  async post(path, body, params = {}) {
    return this.request({ method: 'POST', path, body, params });
  }

  async put(path, body, params = {}) {
    return this.request({ method: 'PUT', path, body, params });
  }

  async delete(path, params = {}) {
    return this.request({ method: 'DELETE', path, params });
  }
}

/**
 * WebSocket Connector
 */
class WebSocketConnector extends Connector {
  constructor(config) {
    super({ ...config, protocol: PROTOCOLS.WEBSOCKET });
    this.handlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.messageQueue = [];
  }

  async connect() {
    this.status = 'connecting';
    // WebSocket connection logic would go here
    this.status = 'connected';
    this.reconnectAttempts = 0;
    return { success: true };
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
    return this;
  }

  emit(event, data) {
    if (this.status !== 'connected') {
      this.messageQueue.push({ event, data });
      return false;
    }
    // Send via WebSocket
    return true;
  }

  handleMessage(event, data) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.status = 'failed';
      throw new Error('Max reconnection attempts reached');
    }

    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return this.connect();
  }
}

/**
 * Event Router - Route events between connectors
 */
class EventRouter {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
    this.errorHandlers = [];
  }

  route(source, event, destinations) {
    const key = `${source}:${event}`;
    this.routes.set(key, Array.isArray(destinations) ? destinations : [destinations]);
    return this;
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  onError(handler) {
    this.errorHandlers.push(handler);
    return this;
  }

  async dispatch(source, event, data) {
    const key = `${source}:${event}`;
    const destinations = this.routes.get(key) || [];

    // Apply middleware
    let processedData = data;
    for (const mw of this.middleware) {
      processedData = await mw(processedData, { source, event });
    }

    // Dispatch to all destinations
    const results = await Promise.allSettled(
      destinations.map(dest => dest.receive(event, processedData))
    );

    // Handle errors
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        this.errorHandlers.forEach(handler =>
          handler(result.reason, { source, event, destination: destinations[i] })
        );
      }
    });

    return results;
  }
}

/**
 * Schema Registry - Manage data schemas across integrations
 */
class SchemaRegistry {
  constructor() {
    this.schemas = new Map();
    this.mappings = new Map();
  }

  register(name, schema) {
    this.schemas.set(name, {
      schema,
      version: 1,
      created: Date.now(),
      updated: Date.now()
    });
    return this;
  }

  get(name) {
    return this.schemas.get(name);
  }

  createMapping(from, to, mapping) {
    const key = `${from}:${to}`;
    this.mappings.set(key, mapping);
    return this;
  }

  transform(data, from, to) {
    const key = `${from}:${to}`;
    const mapping = this.mappings.get(key);

    if (!mapping) {
      throw new Error(`No mapping found from ${from} to ${to}`);
    }

    const result = {};
    Object.entries(mapping).forEach(([targetKey, sourceSpec]) => {
      if (typeof sourceSpec === 'string') {
        result[targetKey] = this.getNestedValue(data, sourceSpec);
      } else if (typeof sourceSpec === 'function') {
        result[targetKey] = sourceSpec(data);
      } else if (sourceSpec.source) {
        let value = this.getNestedValue(data, sourceSpec.source);
        if (sourceSpec.transform) {
          value = sourceSpec.transform(value);
        }
        result[targetKey] = value;
      }
    });

    return result;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }
}

/**
 * Integration Templates - Pre-built connector configs
 */
const INTEGRATION_TEMPLATES = {
  STRIPE: {
    name: 'Stripe',
    type: 'payments',
    baseUrl: 'https://api.stripe.com/v1',
    protocol: 'REST',
    endpoints: {
      customers: '/customers',
      charges: '/charges',
      subscriptions: '/subscriptions',
      invoices: '/invoices',
      paymentIntents: '/payment_intents'
    },
    webhookEvents: [
      'payment_intent.succeeded',
      'customer.subscription.created',
      'invoice.paid',
      'charge.refunded'
    ]
  },
  HUBSPOT: {
    name: 'HubSpot',
    type: 'crm',
    baseUrl: 'https://api.hubapi.com',
    protocol: 'REST',
    endpoints: {
      contacts: '/crm/v3/objects/contacts',
      companies: '/crm/v3/objects/companies',
      deals: '/crm/v3/objects/deals',
      tickets: '/crm/v3/objects/tickets'
    }
  },
  SLACK: {
    name: 'Slack',
    type: 'communication',
    baseUrl: 'https://slack.com/api',
    protocol: 'REST',
    endpoints: {
      postMessage: '/chat.postMessage',
      channels: '/conversations.list',
      users: '/users.list'
    },
    websocket: 'wss://wss-primary.slack.com/websocket'
  },
  OPENAI: {
    name: 'OpenAI',
    type: 'ai',
    baseUrl: 'https://api.openai.com/v1',
    protocol: 'REST',
    endpoints: {
      completions: '/chat/completions',
      embeddings: '/embeddings',
      images: '/images/generations',
      audio: '/audio/transcriptions'
    }
  },
  SHOPIFY: {
    name: 'Shopify',
    type: 'ecommerce',
    protocol: 'REST',
    endpoints: {
      products: '/admin/api/2024-01/products.json',
      orders: '/admin/api/2024-01/orders.json',
      customers: '/admin/api/2024-01/customers.json',
      inventory: '/admin/api/2024-01/inventory_levels.json'
    },
    webhookEvents: [
      'orders/create',
      'products/update',
      'customers/create',
      'inventory_levels/update'
    ]
  }
};

/**
 * Nexus Protocol - Main Interface
 */
class NexusProtocol {
  constructor() {
    this.version = NEXUS_VERSION;
    this.connectors = new Map();
    this.pipelines = new Map();
    this.router = new EventRouter();
    this.schemaRegistry = new SchemaRegistry();
    this.activeFlows = new Map();
    this.metrics = {
      totalConnectors: 0,
      activeConnectors: 0,
      totalRequests: 0,
      totalEvents: 0
    };
  }

  /**
   * Create and register a connector
   */
  createConnector(config) {
    let connector;

    switch (config.protocol || 'REST') {
      case 'REST':
        connector = new RESTConnector(config);
        break;
      case 'WEBSOCKET':
        connector = new WebSocketConnector(config);
        break;
      default:
        connector = new Connector(config);
    }

    this.connectors.set(connector.id, connector);
    this.metrics.totalConnectors++;
    return connector;
  }

  /**
   * Create connector from template
   */
  createFromTemplate(templateName, credentials) {
    const template = INTEGRATION_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    return this.createConnector({
      ...template,
      id: `${templateName.toLowerCase()}_${Date.now()}`,
      credentials
    });
  }

  /**
   * Create a data pipeline
   */
  createPipeline(name) {
    const pipeline = new DataPipeline(name);
    this.pipelines.set(name, pipeline);
    return pipeline;
  }

  /**
   * Create an integration flow
   */
  createFlow(config) {
    const { name, source, destination, pipeline, trigger } = config;

    const flow = {
      id: `flow_${Date.now()}`,
      name,
      source: this.connectors.get(source),
      destination: this.connectors.get(destination),
      pipeline: this.pipelines.get(pipeline),
      trigger,
      status: 'inactive',
      executions: 0
    };

    this.activeFlows.set(flow.id, flow);
    return flow;
  }

  /**
   * Execute a flow
   */
  async executeFlow(flowId, inputData) {
    const flow = this.activeFlows.get(flowId);
    if (!flow) {
      throw new Error(`Flow not found: ${flowId}`);
    }

    flow.status = 'running';
    flow.executions++;

    try {
      // Fetch from source if needed
      let data = inputData;
      if (!data && flow.source) {
        data = await flow.source.request({ method: 'GET', path: flow.trigger.path });
      }

      // Transform through pipeline
      if (flow.pipeline) {
        data = await flow.pipeline.execute(data);
      }

      // Send to destination
      if (flow.destination) {
        await flow.destination.request({
          method: 'POST',
          path: flow.trigger.destinationPath,
          body: data
        });
      }

      flow.status = 'completed';
      return { success: true, data };
    } catch (error) {
      flow.status = 'error';
      throw error;
    }
  }

  /**
   * Sync data between two connectors
   */
  async sync(sourceId, destinationId, options = {}) {
    const source = this.connectors.get(sourceId);
    const destination = this.connectors.get(destinationId);

    if (!source || !destination) {
      throw new Error('Source or destination connector not found');
    }

    const {
      sourcePath,
      destinationPath,
      transform,
      batchSize = 100,
      schema
    } = options;

    // Fetch from source
    const sourceData = await source.request({
      method: 'GET',
      path: sourcePath,
      params: { limit: batchSize }
    });

    // Transform if needed
    let transformedData = sourceData.data;
    if (transform) {
      transformedData = Array.isArray(sourceData.data)
        ? sourceData.data.map(transform)
        : transform(sourceData.data);
    }

    if (schema) {
      transformedData = Array.isArray(transformedData)
        ? transformedData.map(item => this.schemaRegistry.transform(item, schema.from, schema.to))
        : this.schemaRegistry.transform(transformedData, schema.from, schema.to);
    }

    // Push to destination
    const result = await destination.request({
      method: 'POST',
      path: destinationPath,
      body: transformedData
    });

    return {
      synced: Array.isArray(transformedData) ? transformedData.length : 1,
      result
    };
  }

  /**
   * Register webhook handler
   */
  registerWebhook(connectorId, event, handler) {
    const key = `${connectorId}:${event}`;
    this.router.route(connectorId, event, {
      receive: async (evt, data) => handler(data)
    });
    return this;
  }

  /**
   * Get all connected systems status
   */
  getStatus() {
    const connectorStatuses = {};
    this.connectors.forEach((connector, id) => {
      connectorStatuses[id] = connector.getMetrics();
    });

    return {
      version: this.version,
      metrics: this.metrics,
      connectors: connectorStatuses,
      pipelines: Array.from(this.pipelines.keys()),
      flows: Array.from(this.activeFlows.values()).map(f => ({
        id: f.id,
        name: f.name,
        status: f.status,
        executions: f.executions
      })),
      availableTemplates: Object.keys(INTEGRATION_TEMPLATES)
    };
  }

  /**
   * Get available protocols
   */
  static get PROTOCOLS() {
    return PROTOCOLS;
  }

  /**
   * Get connector categories
   */
  static get CATEGORIES() {
    return CONNECTOR_CATEGORIES;
  }

  /**
   * Get integration templates
   */
  static get TEMPLATES() {
    return INTEGRATION_TEMPLATES;
  }
}

// Export everything
module.exports = {
  NexusProtocol,
  Connector,
  RESTConnector,
  WebSocketConnector,
  DataPipeline,
  TransformStage,
  EventRouter,
  SchemaRegistry,
  PROTOCOLS,
  CONNECTOR_CATEGORIES,
  INTEGRATION_TEMPLATES
};
