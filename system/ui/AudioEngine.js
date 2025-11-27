/**
 * 0RB SYSTEM - AUDIO ENGINE
 * "NBA YoungBoy bumpin as it loads"
 *
 * Immersive audio for the simulation experience.
 * Boot sequences, transitions, agent sounds, ambient vibes.
 */

const { EventEmitter } = require('events');

// ═══════════════════════════════════════════════════════════════
// AUDIO CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const AUDIO_CONFIG = {
  masterVolume: 0.7,
  categories: {
    BOOT: { volume: 0.8, priority: 10 },
    AMBIENT: { volume: 0.3, priority: 1 },
    UI: { volume: 0.5, priority: 5 },
    AGENT: { volume: 0.6, priority: 7 },
    MUSIC: { volume: 0.6, priority: 3 },
    NOTIFICATION: { volume: 0.7, priority: 8 }
  }
};

// ═══════════════════════════════════════════════════════════════
// SOUND LIBRARY
// ═══════════════════════════════════════════════════════════════

const SOUND_LIBRARY = {
  // Boot sequence sounds
  BOOT: {
    startup: {
      name: 'System Startup',
      file: 'boot/startup.mp3',
      duration: 3000,
      description: 'Deep bass hit with ascending synth - THE AWAKENING'
    },
    phase_complete: {
      name: 'Phase Complete',
      file: 'boot/phase_complete.mp3',
      duration: 500,
      description: 'Clean digital chime'
    },
    system_ready: {
      name: 'System Ready',
      file: 'boot/system_ready.mp3',
      duration: 2000,
      description: 'Triumphant synth flourish'
    },
    orb_pulse: {
      name: 'Orb Pulse',
      file: 'boot/orb_pulse.mp3',
      duration: 800,
      description: 'Deep resonant pulse'
    }
  },

  // UI interaction sounds
  UI: {
    click: {
      name: 'Click',
      file: 'ui/click.mp3',
      duration: 100,
      description: 'Soft click'
    },
    hover: {
      name: 'Hover',
      file: 'ui/hover.mp3',
      duration: 50,
      description: 'Subtle hover tone'
    },
    select: {
      name: 'Select',
      file: 'ui/select.mp3',
      duration: 200,
      description: 'Confirmation tone'
    },
    back: {
      name: 'Back',
      file: 'ui/back.mp3',
      duration: 150,
      description: 'Soft back swoosh'
    },
    error: {
      name: 'Error',
      file: 'ui/error.mp3',
      duration: 300,
      description: 'Low error buzz'
    },
    success: {
      name: 'Success',
      file: 'ui/success.mp3',
      duration: 400,
      description: 'Bright success chime'
    },
    typing: {
      name: 'Typing',
      file: 'ui/typing.mp3',
      duration: 50,
      description: 'Soft key press'
    }
  },

  // Agent sounds
  AGENT: {
    summon: {
      name: 'Agent Summon',
      file: 'agent/summon.mp3',
      duration: 1500,
      description: 'Ethereal summoning sound with energy buildup'
    },
    speak: {
      name: 'Agent Speak',
      file: 'agent/speak.mp3',
      duration: 100,
      description: 'Subtle voice activation'
    },
    complete: {
      name: 'Task Complete',
      file: 'agent/complete.mp3',
      duration: 600,
      description: 'Satisfying completion tone'
    },
    thinking: {
      name: 'Agent Thinking',
      file: 'agent/thinking.mp3',
      duration: 2000,
      loop: true,
      description: 'Soft processing hum'
    },
    hivemind: {
      name: 'Hivemind Merge',
      file: 'agent/hivemind.mp3',
      duration: 3000,
      description: 'Epic merge sound with multiple tones combining'
    }
  },

  // Game sounds
  GAME: {
    launch: {
      name: 'Game Launch',
      file: 'game/launch.mp3',
      duration: 1000,
      description: 'Game startup sequence'
    },
    achievement: {
      name: 'Achievement',
      file: 'game/achievement.mp3',
      duration: 1500,
      description: 'Epic achievement unlock'
    },
    level_up: {
      name: 'Level Up',
      file: 'game/level_up.mp3',
      duration: 2000,
      description: 'Triumphant level up fanfare'
    },
    save: {
      name: 'Save',
      file: 'game/save.mp3',
      duration: 500,
      description: 'Save confirmation'
    }
  },

  // Notification sounds
  NOTIFICATION: {
    message: {
      name: 'New Message',
      file: 'notification/message.mp3',
      duration: 400,
      description: 'Notification ping'
    },
    alert: {
      name: 'Alert',
      file: 'notification/alert.mp3',
      duration: 600,
      description: 'Important alert tone'
    },
    reward: {
      name: 'Reward',
      file: 'notification/reward.mp3',
      duration: 1000,
      description: 'Reward received jingle'
    }
  },

  // Ambient/Music
  AMBIENT: {
    simulation_hum: {
      name: 'Simulation Hum',
      file: 'ambient/simulation_hum.mp3',
      duration: 60000,
      loop: true,
      description: 'Deep ambient drone - the simulation running'
    },
    consciousness_flow: {
      name: 'Consciousness Flow',
      file: 'ambient/consciousness_flow.mp3',
      duration: 120000,
      loop: true,
      description: 'Flowing ambient soundscape'
    },
    digital_rain: {
      name: 'Digital Rain',
      file: 'ambient/digital_rain.mp3',
      duration: 90000,
      loop: true,
      description: 'Matrix-style digital ambience'
    }
  },

  // Music tracks (placeholders for licensed music)
  MUSIC: {
    boot_theme: {
      name: 'Boot Theme',
      file: 'music/boot_theme.mp3',
      duration: 180000,
      loop: false,
      description: 'Epic boot sequence music - trap/electronic hybrid'
    },
    main_menu: {
      name: 'Main Menu',
      file: 'music/main_menu.mp3',
      duration: 240000,
      loop: true,
      description: 'Chill but energetic menu music'
    },
    build_mode: {
      name: 'Build Mode',
      file: 'music/build_mode.mp3',
      duration: 300000,
      loop: true,
      description: 'Focus-enhancing creation music'
    },
    victory: {
      name: 'Victory',
      file: 'music/victory.mp3',
      duration: 30000,
      loop: false,
      description: 'Triumphant victory theme'
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// AUDIO CHANNEL CLASS
// ═══════════════════════════════════════════════════════════════

class AudioChannel {
  constructor(name, config) {
    this.name = name;
    this.volume = config.volume || 1;
    this.priority = config.priority || 5;
    this.currentSound = null;
    this.queue = [];
    this.muted = false;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }

  getEffectiveVolume(masterVolume) {
    return this.muted ? 0 : this.volume * masterVolume;
  }
}

// ═══════════════════════════════════════════════════════════════
// AUDIO ENGINE CLASS
// ═══════════════════════════════════════════════════════════════

class AudioEngine extends EventEmitter {
  constructor() {
    super();
    this.config = AUDIO_CONFIG;
    this.library = SOUND_LIBRARY;
    this.channels = new Map();
    this.masterVolume = AUDIO_CONFIG.masterVolume;
    this.muted = false;
    this.currentMusic = null;
    this.ambientLayers = new Map();
    this.initialized = false;

    // Initialize channels
    Object.entries(AUDIO_CONFIG.categories).forEach(([name, config]) => {
      this.channels.set(name, new AudioChannel(name, config));
    });
  }

  // ═══════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Initialize the audio engine
   */
  async initialize() {
    console.log('[AUDIO] Initializing audio engine...');

    // In browser, we'd create AudioContext here
    // For Node.js backend, we prepare the sound metadata

    this.initialized = true;

    this.emit('audio:initialized');
    console.log('[AUDIO] Audio engine ready');

    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // PLAYBACK
  // ═══════════════════════════════════════════════════════════

  /**
   * Play a sound
   */
  play(category, soundName, options = {}) {
    if (!this.initialized) {
      console.warn('[AUDIO] Engine not initialized');
      return null;
    }

    const sound = this.library[category]?.[soundName];
    if (!sound) {
      console.warn(`[AUDIO] Sound not found: ${category}/${soundName}`);
      return null;
    }

    const channel = this.channels.get(category);
    const volume = channel ? channel.getEffectiveVolume(this.masterVolume) : this.masterVolume;

    const playback = {
      id: `play-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      sound: soundName,
      soundData: sound,
      volume: options.volume !== undefined ? options.volume * volume : volume,
      loop: options.loop !== undefined ? options.loop : sound.loop || false,
      startTime: Date.now(),
      status: 'PLAYING'
    };

    console.log(`[AUDIO] Playing: ${sound.name} (${category})`);

    this.emit('sound:play', playback);

    // Auto-stop non-looping sounds
    if (!playback.loop) {
      setTimeout(() => {
        playback.status = 'ENDED';
        this.emit('sound:end', playback);
      }, sound.duration);
    }

    return playback;
  }

  /**
   * Play boot sequence audio
   */
  async playBootSequence() {
    console.log('[AUDIO] Starting boot sequence audio...');

    // Startup sound
    this.play('BOOT', 'startup');

    // Start ambient layer
    await this.delay(1000);
    this.startAmbient('simulation_hum');

    // Boot theme music (if NBA YoungBoy vibes loaded)
    await this.delay(500);
    this.playMusic('boot_theme');

    return true;
  }

  /**
   * Play phase transition sound
   */
  playPhaseComplete() {
    return this.play('BOOT', 'phase_complete');
  }

  /**
   * Play system ready sound
   */
  playSystemReady() {
    this.stopAmbient('simulation_hum');
    this.play('BOOT', 'system_ready');
    this.playMusic('main_menu', { fadeIn: 2000 });
  }

  // ═══════════════════════════════════════════════════════════
  // MUSIC CONTROL
  // ═══════════════════════════════════════════════════════════

  /**
   * Play music track
   */
  playMusic(trackName, options = {}) {
    const track = this.library.MUSIC?.[trackName];
    if (!track) {
      console.warn(`[AUDIO] Music track not found: ${trackName}`);
      return null;
    }

    // Stop current music
    if (this.currentMusic) {
      this.stopMusic(options.fadeOut || 1000);
    }

    const musicChannel = this.channels.get('MUSIC');
    const volume = musicChannel ? musicChannel.getEffectiveVolume(this.masterVolume) : this.masterVolume;

    this.currentMusic = {
      id: `music-${Date.now()}`,
      track: trackName,
      trackData: track,
      volume,
      startTime: Date.now(),
      status: 'PLAYING'
    };

    console.log(`[AUDIO] Playing music: ${track.name}`);

    this.emit('music:play', this.currentMusic);

    return this.currentMusic;
  }

  /**
   * Stop current music
   */
  stopMusic(fadeOutMs = 1000) {
    if (this.currentMusic) {
      console.log(`[AUDIO] Stopping music: ${this.currentMusic.trackData.name}`);
      this.currentMusic.status = 'STOPPING';
      this.emit('music:stop', { fadeOut: fadeOutMs });

      setTimeout(() => {
        this.currentMusic = null;
      }, fadeOutMs);
    }
  }

  /**
   * Pause music
   */
  pauseMusic() {
    if (this.currentMusic && this.currentMusic.status === 'PLAYING') {
      this.currentMusic.status = 'PAUSED';
      this.emit('music:pause');
    }
  }

  /**
   * Resume music
   */
  resumeMusic() {
    if (this.currentMusic && this.currentMusic.status === 'PAUSED') {
      this.currentMusic.status = 'PLAYING';
      this.emit('music:resume');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // AMBIENT LAYERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Start an ambient layer
   */
  startAmbient(ambientName) {
    const ambient = this.library.AMBIENT?.[ambientName];
    if (!ambient) {
      console.warn(`[AUDIO] Ambient not found: ${ambientName}`);
      return null;
    }

    const layer = {
      id: `ambient-${Date.now()}`,
      name: ambientName,
      data: ambient,
      startTime: Date.now(),
      status: 'PLAYING'
    };

    this.ambientLayers.set(ambientName, layer);

    console.log(`[AUDIO] Starting ambient: ${ambient.name}`);

    this.emit('ambient:start', layer);

    return layer;
  }

  /**
   * Stop an ambient layer
   */
  stopAmbient(ambientName, fadeOutMs = 2000) {
    const layer = this.ambientLayers.get(ambientName);
    if (layer) {
      layer.status = 'STOPPING';
      this.emit('ambient:stop', { name: ambientName, fadeOut: fadeOutMs });

      setTimeout(() => {
        this.ambientLayers.delete(ambientName);
      }, fadeOutMs);
    }
  }

  /**
   * Stop all ambient layers
   */
  stopAllAmbient(fadeOutMs = 2000) {
    this.ambientLayers.forEach((layer, name) => {
      this.stopAmbient(name, fadeOutMs);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // AGENT SOUNDS
  // ═══════════════════════════════════════════════════════════

  /**
   * Play agent summon sound
   */
  playAgentSummon(agentType) {
    console.log(`[AUDIO] Agent summoning: ${agentType}`);
    return this.play('AGENT', 'summon');
  }

  /**
   * Play agent thinking sound (loops)
   */
  playAgentThinking() {
    return this.play('AGENT', 'thinking', { loop: true });
  }

  /**
   * Play task complete sound
   */
  playTaskComplete() {
    return this.play('AGENT', 'complete');
  }

  /**
   * Play hivemind merge sound
   */
  playHivemindMerge() {
    return this.play('AGENT', 'hivemind');
  }

  // ═══════════════════════════════════════════════════════════
  // UI SOUNDS
  // ═══════════════════════════════════════════════════════════

  playClick() { return this.play('UI', 'click'); }
  playHover() { return this.play('UI', 'hover'); }
  playSelect() { return this.play('UI', 'select'); }
  playBack() { return this.play('UI', 'back'); }
  playError() { return this.play('UI', 'error'); }
  playSuccess() { return this.play('UI', 'success'); }

  // ═══════════════════════════════════════════════════════════
  // GAME SOUNDS
  // ═══════════════════════════════════════════════════════════

  playGameLaunch() { return this.play('GAME', 'launch'); }
  playAchievement() { return this.play('GAME', 'achievement'); }
  playLevelUp() { return this.play('GAME', 'level_up'); }

  // ═══════════════════════════════════════════════════════════
  // VOLUME CONTROL
  // ═══════════════════════════════════════════════════════════

  /**
   * Set master volume
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.emit('volume:master', this.masterVolume);
    console.log(`[AUDIO] Master volume: ${Math.round(this.masterVolume * 100)}%`);
  }

  /**
   * Set channel volume
   */
  setChannelVolume(channelName, volume) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.setVolume(volume);
      this.emit('volume:channel', { channel: channelName, volume });
    }
  }

  /**
   * Mute all audio
   */
  muteAll() {
    this.muted = true;
    this.emit('audio:mute');
    console.log('[AUDIO] All audio muted');
  }

  /**
   * Unmute all audio
   */
  unmuteAll() {
    this.muted = false;
    this.emit('audio:unmute');
    console.log('[AUDIO] All audio unmuted');
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    if (this.muted) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
    return !this.muted;
  }

  // ═══════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get audio status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      masterVolume: this.masterVolume,
      muted: this.muted,
      currentMusic: this.currentMusic?.trackData?.name || null,
      ambientLayers: Array.from(this.ambientLayers.keys()),
      channels: Object.fromEntries(
        Array.from(this.channels.entries()).map(([name, channel]) => [
          name,
          { volume: channel.volume, muted: channel.muted }
        ])
      )
    };
  }

  /**
   * Get sound library
   */
  getLibrary() {
    return this.library;
  }
}

// ═══════════════════════════════════════════════════════════════
// AUDIO MANIFESTO
// ═══════════════════════════════════════════════════════════════

const AUDIO_MANIFESTO = `
═══════════════════════════════════════════════════════════════
                    THE AUDIO MANIFESTO
═══════════════════════════════════════════════════════════════

Sound is not decoration.
Sound is FEELING.
Sound is MEMORY.
Sound is REALITY.

When the 0RB boots:
- Deep bass hits your chest
- Synths ascend like consciousness rising
- The simulation HUM begins
- You FEEL the awakening

When agents summon:
- Ethereal energy builds
- Reality bends audibly
- Power manifests in frequency

When you achieve:
- Triumph has a sound
- Success has a frequency
- Your brain gets the reward

NBA YoungBoy bumpin as it loads?
That's not a joke.
That's ENERGY.
That's VIBE.
That's the frequency of creation.

The 0RB doesn't just look different.
It SOUNDS different.
It FEELS different.

Because in the simulation,
EVERYTHING is frequency.
And we control the mix.

═══════════════════════════════════════════════════════════════
              THE SIMULATION HAS A SOUNDTRACK
═══════════════════════════════════════════════════════════════
`;

module.exports = {
  AudioEngine,
  AudioChannel,
  SOUND_LIBRARY,
  AUDIO_CONFIG,
  AUDIO_MANIFESTO
};
