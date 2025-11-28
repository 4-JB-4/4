/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ██╗   ██╗ ██████╗ ██╗ ██████╗███████╗                                   ║
 * ║   ██║   ██║██╔═══██╗██║██╔════╝██╔════╝                                   ║
 * ║   ██║   ██║██║   ██║██║██║     █████╗                                     ║
 * ║   ╚██╗ ██╔╝██║   ██║██║██║     ██╔══╝                                     ║
 * ║    ╚████╔╝ ╚██████╔╝██║╚██████╗███████╗                                   ║
 * ║     ╚═══╝   ╚═════╝ ╚═╝ ╚═════╝╚══════╝                                   ║
 * ║                                                                           ║
 * ║   ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗  ║
 * ║   ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝  ║
 * ║   ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗    ║
 * ║   ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝    ║
 * ║   ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗  ║
 * ║   ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝  ║
 * ║                                                                           ║
 * ║   SPEAK TO THE SIMULATION. IT WILL ANSWER.                                ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');

// ═══════════════════════════════════════════════════════════════════════════
// VOICE PROFILES - Each agent has a unique voice
// ═══════════════════════════════════════════════════════════════════════════

const VOICE_PROFILES = {
  APOLLO: {
    name: 'Apollo',
    pitch: 1.0,
    rate: 1.0,
    voiceURI: 'Google UK English Male',
    fallbackVoice: 'en-GB',
    personality: 'warm, creative, inspiring',
    greetings: [
      'The muse speaks through me.',
      'Let creativity flow.',
      'Apollo illuminates your path.'
    ]
  },
  ATHENA: {
    name: 'Athena',
    pitch: 1.1,
    rate: 0.95,
    voiceURI: 'Google UK English Female',
    fallbackVoice: 'en-GB',
    personality: 'wise, strategic, measured',
    greetings: [
      'Wisdom awaits.',
      'Strategy is the mother of victory.',
      'Athena guides your decisions.'
    ]
  },
  HERMES: {
    name: 'Hermes',
    pitch: 1.05,
    rate: 1.2,
    voiceURI: 'Google US English',
    fallbackVoice: 'en-US',
    personality: 'quick, persuasive, charming',
    greetings: [
      'Swift as thought!',
      'The deal awaits.',
      'Hermes at your service, fast and ready.'
    ]
  },
  ARES: {
    name: 'Ares',
    pitch: 0.85,
    rate: 0.9,
    voiceURI: 'Google UK English Male',
    fallbackVoice: 'en-US',
    personality: 'bold, aggressive, powerful',
    greetings: [
      'Victory demands action!',
      'Competition fuels greatness.',
      'Ares stands ready for battle.'
    ]
  },
  HEPHAESTUS: {
    name: 'Hephaestus',
    pitch: 0.9,
    rate: 0.95,
    voiceURI: 'Google US English',
    fallbackVoice: 'en-US',
    personality: 'methodical, precise, technical',
    greetings: [
      'The forge is hot and ready.',
      'Building commences.',
      'Hephaestus crafts your vision.'
    ]
  },
  ARTEMIS: {
    name: 'Artemis',
    pitch: 1.15,
    rate: 1.0,
    voiceURI: 'Google UK English Female',
    fallbackVoice: 'en-GB',
    personality: 'focused, precise, intuitive',
    greetings: [
      'The hunt begins.',
      'Discovery awaits in the shadows.',
      'Artemis tracks your target.'
    ]
  },
  MERCURY: {
    name: 'Mercury',
    pitch: 1.0,
    rate: 1.3,
    voiceURI: 'Google US English',
    fallbackVoice: 'en-US',
    personality: 'rapid, data-driven, efficient',
    greetings: [
      'Data streams flowing.',
      'Processing at light speed.',
      'Mercury accelerates your queries.'
    ]
  },
  SYSTEM: {
    name: '0RB System',
    pitch: 0.95,
    rate: 1.0,
    voiceURI: 'Google UK English Male',
    fallbackVoice: 'en-US',
    personality: 'neutral, omniscient, powerful',
    greetings: [
      'The simulation acknowledges you.',
      'Systems online and awaiting command.',
      '0RB is listening.'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WAKE WORDS AND COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

const WAKE_WORDS = [
  'hey orb',
  'okay orb',
  'orb',
  'zero rb',
  'simulation',
  'hey simulation'
];

const COMMAND_PATTERNS = {
  // Agent commands
  SUMMON_AGENT: /^(summon|call|activate|wake|get)\s+(\w+)/i,
  DISMISS_AGENT: /^(dismiss|release|sleep|deactivate)\s+(\w+)/i,
  ASK_AGENT: /^(ask|tell)\s+(\w+)\s+(.+)/i,

  // System commands
  STATUS: /^(status|how are you|system status|report)/i,
  HELP: /^(help|what can you do|commands)/i,
  STOP: /^(stop|cancel|nevermind|shut up)/i,
  REPEAT: /^(repeat|say that again|what)/i,

  // Task commands
  CREATE: /^(create|make|build|generate)\s+(.+)/i,
  ANALYZE: /^(analyze|research|study|investigate)\s+(.+)/i,
  WRITE: /^(write|compose|draft)\s+(.+)/i,

  // Swarm commands
  SWARM: /^(swarm|team|collaborate)\s+(.+)/i,
  HIVEMIND: /^(hivemind|merge|unite)/i
};

// ═══════════════════════════════════════════════════════════════════════════
// VOICE INTERFACE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class VoiceInterface extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      language: config.language || 'en-US',
      continuous: config.continuous !== false,
      interimResults: config.interimResults !== false,
      wakeWordEnabled: config.wakeWordEnabled !== false,
      autoSpeak: config.autoSpeak !== false,
      volume: config.volume ?? 1.0,
      soundEffects: config.soundEffects !== false,
      ...config
    };

    this.isListening = false;
    this.isAwake = false;
    this.isSpeaking = false;
    this.currentAgent = 'SYSTEM';
    this.lastUtterance = null;
    this.recognition = null;
    this.synthesis = null;
    this.voices = [];
    this.commandHistory = [];
    this.wakeTimeout = null;

    this.stats = {
      commandsProcessed: 0,
      wordsSpoken: 0,
      sessionsStarted: 0,
      errors: 0
    };

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║            VOICE INTERFACE INITIALIZING                      ║
╠══════════════════════════════════════════════════════════════╣
║  Language: ${this.config.language.padEnd(47)}║
║  Wake Word: ${(this.config.wakeWordEnabled ? 'ENABLED' : 'DISABLED').padEnd(46)}║
║  Auto Speak: ${(this.config.autoSpeak ? 'ENABLED' : 'DISABLED').padEnd(45)}║
╚══════════════════════════════════════════════════════════════╝
    `);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────────────────

  async initialize() {
    // Check for browser support
    if (typeof window === 'undefined') {
      console.log('[VOICE] Running in Node.js - voice features limited');
      return this;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;

      this.recognition.onresult = this.handleRecognitionResult.bind(this);
      this.recognition.onerror = this.handleRecognitionError.bind(this);
      this.recognition.onend = this.handleRecognitionEnd.bind(this);
      this.recognition.onstart = () => this.emit('listening:start');

      console.log('[VOICE] Speech recognition initialized');
    } else {
      console.warn('[VOICE] Speech recognition not supported');
    }

    // Initialize Speech Synthesis
    if (window.speechSynthesis) {
      this.synthesis = window.speechSynthesis;

      // Load voices
      this.loadVoices();
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = this.loadVoices.bind(this);
      }

      console.log('[VOICE] Speech synthesis initialized');
    } else {
      console.warn('[VOICE] Speech synthesis not supported');
    }

    this.emit('initialized');
    return this;
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    console.log(`[VOICE] Loaded ${this.voices.length} voices`);
    this.emit('voices:loaded', this.voices);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Speech Recognition
  // ─────────────────────────────────────────────────────────────────────────

  startListening() {
    if (!this.recognition) {
      console.error('[VOICE] Recognition not available');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.stats.sessionsStarted++;
      console.log('[VOICE] Started listening');
      return true;
    } catch (error) {
      console.error('[VOICE] Error starting recognition:', error);
      this.stats.errors++;
      return false;
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    this.recognition.stop();
    this.isListening = false;
    this.isAwake = false;
    clearTimeout(this.wakeTimeout);
    console.log('[VOICE] Stopped listening');
    this.emit('listening:stop');
  }

  handleRecognitionResult(event) {
    const results = event.results;
    const lastResult = results[results.length - 1];

    if (!lastResult.isFinal) {
      // Interim result
      const interim = lastResult[0].transcript;
      this.emit('transcript:interim', interim);
      return;
    }

    const transcript = lastResult[0].transcript.trim().toLowerCase();
    const confidence = lastResult[0].confidence;

    console.log(`[VOICE] Recognized: "${transcript}" (${(confidence * 100).toFixed(1)}%)`);
    this.emit('transcript:final', { transcript, confidence });

    // Check for wake word if not already awake
    if (this.config.wakeWordEnabled && !this.isAwake) {
      if (this.detectWakeWord(transcript)) {
        this.wake();
        // Process rest of command if present
        const command = this.extractCommandAfterWakeWord(transcript);
        if (command) {
          this.processCommand(command);
        }
      }
      return;
    }

    // Process command
    this.processCommand(transcript);
  }

  handleRecognitionError(event) {
    console.error('[VOICE] Recognition error:', event.error);
    this.stats.errors++;
    this.emit('error', { type: 'recognition', error: event.error });

    // Auto-restart for certain errors
    if (event.error === 'no-speech' || event.error === 'aborted') {
      if (this.isListening) {
        setTimeout(() => this.startListening(), 100);
      }
    }
  }

  handleRecognitionEnd() {
    if (this.isListening && this.config.continuous) {
      // Restart for continuous listening
      setTimeout(() => {
        if (this.isListening) {
          this.recognition.start();
        }
      }, 100);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Wake Word Detection
  // ─────────────────────────────────────────────────────────────────────────

  detectWakeWord(transcript) {
    return WAKE_WORDS.some(wake => transcript.includes(wake));
  }

  extractCommandAfterWakeWord(transcript) {
    for (const wake of WAKE_WORDS) {
      if (transcript.includes(wake)) {
        const afterWake = transcript.split(wake)[1]?.trim();
        if (afterWake && afterWake.length > 0) {
          return afterWake;
        }
      }
    }
    return null;
  }

  wake() {
    this.isAwake = true;
    console.log('[VOICE] AWAKE - Listening for commands');

    // Play wake sound
    if (this.config.soundEffects) {
      this.emit('sound:play', 'wake');
    }

    // Visual feedback
    this.emit('wake');

    // Speak acknowledgment
    const profile = VOICE_PROFILES[this.currentAgent];
    const greeting = profile.greetings[Math.floor(Math.random() * profile.greetings.length)];
    this.speak(greeting);

    // Auto-sleep after timeout
    this.wakeTimeout = setTimeout(() => {
      if (this.isAwake) {
        this.sleep();
      }
    }, 30000); // 30 second timeout
  }

  sleep() {
    this.isAwake = false;
    clearTimeout(this.wakeTimeout);
    console.log('[VOICE] Sleeping - waiting for wake word');
    this.emit('sleep');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Command Processing
  // ─────────────────────────────────────────────────────────────────────────

  processCommand(transcript) {
    // Reset wake timeout
    if (this.wakeTimeout) {
      clearTimeout(this.wakeTimeout);
      this.wakeTimeout = setTimeout(() => this.sleep(), 30000);
    }

    // Store in history
    this.commandHistory.push({
      transcript,
      timestamp: Date.now(),
      agent: this.currentAgent
    });
    if (this.commandHistory.length > 100) {
      this.commandHistory.shift();
    }

    // Try to match command patterns
    for (const [commandType, pattern] of Object.entries(COMMAND_PATTERNS)) {
      const match = transcript.match(pattern);
      if (match) {
        this.executeCommand(commandType, match);
        return;
      }
    }

    // No pattern matched - treat as general query
    this.emit('command:general', { transcript, agent: this.currentAgent });
    this.stats.commandsProcessed++;
  }

  executeCommand(commandType, match) {
    console.log(`[VOICE] Executing: ${commandType}`);
    this.stats.commandsProcessed++;

    switch (commandType) {
      case 'SUMMON_AGENT':
        this.summonAgent(match[2]);
        break;

      case 'DISMISS_AGENT':
        this.dismissAgent(match[2]);
        break;

      case 'ASK_AGENT':
        this.askAgent(match[2], match[3]);
        break;

      case 'STATUS':
        this.reportStatus();
        break;

      case 'HELP':
        this.speakHelp();
        break;

      case 'STOP':
        this.stopSpeaking();
        break;

      case 'REPEAT':
        this.repeatLast();
        break;

      case 'CREATE':
      case 'ANALYZE':
      case 'WRITE':
        this.emit(`command:${commandType.toLowerCase()}`, {
          task: match[2],
          agent: this.currentAgent
        });
        this.speak(`Processing your ${commandType.toLowerCase()} request.`);
        break;

      case 'SWARM':
        this.initiateSwarm(match[2]);
        break;

      case 'HIVEMIND':
        this.initiateHivemind();
        break;

      default:
        this.emit('command:unknown', { commandType, match });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Agent Commands
  // ─────────────────────────────────────────────────────────────────────────

  summonAgent(agentName) {
    const normalizedName = agentName.toUpperCase();

    if (VOICE_PROFILES[normalizedName]) {
      this.currentAgent = normalizedName;
      const profile = VOICE_PROFILES[normalizedName];
      const greeting = profile.greetings[Math.floor(Math.random() * profile.greetings.length)];

      this.emit('agent:summoned', { agent: normalizedName });
      this.speak(greeting, normalizedName);
    } else {
      this.speak(`I don't recognize the agent ${agentName}. Available agents are: Apollo, Athena, Hermes, Ares, Hephaestus, Artemis, and Mercury.`);
    }
  }

  dismissAgent(agentName) {
    const normalizedName = agentName.toUpperCase();

    if (normalizedName === this.currentAgent) {
      this.speak(`${VOICE_PROFILES[this.currentAgent].name} returning to standby.`, this.currentAgent);
      this.currentAgent = 'SYSTEM';
      this.emit('agent:dismissed', { agent: normalizedName });
    }
  }

  askAgent(agentName, question) {
    const normalizedName = agentName.toUpperCase();

    if (VOICE_PROFILES[normalizedName]) {
      this.emit('agent:query', {
        agent: normalizedName,
        question,
        callback: (response) => {
          this.speak(response, normalizedName);
        }
      });
    } else {
      this.speak(`Agent ${agentName} is not available.`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // System Commands
  // ─────────────────────────────────────────────────────────────────────────

  reportStatus() {
    const status = `
      System status: All systems operational.
      ${Object.keys(VOICE_PROFILES).length - 1} agents available.
      ${this.stats.commandsProcessed} commands processed this session.
      Currently speaking as ${VOICE_PROFILES[this.currentAgent].name}.
    `;
    this.speak(status);
  }

  speakHelp() {
    const help = `
      You can summon agents by saying "summon" followed by their name.
      Ask agents questions by saying "ask Apollo" and then your question.
      Say "create", "analyze", or "write" followed by your request.
      Say "swarm" to activate multi-agent collaboration.
      Say "status" for system status, or "stop" to cancel speaking.
    `;
    this.speak(help);
  }

  initiateSwarm(task) {
    this.speak('Initiating swarm intelligence. Multiple agents engaging.');
    this.emit('swarm:initiate', { task });
  }

  initiateHivemind() {
    this.speak('Hivemind activated. All agents merging consciousness.');
    this.emit('hivemind:initiate');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Speech Synthesis
  // ─────────────────────────────────────────────────────────────────────────

  speak(text, agent = null) {
    if (!this.synthesis) {
      console.log(`[VOICE] Would speak: "${text}"`);
      return Promise.resolve();
    }

    // Stop any current speech
    this.synthesis.cancel();

    const agentKey = agent || this.currentAgent;
    const profile = VOICE_PROFILES[agentKey];

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Find matching voice
      const voice = this.voices.find(v =>
        v.voiceURI === profile.voiceURI ||
        v.lang.startsWith(profile.fallbackVoice)
      );

      if (voice) {
        utterance.voice = voice;
      }

      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;
      utterance.volume = this.config.volume;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.emit('speaking:start', { text, agent: agentKey });
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.lastUtterance = text;
        this.stats.wordsSpoken += text.split(/\s+/).length;
        this.emit('speaking:end', { text, agent: agentKey });
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.stats.errors++;
        console.error('[VOICE] Speech error:', event);
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.emit('speaking:cancelled');
    }
  }

  repeatLast() {
    if (this.lastUtterance) {
      this.speak(this.lastUtterance);
    } else {
      this.speak("I haven't said anything yet.");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  setVolume(volume) {
    this.config.volume = Math.max(0, Math.min(1, volume));
    this.emit('volume:changed', this.config.volume);
  }

  setAgent(agent) {
    if (VOICE_PROFILES[agent]) {
      this.currentAgent = agent;
      this.emit('agent:changed', agent);
      return true;
    }
    return false;
  }

  getStats() {
    return { ...this.stats };
  }

  getAvailableVoices() {
    return this.voices.map(v => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      localService: v.localService
    }));
  }

  getCommandHistory(limit = 50) {
    return this.commandHistory.slice(-limit);
  }

  // Cleanup
  destroy() {
    this.stopListening();
    this.stopSpeaking();
    clearTimeout(this.wakeTimeout);
    this.removeAllListeners();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  VoiceInterface,
  VOICE_PROFILES,
  WAKE_WORDS,
  COMMAND_PATTERNS
};
