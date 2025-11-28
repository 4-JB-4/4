/**
 * 0RB SYSTEM - Sales Engine
 * Get money. Fast.
 */

// ═══════════════════════════════════════════════════════════════
// PRODUCT OFFERINGS - What you're selling
// ═══════════════════════════════════════════════════════════════

const PRODUCTS = {
  // Entry level - get them in the door
  COPA_SIDEKICK: {
    name: 'Copa Sidekick',
    price: 99,
    period: 'month',
    pitch: 'AI copilot for your specific industry. 10x your output.',
    verticals: ['Legal', 'Medical', 'Sales', 'Finance', 'Creative', 'Code', 'Support', 'HR', 'Ops', 'Executive'],
    close: 'Which vertical are you in? I\'ll show you exactly how it works for YOUR workflow.'
  },

  // Mid-tier - serious buyers
  ORB_PRO: {
    name: '0RB Pro',
    price: 299,
    period: 'month',
    pitch: 'Full access to all 7 game engines + agent team. Build anything.',
    includes: ['All Game Engines', 'Agent Pantheon', 'Priority Support', 'Custom Workflows'],
    close: 'What\'s the ONE thing that would 10x your business if you could automate it?'
  },

  // Enterprise - big fish
  ENTERPRISE: {
    name: '0RB Enterprise',
    price: 'Custom',
    period: 'year',
    pitch: 'White-label the entire system. Your brand, our AI.',
    includes: ['Full White Label', 'Custom Agents', 'Dedicated Support', 'Revenue Share Option'],
    close: 'How much are you spending on AI tools right now? We can consolidate everything.'
  },

  // One-time - quick wins
  SETUP_SERVICE: {
    name: 'Done-For-You Setup',
    price: 499,
    period: 'one-time',
    pitch: 'We set up your entire AI workflow in 48 hours.',
    includes: ['Custom Agent Config', 'Workflow Design', 'Training Session', '30-Day Support'],
    close: 'Want us to just do it for you? 48 hours, you\'re live.'
  }
};

// ═══════════════════════════════════════════════════════════════
// SALES SCRIPTS - Copy-paste ready
// ═══════════════════════════════════════════════════════════════

const SCRIPTS = {
  cold_call: {
    opener: `Hey [NAME], quick question - are you using any AI tools to automate [THEIR INDUSTRY] work right now?`,

    pivot_yes: `Cool, how's that working? Most people tell me they're using 5-6 different tools and it's a mess. We built something that consolidates all of it.`,

    pivot_no: `Perfect timing then. We built an AI system specifically for [INDUSTRY]. Takes about 10 minutes to show you. Worth a look?`,

    objection_busy: `Totally get it. Quick question though - if I could show you how to save 10+ hours a week, would that be worth 10 minutes?`,

    objection_cost: `Fair. What's your time worth per hour? Because this saves most people 10-20 hours a week. Do the math.`,

    close: `Here's what I can do - I'll give you a free trial. Use it for a week. If it doesn't save you at least 5 hours, don't pay. Fair?`
  },

  linkedin_dm: {
    connect: `Hey [NAME] - saw you're in [INDUSTRY]. We built an AI copilot specifically for that. Thought you might find it interesting.`,

    followup: `Quick question - what's the most tedious part of your workflow right now? The repetitive stuff that eats up your day?`,

    pitch: `We automated exactly that for [SIMILAR COMPANY]. They went from 40 hours/week to 15 on [TASK]. Want me to show you how?`,

    close: `I can do a quick 10-min demo this week. When works better - [DAY1] or [DAY2]?`
  },

  email: {
    subject: `[NAME], quick question about [INDUSTRY]`,

    body: `Hey [NAME],

Saw you're running [COMPANY]. Quick question:

How much time do you spend on [COMMON PAIN POINT] each week?

We built an AI system that automates that. One of our [INDUSTRY] clients went from 30 hours/week to 5.

Worth a 10-minute call to see if it fits your workflow?

[YOUR NAME]
P.S. - Free trial, no commitment. Just want to show you what's possible.`
  }
};

// ═══════════════════════════════════════════════════════════════
// LEAD SOURCES - Where to find buyers
// ═══════════════════════════════════════════════════════════════

const LEAD_SOURCES = {
  immediate: [
    { source: 'LinkedIn Sales Navigator', action: 'Search "[INDUSTRY] + founder/CEO/owner"', volume: '50/day' },
    { source: 'Apollo.io', action: 'Export verified emails by industry', volume: '100/day' },
    { source: 'Twitter/X', action: 'Search people complaining about manual work', volume: '20/day' },
    { source: 'Reddit', action: 'r/smallbusiness, r/entrepreneur - offer help', volume: '10/day' },
    { source: 'Facebook Groups', action: 'Industry-specific groups, provide value first', volume: '10/day' }
  ],

  warm: [
    { source: 'Referrals', action: 'Ask every customer for 3 intros', conversion: '30%+' },
    { source: 'Past clients', action: 'Reach out to anyone you\'ve worked with', conversion: '20%+' },
    { source: 'Network', action: 'Post what you\'re building, ask who needs it', conversion: '15%+' }
  ]
};

// ═══════════════════════════════════════════════════════════════
// DAILY SALES ROUTINE - Do this every day
// ═══════════════════════════════════════════════════════════════

const DAILY_ROUTINE = {
  morning: [
    '9:00 AM - Send 20 LinkedIn connection requests with personalized notes',
    '9:30 AM - Follow up with yesterday\'s connections',
    '10:00 AM - Make 10 cold calls (use script above)',
    '11:00 AM - Send 20 cold emails'
  ],

  afternoon: [
    '1:00 PM - Demo calls (book these from morning outreach)',
    '3:00 PM - Follow up on pending deals',
    '4:00 PM - Engage on social (provide value, soft pitch)',
    '5:00 PM - Plan tomorrow\'s outreach list'
  ],

  metrics: {
    daily_outreach: 50,
    expected_responses: 5,
    expected_demos: 2,
    expected_closes: 0.5,
    monthly_closes: 10,
    at_299_per_month: '$2,990 MRR'
  }
};

// ═══════════════════════════════════════════════════════════════
// QUICK START - Do this TODAY
// ═══════════════════════════════════════════════════════════════

const QUICK_START = `
TODAY'S ACTION PLAN:

1. Pick ONE industry vertical you know best
2. Find 20 people in that industry on LinkedIn
3. Send this message to all 20:

   "Hey [NAME] - saw you're in [INDUSTRY].
   We built an AI that automates [PAIN POINT].
   Worth a 10-min call this week?"

4. For anyone who responds, book a demo
5. On the demo, show the 0RB system
6. Close with: "Free trial for a week. $99/month after if you love it."

THAT'S IT. Do this every day = money.
`;

module.exports = {
  PRODUCTS,
  SCRIPTS,
  LEAD_SOURCES,
  DAILY_ROUTINE,
  QUICK_START
};
