/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███████╗ ██████╗██╗  ██╗ ██████╗                                        ║
 * ║   ██╔════╝██╔════╝██║  ██║██╔═══██╗                                       ║
 * ║   █████╗  ██║     ███████║██║   ██║                                       ║
 * ║   ██╔══╝  ██║     ██╔══██║██║   ██║                                       ║
 * ║   ███████╗╚██████╗██║  ██║╚██████╔╝                                       ║
 * ║   ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝                                        ║
 * ║                                                                           ║
 * ║   THE CONTENT ENGINE - Your Voice, Amplified Infinitely                   ║
 * ║   "Create once. Echo forever."                                            ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');

const CONTENT_TYPES = {
  BLOG: { name: 'Blog Post', icon: '📝', platforms: ['website', 'medium', 'substack'] },
  SOCIAL: { name: 'Social Media', icon: '📱', platforms: ['twitter', 'linkedin', 'instagram', 'tiktok'] },
  VIDEO: { name: 'Video Script', icon: '🎬', platforms: ['youtube', 'tiktok', 'reels'] },
  PODCAST: { name: 'Podcast Script', icon: '🎙️', platforms: ['spotify', 'apple', 'youtube'] },
  EMAIL: { name: 'Email Campaign', icon: '📧', platforms: ['newsletter', 'drip', 'broadcast'] },
  AD: { name: 'Advertisement', icon: '📢', platforms: ['google', 'facebook', 'linkedin', 'tiktok'] },
  THREAD: { name: 'Thread', icon: '🧵', platforms: ['twitter', 'threads'] },
  LANDING: { name: 'Landing Page', icon: '🎯', platforms: ['website'] }
};

const TONES = {
  PROFESSIONAL: { name: 'Professional', emoji: '💼', adjectives: ['authoritative', 'credible', 'polished'] },
  CASUAL: { name: 'Casual', emoji: '😎', adjectives: ['friendly', 'approachable', 'conversational'] },
  BOLD: { name: 'Bold', emoji: '🔥', adjectives: ['provocative', 'confident', 'attention-grabbing'] },
  EDUCATIONAL: { name: 'Educational', emoji: '📚', adjectives: ['informative', 'clear', 'helpful'] },
  INSPIRING: { name: 'Inspiring', emoji: '✨', adjectives: ['motivational', 'uplifting', 'empowering'] },
  HUMOROUS: { name: 'Humorous', emoji: '😂', adjectives: ['funny', 'witty', 'entertaining'] },
  STORYTELLING: { name: 'Storytelling', emoji: '📖', adjectives: ['narrative', 'engaging', 'emotional'] }
};

const FRAMEWORKS = {
  AIDA: { name: 'AIDA', steps: ['Attention', 'Interest', 'Desire', 'Action'] },
  PAS: { name: 'PAS', steps: ['Problem', 'Agitation', 'Solution'] },
  BAB: { name: 'Before-After-Bridge', steps: ['Before', 'After', 'Bridge'] },
  FOUR_PS: { name: '4 Ps', steps: ['Promise', 'Picture', 'Proof', 'Push'] },
  STORYTELLING: { name: 'Hero\'s Journey', steps: ['Status Quo', 'Challenge', 'Journey', 'Resolution'] }
};

class EchoEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.content = new Map();
    this.campaigns = new Map();
    this.analytics = new Map();
    this.brandVoice = null;

    console.log('[ECHO] Engine initialized - Your voice amplified');
  }

  setBrandVoice(voice) {
    this.brandVoice = {
      tone: voice.tone || 'PROFESSIONAL',
      values: voice.values || [],
      keywords: voice.keywords || [],
      avoidWords: voice.avoidWords || [],
      examples: voice.examples || [],
      personality: voice.personality || {}
    };

    this.emit('brand:configured', { brandVoice: this.brandVoice });
    return this.brandVoice;
  }

  async createContent(spec) {
    const contentId = `content_${Date.now()}`;
    const contentType = CONTENT_TYPES[spec.type] || CONTENT_TYPES.BLOG;
    const tone = TONES[spec.tone || this.brandVoice?.tone || 'PROFESSIONAL'];
    const framework = FRAMEWORKS[spec.framework || 'AIDA'];

    const content = {
      id: contentId,
      type: spec.type,
      topic: spec.topic,
      tone: tone,
      framework: framework,
      status: 'generating',
      versions: [],
      platforms: contentType.platforms,
      createdAt: Date.now()
    };

    this.content.set(contentId, content);
    this.emit('content:started', { contentId, spec });

    try {
      // Generate main content
      content.main = await this.generateMainContent(spec, tone, framework);
      content.status = 'adapting';

      // Generate platform-specific versions
      for (const platform of spec.platforms || contentType.platforms) {
        const adapted = await this.adaptForPlatform(content.main, platform);
        content.versions.push({
          platform,
          content: adapted,
          generatedAt: Date.now()
        });
      }

      content.status = 'complete';
      this.emit('content:complete', { contentId, content });

      return content;
    } catch (error) {
      content.status = 'failed';
      content.error = error.message;
      throw error;
    }
  }

  async generateMainContent(spec, tone, framework) {
    return {
      headline: `${spec.topic} - Compelling Headline`,
      hook: `Opening hook about ${spec.topic}`,
      body: framework.steps.map(step => ({
        section: step,
        content: `Content for ${step} section about ${spec.topic}`
      })),
      cta: 'Call to action',
      metadata: {
        wordCount: 500,
        readingTime: '3 min',
        keywords: spec.keywords || []
      }
    };
  }

  async adaptForPlatform(mainContent, platform) {
    const adaptations = {
      twitter: {
        maxLength: 280,
        format: 'thread',
        adapt: (content) => ({
          tweets: [
            content.hook.substring(0, 270) + '🧵',
            ...content.body.map(s => s.content.substring(0, 270)),
            content.cta.substring(0, 270)
          ]
        })
      },
      linkedin: {
        maxLength: 3000,
        format: 'post',
        adapt: (content) => ({
          post: `${content.headline}\n\n${content.hook}\n\n${content.body.map(s => s.content).join('\n\n')}\n\n${content.cta}`
        })
      },
      instagram: {
        maxLength: 2200,
        format: 'caption',
        adapt: (content) => ({
          caption: `${content.hook}\n\n${content.body.map(s => s.content).join('\n\n')}\n\n${content.cta}`,
          hashtags: ['#content', '#marketing', '#growth']
        })
      },
      youtube: {
        format: 'script',
        adapt: (content) => ({
          title: content.headline,
          description: content.hook,
          script: {
            intro: content.hook,
            sections: content.body,
            outro: content.cta
          }
        })
      }
    };

    const adapter = adaptations[platform];
    return adapter ? adapter.adapt(mainContent) : mainContent;
  }

  async createCampaign(spec) {
    const campaignId = `campaign_${Date.now()}`;

    const campaign = {
      id: campaignId,
      name: spec.name,
      goal: spec.goal,
      audience: spec.audience,
      duration: spec.duration,
      content: [],
      schedule: [],
      status: 'planning',
      metrics: { impressions: 0, engagement: 0, conversions: 0 },
      createdAt: Date.now()
    };

    this.campaigns.set(campaignId, campaign);

    // Generate campaign content
    for (const contentSpec of spec.contentPlan || []) {
      const content = await this.createContent(contentSpec);
      campaign.content.push(content.id);
    }

    campaign.status = 'ready';
    this.emit('campaign:created', { campaignId, campaign });

    return campaign;
  }

  async repurposeContent(contentId, targetPlatforms) {
    const original = this.content.get(contentId);
    if (!original) throw new Error('Content not found');

    const repurposed = [];

    for (const platform of targetPlatforms) {
      const adapted = await this.adaptForPlatform(original.main, platform);
      repurposed.push({
        originalId: contentId,
        platform,
        content: adapted,
        generatedAt: Date.now()
      });
    }

    return repurposed;
  }

  async generateContentCalendar(spec) {
    const calendar = {
      startDate: spec.startDate || Date.now(),
      endDate: spec.endDate,
      frequency: spec.frequency || 'daily',
      platforms: spec.platforms || ['twitter', 'linkedin'],
      topics: spec.topics || [],
      schedule: []
    };

    // Generate schedule
    let currentDate = new Date(calendar.startDate);
    const endDate = new Date(calendar.endDate || Date.now() + 30 * 24 * 60 * 60 * 1000);

    while (currentDate <= endDate) {
      calendar.schedule.push({
        date: currentDate.toISOString(),
        platform: calendar.platforms[calendar.schedule.length % calendar.platforms.length],
        topic: calendar.topics[calendar.schedule.length % (calendar.topics.length || 1)] || 'General',
        status: 'planned'
      });

      currentDate.setDate(currentDate.getDate() + (calendar.frequency === 'daily' ? 1 : 7));
    }

    return calendar;
  }

  getContent(contentId) {
    return this.content.get(contentId);
  }

  getCampaign(campaignId) {
    return this.campaigns.get(campaignId);
  }
}

module.exports = { EchoEngine, CONTENT_TYPES, TONES, FRAMEWORKS };
