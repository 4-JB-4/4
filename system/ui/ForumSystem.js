/**
 * 0RB SYSTEM - FORUM/COMMUNITY SYSTEM
 * The community TEACHES ITSELF. Shares discoveries. Builds lore.
 * Creates content ABOUT your content.
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// FORUM CATEGORIES
// ═══════════════════════════════════════════════════════════════

const FORUM_CATEGORIES = {
  GENERAL: {
    id: 'GENERAL',
    name: 'General Discussion',
    icon: '💬',
    description: 'The simulation speaks. General 0RB discussion.',
    subcategories: [
      { id: 'announcements', name: 'Announcements', icon: '📢' },
      { id: 'introductions', name: 'Introductions', icon: '👋' },
      { id: 'feedback', name: 'Feedback & Suggestions', icon: '💡' },
      { id: 'off-topic', name: 'Off Topic', icon: '🌀' }
    ]
  },

  GAMES: {
    id: 'GAMES',
    name: 'Game Discussions',
    icon: '🎮',
    description: 'Master the games. Unlock reality.',
    subcategories: [
      { id: 'architect', name: 'ARCHITECT', icon: '🏛️' },
      { id: 'oracle', name: 'ORACLE', icon: '🔮' },
      { id: 'pantheon', name: 'PANTHEON', icon: '⚡' },
      { id: 'forge', name: 'FORGE', icon: '🔥' },
      { id: 'empire', name: 'EMPIRE', icon: '👑' },
      { id: 'echo', name: 'ECHO', icon: '🔊' },
      { id: 'infinite', name: 'INFINITE', icon: '∞' }
    ]
  },

  CREATIONS: {
    id: 'CREATIONS',
    name: 'User Creations Showcase',
    icon: '🌟',
    description: 'What did you build today? Show the simulation.',
    subcategories: [
      { id: 'websites', name: 'Websites & Apps', icon: '🌐' },
      { id: 'brands', name: 'Brands & Identities', icon: '🎨' },
      { id: 'businesses', name: 'Businesses Launched', icon: '🚀' },
      { id: 'content', name: 'Content & Media', icon: '📸' },
      { id: 'agents', name: 'Custom Agents', icon: '🤖' }
    ]
  },

  STRATEGY: {
    id: 'STRATEGY',
    name: 'Strategy Guides',
    icon: '📚',
    description: 'The ancient knowledge. Guides and tutorials.',
    subcategories: [
      { id: 'tutorials', name: 'Tutorials', icon: '📖' },
      { id: 'tips', name: 'Tips & Tricks', icon: '💎' },
      { id: 'workflows', name: 'Workflows', icon: '⚙️' },
      { id: 'prompts', name: 'Prompt Engineering', icon: '✨' }
    ]
  },

  COPA: {
    id: 'COPA',
    name: 'Copa Community',
    icon: '🤝',
    description: 'Augmentation over automation. Copa user community.',
    subcategories: [
      { id: 'legal', name: 'Copa Legal', icon: '⚖️' },
      { id: 'medical', name: 'Copa Medical', icon: '🏥' },
      { id: 'sales', name: 'Copa Sales', icon: '💼' },
      { id: 'creative', name: 'Copa Creative', icon: '🎭' },
      { id: 'code', name: 'Copa Code', icon: '💻' },
      { id: 'success-stories', name: 'Success Stories', icon: '🏆' }
    ]
  },

  AGENTS: {
    id: 'AGENTS',
    name: 'Agent Exchange',
    icon: '🔄',
    description: 'The agent marketplace community.',
    subcategories: [
      { id: 'marketplace', name: 'Marketplace Talk', icon: '🏪' },
      { id: 'rentals', name: 'Rental Listings', icon: '📋' },
      { id: 'reviews', name: 'Agent Reviews', icon: '⭐' },
      { id: 'strategies', name: 'Investment Strategies', icon: '📈' }
    ]
  },

  CRYPTO: {
    id: 'CRYPTO',
    name: '$0RB Economy',
    icon: '💰',
    description: 'Token talk, staking, yields, and more.',
    subcategories: [
      { id: 'token', name: '$0RB Token', icon: '🪙' },
      { id: 'staking', name: 'Staking & Yields', icon: '🌾' },
      { id: 'governance', name: 'Governance', icon: '🗳️' },
      { id: 'proposals', name: 'Proposals', icon: '📜' }
    ]
  },

  MODDING: {
    id: 'MODDING',
    name: 'Modding & Development',
    icon: '🔧',
    description: 'Custom agents, workflows, integrations.',
    subcategories: [
      { id: 'agent-building', name: 'Agent Building', icon: '🏗️' },
      { id: 'integrations', name: 'Integrations', icon: '🔌' },
      { id: 'templates', name: 'Templates', icon: '📄' },
      { id: 'api', name: 'API Discussion', icon: '🔗' }
    ]
  },

  LORE: {
    id: 'LORE',
    name: 'The Lore',
    icon: '📜',
    description: 'The simulation deepens. Philosophy and lore.',
    subcategories: [
      { id: 'simulation-theory', name: 'Simulation Theory', icon: '🌌' },
      { id: 'consciousness', name: 'Consciousness', icon: '🧠' },
      { id: 'awakening', name: 'The Awakening', icon: '👁️' },
      { id: 'stories', name: 'Stories & Fiction', icon: '✍️' }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// USER RANKS
// ═══════════════════════════════════════════════════════════════

const USER_RANKS = {
  OBSERVER: { level: 0, name: 'Observer', icon: '👁️', minPosts: 0, color: '#808080' },
  INITIATE: { level: 1, name: 'Initiate', icon: '🌱', minPosts: 5, color: '#2ECC71' },
  AWAKENED: { level: 2, name: 'Awakened', icon: '✨', minPosts: 25, color: '#3498DB' },
  ARCHITECT: { level: 3, name: 'Architect', icon: '🏛️', minPosts: 100, color: '#9B59B6' },
  ORACLE: { level: 4, name: 'Oracle', icon: '🔮', minPosts: 500, color: '#F1C40F' },
  ELDER: { level: 5, name: 'Elder', icon: '👑', minPosts: 1000, color: '#E74C3C' },
  DIVINE: { level: 6, name: 'Divine', icon: '⚡', minPosts: 5000, color: '#00FFFF' }
};

// ═══════════════════════════════════════════════════════════════
// THREAD CLASS
// ═══════════════════════════════════════════════════════════════

class Thread {
  constructor(config) {
    this.id = this.generateId();
    this.title = config.title;
    this.categoryId = config.categoryId;
    this.subcategoryId = config.subcategoryId;
    this.authorId = config.authorId;
    this.content = config.content;
    this.tags = config.tags || [];
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.views = 0;
    this.replies = [];
    this.reactions = { fire: 0, mind_blown: 0, helpful: 0, creative: 0 };
    this.isPinned = false;
    this.isLocked = false;
    this.status = 'ACTIVE';
  }

  generateId() {
    return `thread-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  addReply(reply) {
    const replyObj = {
      id: `reply-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      authorId: reply.authorId,
      content: reply.content,
      createdAt: Date.now(),
      reactions: { fire: 0, mind_blown: 0, helpful: 0, creative: 0 },
      isAnswer: false
    };
    this.replies.push(replyObj);
    this.updatedAt = Date.now();
    return replyObj;
  }

  addReaction(type) {
    if (this.reactions.hasOwnProperty(type)) {
      this.reactions[type]++;
    }
  }

  incrementViews() {
    this.views++;
  }

  getStats() {
    return {
      id: this.id,
      title: this.title,
      views: this.views,
      replyCount: this.replies.length,
      reactions: this.reactions,
      lastActivity: this.updatedAt,
      isPinned: this.isPinned
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// FORUM USER CLASS
// ═══════════════════════════════════════════════════════════════

class ForumUser {
  constructor(config) {
    this.id = config.id || this.generateId();
    this.username = config.username;
    this.displayName = config.displayName || config.username;
    this.avatar = config.avatar || null;
    this.bio = config.bio || '';
    this.joinedAt = Date.now();
    this.lastActive = Date.now();
    this.stats = {
      posts: 0,
      threads: 0,
      reactions: 0,
      reputation: 0
    };
    this.badges = [];
    this.rank = 'OBSERVER';
  }

  generateId() {
    return `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  incrementPosts() {
    this.stats.posts++;
    this.updateRank();
    this.lastActive = Date.now();
  }

  incrementThreads() {
    this.stats.threads++;
    this.stats.posts++;
    this.updateRank();
    this.lastActive = Date.now();
  }

  addReputation(amount) {
    this.stats.reputation += amount;
  }

  addBadge(badge) {
    if (!this.badges.includes(badge)) {
      this.badges.push(badge);
    }
  }

  updateRank() {
    const ranks = Object.entries(USER_RANKS).reverse();
    for (const [rankKey, rank] of ranks) {
      if (this.stats.posts >= rank.minPosts) {
        this.rank = rankKey;
        return;
      }
    }
  }

  getProfile() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      avatar: this.avatar,
      bio: this.bio,
      joinedAt: this.joinedAt,
      stats: this.stats,
      rank: this.rank,
      rankInfo: USER_RANKS[this.rank],
      badges: this.badges
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// FORUM SYSTEM CLASS
// ═══════════════════════════════════════════════════════════════

class ForumSystem extends EventEmitter {
  constructor() {
    super();
    this.categories = FORUM_CATEGORIES;
    this.ranks = USER_RANKS;
    this.threads = new Map();
    this.users = new Map();
    this.stats = {
      totalThreads: 0,
      totalReplies: 0,
      totalUsers: 0,
      activeToday: 0
    };
  }

  // ═══════════════════════════════════════════════════════════
  // USER OPERATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Register a new user
   */
  registerUser(config) {
    const user = new ForumUser(config);
    this.users.set(user.id, user);
    this.stats.totalUsers++;

    this.emit('user:registered', { userId: user.id, username: user.username });

    return user;
  }

  /**
   * Get user by ID
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * Get user profile
   */
  getUserProfile(userId) {
    const user = this.users.get(userId);
    return user ? user.getProfile() : null;
  }

  // ═══════════════════════════════════════════════════════════
  // THREAD OPERATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Create a new thread
   */
  createThread(config) {
    // Validate category
    if (!this.categories[config.categoryId]) {
      throw new Error(`Invalid category: ${config.categoryId}`);
    }

    const thread = new Thread(config);
    this.threads.set(thread.id, thread);
    this.stats.totalThreads++;

    // Update user stats
    const user = this.users.get(config.authorId);
    if (user) {
      user.incrementThreads();
      user.addReputation(5);
    }

    this.emit('thread:created', {
      threadId: thread.id,
      categoryId: config.categoryId,
      authorId: config.authorId
    });

    return thread;
  }

  /**
   * Get thread by ID
   */
  getThread(threadId) {
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.incrementViews();
    }
    return thread;
  }

  /**
   * Get threads by category
   */
  getThreadsByCategory(categoryId, subcategoryId = null, options = {}) {
    let threads = Array.from(this.threads.values())
      .filter(t => t.categoryId === categoryId && t.status === 'ACTIVE');

    if (subcategoryId) {
      threads = threads.filter(t => t.subcategoryId === subcategoryId);
    }

    // Sort options
    switch (options.sort) {
      case 'newest':
        threads.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'popular':
        threads.sort((a, b) => b.views - a.views);
        break;
      case 'active':
      default:
        threads.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // Pinned threads first
    threads.sort((a, b) => b.isPinned - a.isPinned);

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;

    return {
      threads: threads.slice(start, start + limit),
      total: threads.length,
      page,
      totalPages: Math.ceil(threads.length / limit)
    };
  }

  /**
   * Add reply to thread
   */
  addReply(threadId, reply) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }

    if (thread.isLocked) {
      throw new Error('Thread is locked');
    }

    const replyObj = thread.addReply(reply);
    this.stats.totalReplies++;

    // Update user stats
    const user = this.users.get(reply.authorId);
    if (user) {
      user.incrementPosts();
      user.addReputation(1);
    }

    // Give reputation to thread author for engagement
    const threadAuthor = this.users.get(thread.authorId);
    if (threadAuthor && threadAuthor.id !== reply.authorId) {
      threadAuthor.addReputation(1);
    }

    this.emit('reply:created', {
      threadId,
      replyId: replyObj.id,
      authorId: reply.authorId
    });

    return replyObj;
  }

  /**
   * Add reaction to thread or reply
   */
  addReaction(threadId, reactionType, replyId = null) {
    const thread = this.threads.get(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }

    if (replyId) {
      const reply = thread.replies.find(r => r.id === replyId);
      if (reply && reply.reactions.hasOwnProperty(reactionType)) {
        reply.reactions[reactionType]++;
      }
    } else {
      thread.addReaction(reactionType);
    }

    this.emit('reaction:added', { threadId, replyId, reactionType });

    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // SEARCH & DISCOVERY
  // ═══════════════════════════════════════════════════════════

  /**
   * Search threads
   */
  searchThreads(query) {
    const queryLower = query.toLowerCase();
    return Array.from(this.threads.values())
      .filter(t => {
        return t.status === 'ACTIVE' && (
          t.title.toLowerCase().includes(queryLower) ||
          t.content.toLowerCase().includes(queryLower) ||
          t.tags.some(tag => tag.toLowerCase().includes(queryLower))
        );
      })
      .slice(0, 50);
  }

  /**
   * Get trending threads
   */
  getTrendingThreads(limit = 10) {
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);

    return Array.from(this.threads.values())
      .filter(t => t.status === 'ACTIVE' && t.updatedAt > dayAgo)
      .sort((a, b) => {
        const scoreA = a.views + (a.replies.length * 3) + (Object.values(a.reactions).reduce((s, v) => s + v, 0) * 2);
        const scoreB = b.views + (b.replies.length * 3) + (Object.values(b.reactions).reduce((s, v) => s + v, 0) * 2);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get latest threads
   */
  getLatestThreads(limit = 10) {
    return Array.from(this.threads.values())
      .filter(t => t.status === 'ACTIVE')
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  // ═══════════════════════════════════════════════════════════
  // LEADERBOARDS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get top contributors
   */
  getTopContributors(limit = 10) {
    return Array.from(this.users.values())
      .sort((a, b) => b.stats.reputation - a.stats.reputation)
      .slice(0, limit)
      .map(u => u.getProfile());
  }

  /**
   * Get most active users
   */
  getMostActiveUsers(limit = 10) {
    return Array.from(this.users.values())
      .sort((a, b) => b.stats.posts - a.stats.posts)
      .slice(0, limit)
      .map(u => u.getProfile());
  }

  // ═══════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get forum statistics
   */
  getStatistics() {
    return {
      ...this.stats,
      categoriesCount: Object.keys(this.categories).length,
      onlineUsers: Math.floor(this.stats.totalUsers * 0.1) // Simulated
    };
  }

  /**
   * Get category statistics
   */
  getCategoryStats(categoryId) {
    const threads = Array.from(this.threads.values())
      .filter(t => t.categoryId === categoryId);

    return {
      threadCount: threads.length,
      replyCount: threads.reduce((sum, t) => sum + t.replies.length, 0),
      viewCount: threads.reduce((sum, t) => sum + t.views, 0),
      latestThread: threads.sort((a, b) => b.createdAt - a.createdAt)[0]
    };
  }

  /**
   * Get all categories with stats
   */
  getCategoriesWithStats() {
    return Object.entries(this.categories).map(([key, category]) => ({
      ...category,
      stats: this.getCategoryStats(key)
    }));
  }
}

module.exports = {
  ForumSystem,
  ForumUser,
  Thread,
  FORUM_CATEGORIES,
  USER_RANKS
};
