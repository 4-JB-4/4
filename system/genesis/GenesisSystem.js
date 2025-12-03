/**
 * GENESIS SYSTEM
 * ═══════════════════════════════════════════════════════════════════
 * Self-Replicating Template Engine - Creation Accelerated
 *
 * "Don't build products. Build factories that build products."
 *
 * Genesis is the meta-creation engine. It generates complete
 * business systems, applications, and workflows from high-level
 * intent. One thought becomes infinite implementation.
 * ═══════════════════════════════════════════════════════════════════
 */

const GENESIS_VERSION = '1.0.0';

/**
 * Creation Archetypes - What Genesis can create
 */
const CREATION_ARCHETYPES = {
  SAAS: {
    name: 'SaaS Application',
    icon: '🚀',
    complexity: 'high',
    components: ['auth', 'billing', 'dashboard', 'api', 'database', 'emails'],
    timeToGenerate: '< 60 seconds'
  },
  MARKETPLACE: {
    name: 'Marketplace',
    icon: '🏪',
    complexity: 'high',
    components: ['listings', 'search', 'payments', 'reviews', 'messaging', 'disputes'],
    timeToGenerate: '< 90 seconds'
  },
  AGENCY: {
    name: 'Agency Website',
    icon: '🎯',
    complexity: 'medium',
    components: ['portfolio', 'services', 'testimonials', 'contact', 'booking'],
    timeToGenerate: '< 30 seconds'
  },
  ECOMMERCE: {
    name: 'E-Commerce Store',
    icon: '🛒',
    complexity: 'high',
    components: ['products', 'cart', 'checkout', 'inventory', 'orders', 'shipping'],
    timeToGenerate: '< 45 seconds'
  },
  COMMUNITY: {
    name: 'Community Platform',
    icon: '👥',
    complexity: 'medium',
    components: ['profiles', 'posts', 'comments', 'groups', 'events', 'notifications'],
    timeToGenerate: '< 45 seconds'
  },
  API: {
    name: 'API Service',
    icon: '⚡',
    complexity: 'medium',
    components: ['endpoints', 'auth', 'rate-limiting', 'docs', 'monitoring'],
    timeToGenerate: '< 20 seconds'
  },
  MOBILE: {
    name: 'Mobile App',
    icon: '📱',
    complexity: 'high',
    components: ['navigation', 'screens', 'state', 'api-client', 'push-notifications'],
    timeToGenerate: '< 60 seconds'
  },
  DASHBOARD: {
    name: 'Analytics Dashboard',
    icon: '📊',
    complexity: 'medium',
    components: ['charts', 'tables', 'filters', 'exports', 'real-time'],
    timeToGenerate: '< 30 seconds'
  },
  AUTOMATION: {
    name: 'Automation Workflow',
    icon: '🤖',
    complexity: 'low',
    components: ['triggers', 'actions', 'conditions', 'schedules', 'logs'],
    timeToGenerate: '< 15 seconds'
  },
  LANDING: {
    name: 'Landing Page',
    icon: '📄',
    complexity: 'low',
    components: ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer'],
    timeToGenerate: '< 10 seconds'
  }
};

/**
 * Tech Stack Presets
 */
const TECH_STACKS = {
  MODERN_WEB: {
    name: 'Modern Web',
    frontend: ['React', 'Next.js', 'TailwindCSS', 'TypeScript'],
    backend: ['Node.js', 'Express', 'Prisma'],
    database: ['PostgreSQL'],
    deployment: ['Vercel', 'Supabase']
  },
  ENTERPRISE: {
    name: 'Enterprise',
    frontend: ['React', 'TypeScript', 'MUI'],
    backend: ['Java', 'Spring Boot'],
    database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
    deployment: ['AWS', 'Kubernetes']
  },
  STARTUP: {
    name: 'Startup Speed',
    frontend: ['React', 'Vite', 'TailwindCSS'],
    backend: ['Node.js', 'Fastify'],
    database: ['MongoDB'],
    deployment: ['Railway', 'Cloudflare']
  },
  WEB3: {
    name: 'Web3 Native',
    frontend: ['React', 'Ethers.js', 'RainbowKit'],
    backend: ['Node.js', 'GraphQL'],
    database: ['PostgreSQL', 'The Graph'],
    contracts: ['Solidity', 'Hardhat'],
    deployment: ['IPFS', 'Vercel']
  },
  AI_FIRST: {
    name: 'AI-First',
    frontend: ['React', 'Next.js'],
    backend: ['Python', 'FastAPI'],
    ai: ['OpenAI', 'LangChain', 'Pinecone'],
    database: ['PostgreSQL', 'Redis'],
    deployment: ['Modal', 'Vercel']
  }
};

/**
 * Component Blueprints - Reusable building blocks
 */
class ComponentBlueprint {
  constructor(config) {
    this.id = config.id || `bp_${Date.now()}`;
    this.name = config.name;
    this.type = config.type;
    this.description = config.description;
    this.inputs = config.inputs || [];
    this.outputs = config.outputs || [];
    this.dependencies = config.dependencies || [];
    this.template = config.template;
    this.variants = config.variants || [];
    this.tests = config.tests || [];
  }

  generate(context) {
    return this.template(context);
  }

  validate(context) {
    const missing = this.inputs.filter(input =>
      input.required && !context[input.name]
    );
    return {
      valid: missing.length === 0,
      missing
    };
  }
}

/**
 * Blueprint Registry
 */
class BlueprintRegistry {
  constructor() {
    this.blueprints = new Map();
    this.categories = new Map();
    this.registerDefaults();
  }

  register(blueprint) {
    const bp = blueprint instanceof ComponentBlueprint
      ? blueprint
      : new ComponentBlueprint(blueprint);

    this.blueprints.set(bp.id, bp);

    if (!this.categories.has(bp.type)) {
      this.categories.set(bp.type, []);
    }
    this.categories.get(bp.type).push(bp.id);

    return bp;
  }

  get(id) {
    return this.blueprints.get(id);
  }

  getByType(type) {
    const ids = this.categories.get(type) || [];
    return ids.map(id => this.blueprints.get(id));
  }

  registerDefaults() {
    // Authentication Blueprint
    this.register({
      id: 'auth_system',
      name: 'Authentication System',
      type: 'auth',
      description: 'Complete auth with login, register, password reset',
      inputs: [
        { name: 'providers', type: 'array', default: ['email'] },
        { name: 'mfa', type: 'boolean', default: false }
      ],
      outputs: ['authRoutes', 'authMiddleware', 'userModel'],
      template: (ctx) => ({
        routes: this.generateAuthRoutes(ctx),
        middleware: this.generateAuthMiddleware(ctx),
        model: this.generateUserModel(ctx)
      })
    });

    // API Blueprint
    this.register({
      id: 'rest_api',
      name: 'REST API',
      type: 'api',
      description: 'Full REST API with CRUD operations',
      inputs: [
        { name: 'resource', type: 'string', required: true },
        { name: 'fields', type: 'array', required: true }
      ],
      outputs: ['routes', 'controller', 'model', 'validation'],
      template: (ctx) => this.generateRESTAPI(ctx)
    });

    // Dashboard Blueprint
    this.register({
      id: 'admin_dashboard',
      name: 'Admin Dashboard',
      type: 'dashboard',
      description: 'Admin dashboard with metrics and management',
      inputs: [
        { name: 'metrics', type: 'array', default: [] },
        { name: 'tables', type: 'array', default: [] }
      ],
      outputs: ['pages', 'components', 'charts'],
      template: (ctx) => this.generateDashboard(ctx)
    });

    // Payment Blueprint
    this.register({
      id: 'payment_system',
      name: 'Payment System',
      type: 'billing',
      description: 'Stripe integration with subscriptions',
      inputs: [
        { name: 'plans', type: 'array', required: true },
        { name: 'trialDays', type: 'number', default: 14 }
      ],
      outputs: ['webhooks', 'checkout', 'billing'],
      template: (ctx) => this.generatePaymentSystem(ctx)
    });
  }

  generateAuthRoutes(ctx) {
    return `
// Auth Routes
const router = require('express').Router();
const authController = require('./authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
${ctx.mfa ? "router.post('/verify-mfa', authController.verifyMFA);" : ''}
${ctx.providers?.includes('google') ? "router.get('/google', authController.googleAuth);" : ''}
${ctx.providers?.includes('github') ? "router.get('/github', authController.githubAuth);" : ''}

module.exports = router;
    `.trim();
  }

  generateAuthMiddleware(ctx) {
    return `
// Auth Middleware
const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },
  authorize: (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  }
};
    `.trim();
  }

  generateUserModel(ctx) {
    return `
// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'user' },
  ${ctx.mfa ? "mfaSecret: { type: String }," : ''}
  ${ctx.mfa ? "mfaEnabled: { type: Boolean, default: false }," : ''}
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
    `.trim();
  }

  generateRESTAPI(ctx) {
    const { resource, fields } = ctx;
    const modelName = resource.charAt(0).toUpperCase() + resource.slice(1);

    return {
      model: this.generateModel(modelName, fields),
      routes: this.generateRoutes(resource),
      controller: this.generateController(resource, modelName),
      validation: this.generateValidation(resource, fields)
    };
  }

  generateModel(name, fields) {
    const schemaFields = fields.map(f =>
      `  ${f.name}: { type: ${f.type}, ${f.required ? 'required: true' : ''} }`
    ).join(',\n');

    return `
const mongoose = require('mongoose');

const ${name.toLowerCase()}Schema = new mongoose.Schema({
${schemaFields},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('${name}', ${name.toLowerCase()}Schema);
    `.trim();
  }

  generateRoutes(resource) {
    return `
const router = require('express').Router();
const controller = require('./${resource}Controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.get);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
    `.trim();
  }

  generateController(resource, modelName) {
    return `
const ${modelName} = require('../models/${modelName}');

module.exports = {
  list: async (req, res) => {
    const items = await ${modelName}.find(req.query);
    res.json(items);
  },
  get: async (req, res) => {
    const item = await ${modelName}.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  },
  create: async (req, res) => {
    const item = new ${modelName}(req.body);
    await item.save();
    res.status(201).json(item);
  },
  update: async (req, res) => {
    const item = await ${modelName}.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  },
  delete: async (req, res) => {
    await ${modelName}.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
};
    `.trim();
  }

  generateValidation(resource, fields) {
    const rules = fields.filter(f => f.required).map(f =>
      `  ${f.name}: { required: true, type: '${f.type.toLowerCase()}' }`
    ).join(',\n');

    return `
const validate${resource.charAt(0).toUpperCase() + resource.slice(1)} = {
${rules}
};

module.exports = validate${resource.charAt(0).toUpperCase() + resource.slice(1)};
    `.trim();
  }

  generateDashboard(ctx) {
    return {
      layout: 'Dashboard layout generated',
      metrics: ctx.metrics.map(m => `MetricCard: ${m}`),
      tables: ctx.tables.map(t => `DataTable: ${t}`)
    };
  }

  generatePaymentSystem(ctx) {
    return {
      checkout: 'Stripe Checkout integration',
      webhooks: 'Webhook handlers for Stripe events',
      billing: 'Billing portal integration',
      plans: ctx.plans
    };
  }
}

/**
 * Project Scaffold - Complete project structure
 */
class ProjectScaffold {
  constructor(config) {
    this.name = config.name;
    this.archetype = config.archetype;
    this.stack = config.stack;
    this.features = config.features || [];
    this.structure = {};
    this.files = [];
    this.dependencies = { production: {}, development: {} };
  }

  generateStructure() {
    const base = {
      src: {
        components: {},
        pages: {},
        api: {},
        lib: {},
        styles: {},
        hooks: {},
        utils: {}
      },
      public: {
        images: {},
        fonts: {}
      },
      tests: {},
      config: {},
      docs: {}
    };

    // Add archetype-specific directories
    const archetype = CREATION_ARCHETYPES[this.archetype];
    if (archetype) {
      archetype.components.forEach(component => {
        base.src[component] = {};
      });
    }

    this.structure = base;
    return this;
  }

  addDependencies() {
    const stack = TECH_STACKS[this.stack];
    if (!stack) return this;

    // Frontend deps
    if (stack.frontend.includes('React')) {
      this.dependencies.production['react'] = '^18.2.0';
      this.dependencies.production['react-dom'] = '^18.2.0';
    }
    if (stack.frontend.includes('Next.js')) {
      this.dependencies.production['next'] = '^14.0.0';
    }
    if (stack.frontend.includes('TailwindCSS')) {
      this.dependencies.development['tailwindcss'] = '^3.4.0';
      this.dependencies.development['autoprefixer'] = '^10.4.0';
      this.dependencies.development['postcss'] = '^8.4.0';
    }
    if (stack.frontend.includes('TypeScript')) {
      this.dependencies.development['typescript'] = '^5.3.0';
      this.dependencies.development['@types/react'] = '^18.2.0';
      this.dependencies.development['@types/node'] = '^20.0.0';
    }

    // Backend deps
    if (stack.backend?.includes('Express')) {
      this.dependencies.production['express'] = '^4.18.0';
    }
    if (stack.backend?.includes('Prisma')) {
      this.dependencies.production['@prisma/client'] = '^5.0.0';
      this.dependencies.development['prisma'] = '^5.0.0';
    }

    return this;
  }

  generatePackageJson() {
    return {
      name: this.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'eslint .',
        test: 'jest'
      },
      dependencies: this.dependencies.production,
      devDependencies: this.dependencies.development
    };
  }

  generateReadme() {
    const archetype = CREATION_ARCHETYPES[this.archetype];
    return `
# ${this.name}

${archetype?.icon || '🚀'} Generated by Genesis System

## Tech Stack

${TECH_STACKS[this.stack]?.frontend.join(', ') || 'Not specified'}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

${this.features.map(f => `- ${f}`).join('\n')}

## Project Structure

\`\`\`
${this.name}/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── lib/
├── public/
├── tests/
└── config/
\`\`\`

---
*Generated by 0RB Genesis System v${GENESIS_VERSION}*
    `.trim();
  }

  build() {
    this.generateStructure();
    this.addDependencies();

    return {
      name: this.name,
      archetype: this.archetype,
      stack: this.stack,
      structure: this.structure,
      packageJson: this.generatePackageJson(),
      readme: this.generateReadme(),
      files: this.files
    };
  }
}

/**
 * Intent Parser - Understand natural language project descriptions
 */
class IntentParser {
  constructor() {
    this.patterns = this.initializePatterns();
  }

  initializePatterns() {
    return {
      archetypes: {
        saas: /\b(saas|subscription|recurring|software as a service)\b/i,
        marketplace: /\b(marketplace|two.?sided|buyers?.?sellers?|listings?)\b/i,
        ecommerce: /\b(ecommerce|e.?commerce|shop|store|sell\s+products?)\b/i,
        community: /\b(community|forum|social|members?|users?\s+connect)\b/i,
        dashboard: /\b(dashboard|analytics|metrics|reporting|visualiz)\b/i,
        api: /\b(api|backend|service|microservice|endpoints?)\b/i,
        mobile: /\b(mobile|app|ios|android|native)\b/i,
        landing: /\b(landing\s+page|marketing|conversion|waitlist)\b/i
      },
      features: {
        auth: /\b(auth|login|signup|register|users?)\b/i,
        payments: /\b(payment|billing|subscription|stripe|checkout)\b/i,
        realtime: /\b(real.?time|live|websocket|notifications?)\b/i,
        ai: /\b(ai|machine\s+learning|gpt|llm|intelligent)\b/i,
        search: /\b(search|filter|find|query)\b/i,
        uploads: /\b(upload|file|image|media|storage)\b/i,
        email: /\b(email|newsletter|transactional)\b/i,
        analytics: /\b(analytics|tracking|metrics|events?)\b/i
      },
      stacks: {
        MODERN_WEB: /\b(react|next\.?js|modern|vercel)\b/i,
        ENTERPRISE: /\b(enterprise|java|spring|corporate)\b/i,
        STARTUP: /\b(startup|fast|quick|mvp|rapid)\b/i,
        WEB3: /\b(web3|blockchain|crypto|nft|ethereum|solana)\b/i,
        AI_FIRST: /\b(ai.?first|openai|langchain|python|ml)\b/i
      }
    };
  }

  parse(description) {
    const result = {
      archetype: this.detectArchetype(description),
      features: this.detectFeatures(description),
      stack: this.detectStack(description),
      entities: this.extractEntities(description),
      confidence: 0
    };

    // Calculate confidence
    const detections = [
      result.archetype !== 'SAAS' ? 1 : 0,
      result.features.length > 0 ? 1 : 0,
      result.stack !== 'MODERN_WEB' ? 1 : 0,
      result.entities.length > 0 ? 1 : 0
    ];
    result.confidence = detections.reduce((a, b) => a + b, 0) / 4;

    return result;
  }

  detectArchetype(text) {
    for (const [archetype, pattern] of Object.entries(this.patterns.archetypes)) {
      if (pattern.test(text)) {
        return archetype.toUpperCase();
      }
    }
    return 'SAAS'; // Default
  }

  detectFeatures(text) {
    const features = [];
    for (const [feature, pattern] of Object.entries(this.patterns.features)) {
      if (pattern.test(text)) {
        features.push(feature);
      }
    }
    return features;
  }

  detectStack(text) {
    for (const [stack, pattern] of Object.entries(this.patterns.stacks)) {
      if (pattern.test(text)) {
        return stack;
      }
    }
    return 'MODERN_WEB'; // Default
  }

  extractEntities(text) {
    // Simple entity extraction
    const entities = [];
    const patterns = [
      /(?:for|manage|track|handle)\s+(\w+)/gi,
      /(\w+)\s+(?:management|tracking|system)/gi,
      /(?:create|build|make)\s+(?:a\s+)?(\w+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        entities.push(match[1].toLowerCase());
      }
    });

    return [...new Set(entities)];
  }
}

/**
 * Genesis System - Main Interface
 */
class GenesisSystem {
  constructor() {
    this.version = GENESIS_VERSION;
    this.registry = new BlueprintRegistry();
    this.parser = new IntentParser();
    this.projects = new Map();
    this.generations = [];
  }

  /**
   * Create from natural language description
   */
  createFromIntent(description, options = {}) {
    const parsed = this.parser.parse(description);

    return this.create({
      name: options.name || 'Generated Project',
      archetype: options.archetype || parsed.archetype,
      stack: options.stack || parsed.stack,
      features: [...(options.features || []), ...parsed.features],
      entities: parsed.entities
    });
  }

  /**
   * Create from structured specification
   */
  create(spec) {
    const { name, archetype, stack, features = [], entities = [] } = spec;

    const scaffold = new ProjectScaffold({
      name,
      archetype,
      stack,
      features
    });

    const project = scaffold.build();

    // Generate blueprints for each feature
    const blueprints = features.map(feature => {
      const bp = this.registry.getByType(feature)[0];
      if (bp) {
        return {
          feature,
          code: bp.generate({ feature, entities })
        };
      }
      return { feature, code: null };
    }).filter(b => b.code);

    // Generate entity models
    const models = entities.map(entity => ({
      entity,
      model: this.registry.generateModel(
        entity.charAt(0).toUpperCase() + entity.slice(1),
        [
          { name: 'name', type: 'String', required: true },
          { name: 'description', type: 'String' },
          { name: 'status', type: 'String' }
        ]
      )
    }));

    const result = {
      id: `gen_${Date.now()}`,
      ...project,
      blueprints,
      models,
      timestamp: Date.now()
    };

    this.projects.set(result.id, result);
    this.generations.push({
      id: result.id,
      name,
      archetype,
      timestamp: result.timestamp
    });

    return result;
  }

  /**
   * Generate a specific component
   */
  generateComponent(type, context) {
    const blueprints = this.registry.getByType(type);
    if (blueprints.length === 0) {
      throw new Error(`No blueprints found for type: ${type}`);
    }

    return blueprints[0].generate(context);
  }

  /**
   * Clone and customize existing project
   */
  clone(projectId, modifications = {}) {
    const original = this.projects.get(projectId);
    if (!original) {
      throw new Error(`Project not found: ${projectId}`);
    }

    return this.create({
      ...original,
      name: modifications.name || `${original.name} (Clone)`,
      ...modifications
    });
  }

  /**
   * Get available archetypes
   */
  getArchetypes() {
    return CREATION_ARCHETYPES;
  }

  /**
   * Get available stacks
   */
  getStacks() {
    return TECH_STACKS;
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      version: this.version,
      blueprintsRegistered: this.registry.blueprints.size,
      projectsGenerated: this.projects.size,
      recentGenerations: this.generations.slice(-10),
      archetypes: Object.keys(CREATION_ARCHETYPES),
      stacks: Object.keys(TECH_STACKS)
    };
  }

  /**
   * Quick create methods
   */
  static quickSaaS(name, features = []) {
    const genesis = new GenesisSystem();
    return genesis.create({
      name,
      archetype: 'SAAS',
      stack: 'MODERN_WEB',
      features: ['auth', 'billing', ...features]
    });
  }

  static quickAPI(name, resources = []) {
    const genesis = new GenesisSystem();
    return genesis.create({
      name,
      archetype: 'API',
      stack: 'MODERN_WEB',
      features: ['auth'],
      entities: resources
    });
  }

  static quickLanding(name) {
    const genesis = new GenesisSystem();
    return genesis.create({
      name,
      archetype: 'LANDING',
      stack: 'MODERN_WEB',
      features: []
    });
  }
}

// Export everything
module.exports = {
  GenesisSystem,
  ProjectScaffold,
  BlueprintRegistry,
  ComponentBlueprint,
  IntentParser,
  CREATION_ARCHETYPES,
  TECH_STACKS
};
