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
 * ║   ██╗     ██╗███╗   ██╗██╗  ██╗                                           ║
 * ║   ██║     ██║████╗  ██║██║ ██╔╝                                           ║
 * ║   ██║     ██║██╔██╗ ██║█████╔╝                                            ║
 * ║   ██║     ██║██║╚██╗██║██╔═██╗                                            ║
 * ║   ███████╗██║██║ ╚████║██║  ██╗                                           ║
 * ║   ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝                                           ║
 * ║                                                                           ║
 * ║   DISTRIBUTED 0RB NETWORK - CONNECT THE SIMULATIONS                       ║
 * ║   One mind. Many instances. Infinite power.                               ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const EventEmitter = require('events');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════
// NEURAL LINK PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════

const PROTOCOL = {
  VERSION: '1.0.0',
  PORT: 7777,

  // Message types
  MESSAGES: {
    // Discovery
    PING: 'PING',
    PONG: 'PONG',
    ANNOUNCE: 'ANNOUNCE',
    DISCOVER: 'DISCOVER',

    // Connection
    HANDSHAKE: 'HANDSHAKE',
    HANDSHAKE_ACK: 'HANDSHAKE_ACK',
    DISCONNECT: 'DISCONNECT',

    // Data
    TASK_REQUEST: 'TASK_REQUEST',
    TASK_RESPONSE: 'TASK_RESPONSE',
    MEMORY_SYNC: 'MEMORY_SYNC',
    AGENT_SHARE: 'AGENT_SHARE',

    // Swarm
    SWARM_INVITE: 'SWARM_INVITE',
    SWARM_JOIN: 'SWARM_JOIN',
    SWARM_LEAVE: 'SWARM_LEAVE',
    SWARM_BROADCAST: 'SWARM_BROADCAST',

    // Consensus
    CONSENSUS_PROPOSE: 'CONSENSUS_PROPOSE',
    CONSENSUS_VOTE: 'CONSENSUS_VOTE',
    CONSENSUS_COMMIT: 'CONSENSUS_COMMIT'
  },

  // Peer states
  PEER_STATES: {
    DISCOVERED: 'discovered',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    AUTHENTICATED: 'authenticated',
    SYNCING: 'syncing',
    READY: 'ready',
    DISCONNECTED: 'disconnected'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PEER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class Peer {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.address = data.address;
    this.port = data.port || PROTOCOL.PORT;
    this.publicKey = data.publicKey;
    this.name = data.name || 'Unknown Node';
    this.version = data.version || PROTOCOL.VERSION;
    this.state = data.state || PROTOCOL.PEER_STATES.DISCOVERED;
    this.lastSeen = data.lastSeen || Date.now();
    this.latency = data.latency || 0;
    this.capabilities = data.capabilities || [];
    this.agents = data.agents || [];
    this.reputation = data.reputation || 100;
    this.connection = null;

    this.stats = {
      messagesSent: 0,
      messagesReceived: 0,
      tasksCompleted: 0,
      bytesTransferred: 0
    };
  }

  updateLastSeen() {
    this.lastSeen = Date.now();
  }

  isAlive(timeout = 60000) {
    return Date.now() - this.lastSeen < timeout;
  }

  toJSON() {
    return {
      id: this.id,
      address: this.address,
      port: this.port,
      name: this.name,
      version: this.version,
      state: this.state,
      lastSeen: this.lastSeen,
      latency: this.latency,
      capabilities: this.capabilities,
      agents: this.agents,
      reputation: this.reputation,
      stats: this.stats
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class Message {
  constructor(type, payload, options = {}) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
    this.sender = options.sender;
    this.recipient = options.recipient;
    this.replyTo = options.replyTo;
    this.ttl = options.ttl || 30000;
    this.signature = null;
  }

  sign(privateKey) {
    // In production, use proper cryptographic signing
    const data = JSON.stringify({
      id: this.id,
      type: this.type,
      payload: this.payload,
      timestamp: this.timestamp
    });
    this.signature = crypto.createHash('sha256').update(data + privateKey).digest('hex');
    return this;
  }

  verify(publicKey) {
    // In production, use proper cryptographic verification
    return this.signature !== null;
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      payload: this.payload,
      timestamp: this.timestamp,
      sender: this.sender,
      recipient: this.recipient,
      replyTo: this.replyTo,
      signature: this.signature
    };
  }

  static fromJSON(json) {
    const msg = new Message(json.type, json.payload, {
      sender: json.sender,
      recipient: json.recipient,
      replyTo: json.replyTo
    });
    msg.id = json.id;
    msg.timestamp = json.timestamp;
    msg.signature = json.signature;
    return msg;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DISTRIBUTED TASK
// ═══════════════════════════════════════════════════════════════════════════

class DistributedTask {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type;
    this.prompt = data.prompt;
    this.agent = data.agent;
    this.priority = data.priority || 'normal';
    this.status = 'pending';
    this.createdAt = Date.now();
    this.assignedTo = null;
    this.result = null;
    this.error = null;
    this.retries = 0;
    this.maxRetries = data.maxRetries || 3;
  }

  assign(peerId) {
    this.assignedTo = peerId;
    this.status = 'assigned';
  }

  complete(result) {
    this.result = result;
    this.status = 'completed';
  }

  fail(error) {
    this.error = error;
    this.retries++;
    this.status = this.retries < this.maxRetries ? 'pending' : 'failed';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// NEURAL LINK CLASS
// ═══════════════════════════════════════════════════════════════════════════

class NeuralLink extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      port: config.port || PROTOCOL.PORT,
      name: config.name || `0RB-${crypto.randomBytes(4).toString('hex')}`,
      maxPeers: config.maxPeers || 50,
      discoveryInterval: config.discoveryInterval || 30000,
      heartbeatInterval: config.heartbeatInterval || 10000,
      syncInterval: config.syncInterval || 60000,
      enableDiscovery: config.enableDiscovery !== false,
      bootstrapPeers: config.bootstrapPeers || [],
      ...config
    };

    // Identity
    this.nodeId = crypto.randomUUID();
    this.keyPair = this.generateKeyPair();

    // Peer management
    this.peers = new Map();
    this.pendingConnections = new Map();

    // Task management
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.completedTasks = new Map();

    // Swarm management
    this.activeSwarms = new Map();

    // Stats
    this.stats = {
      uptime: Date.now(),
      peersConnected: 0,
      peersDiscovered: 0,
      messagesProcessed: 0,
      tasksDistributed: 0,
      tasksReceived: 0,
      bytesIn: 0,
      bytesOut: 0
    };

    // Message handlers
    this.messageHandlers = new Map();
    this.registerDefaultHandlers();

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              NEURAL LINK INITIALIZING                        ║
╠══════════════════════════════════════════════════════════════╣
║  Node ID: ${this.nodeId.substring(0, 8)}...${' '.repeat(39)}║
║  Name: ${this.config.name.substring(0, 50).padEnd(51)}║
║  Port: ${this.config.port.toString().padEnd(51)}║
║  Max Peers: ${this.config.maxPeers.toString().padEnd(46)}║
╚══════════════════════════════════════════════════════════════╝
    `);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────────────────

  generateKeyPair() {
    // Simplified key generation for demo
    // In production, use proper asymmetric cryptography
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    return { privateKey, publicKey };
  }

  async start() {
    console.log('[NEURAL LINK] Starting network node...');

    // Start discovery
    if (this.config.enableDiscovery) {
      this.startDiscovery();
    }

    // Connect to bootstrap peers
    for (const peer of this.config.bootstrapPeers) {
      await this.connect(peer.address, peer.port);
    }

    // Start heartbeat
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeats();
    }, this.config.heartbeatInterval);

    // Start sync
    this.syncTimer = setInterval(() => {
      this.syncWithPeers();
    }, this.config.syncInterval);

    this.emit('started', { nodeId: this.nodeId });
    console.log('[NEURAL LINK] Network node started');

    return this;
  }

  async stop() {
    console.log('[NEURAL LINK] Stopping network node...');

    // Clear timers
    clearInterval(this.discoveryTimer);
    clearInterval(this.heartbeatTimer);
    clearInterval(this.syncTimer);

    // Disconnect from all peers
    for (const [peerId, peer] of this.peers) {
      await this.disconnect(peerId);
    }

    this.emit('stopped');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Discovery
  // ─────────────────────────────────────────────────────────────────────────

  startDiscovery() {
    console.log('[NEURAL LINK] Starting peer discovery...');

    this.discoveryTimer = setInterval(() => {
      this.discover();
    }, this.config.discoveryInterval);

    // Initial discovery
    this.discover();
  }

  discover() {
    // Broadcast discovery message
    const announcement = new Message(PROTOCOL.MESSAGES.ANNOUNCE, {
      nodeId: this.nodeId,
      name: this.config.name,
      version: PROTOCOL.VERSION,
      publicKey: this.keyPair.publicKey,
      capabilities: this.getCapabilities(),
      agents: this.getAvailableAgents()
    }, { sender: this.nodeId });

    this.broadcast(announcement);
    this.emit('discovery:broadcast');
  }

  getCapabilities() {
    return [
      'task_execution',
      'memory_sync',
      'agent_share',
      'swarm_participation',
      'consensus'
    ];
  }

  getAvailableAgents() {
    // Return list of available agents
    return ['APOLLO', 'ATHENA', 'HERMES', 'ARES', 'HEPHAESTUS', 'ARTEMIS', 'MERCURY'];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Connection Management
  // ─────────────────────────────────────────────────────────────────────────

  async connect(address, port = PROTOCOL.PORT) {
    console.log(`[NEURAL LINK] Connecting to ${address}:${port}...`);

    const peer = new Peer({
      address,
      port,
      state: PROTOCOL.PEER_STATES.CONNECTING
    });

    this.pendingConnections.set(`${address}:${port}`, peer);

    // Send handshake
    const handshake = new Message(PROTOCOL.MESSAGES.HANDSHAKE, {
      nodeId: this.nodeId,
      name: this.config.name,
      version: PROTOCOL.VERSION,
      publicKey: this.keyPair.publicKey,
      capabilities: this.getCapabilities()
    }, { sender: this.nodeId });

    await this.sendToPeer(peer, handshake);

    this.emit('peer:connecting', { address, port });
  }

  async disconnect(peerId) {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    console.log(`[NEURAL LINK] Disconnecting from ${peer.name}...`);

    // Send disconnect message
    const disconnect = new Message(PROTOCOL.MESSAGES.DISCONNECT, {
      reason: 'graceful_shutdown'
    }, { sender: this.nodeId });

    await this.sendToPeer(peer, disconnect);

    // Remove peer
    this.peers.delete(peerId);
    this.stats.peersConnected--;

    this.emit('peer:disconnected', { peerId, peer: peer.toJSON() });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Message Handling
  // ─────────────────────────────────────────────────────────────────────────

  registerDefaultHandlers() {
    // Discovery handlers
    this.on(PROTOCOL.MESSAGES.ANNOUNCE, this.handleAnnounce.bind(this));
    this.on(PROTOCOL.MESSAGES.PING, this.handlePing.bind(this));
    this.on(PROTOCOL.MESSAGES.PONG, this.handlePong.bind(this));

    // Connection handlers
    this.on(PROTOCOL.MESSAGES.HANDSHAKE, this.handleHandshake.bind(this));
    this.on(PROTOCOL.MESSAGES.HANDSHAKE_ACK, this.handleHandshakeAck.bind(this));

    // Task handlers
    this.on(PROTOCOL.MESSAGES.TASK_REQUEST, this.handleTaskRequest.bind(this));
    this.on(PROTOCOL.MESSAGES.TASK_RESPONSE, this.handleTaskResponse.bind(this));

    // Swarm handlers
    this.on(PROTOCOL.MESSAGES.SWARM_INVITE, this.handleSwarmInvite.bind(this));
    this.on(PROTOCOL.MESSAGES.SWARM_BROADCAST, this.handleSwarmBroadcast.bind(this));
  }

  handleAnnounce(message, peer) {
    const { nodeId, name, version, publicKey, capabilities, agents } = message.payload;

    if (nodeId === this.nodeId) return; // Ignore own announcements

    if (!this.peers.has(nodeId)) {
      const newPeer = new Peer({
        id: nodeId,
        name,
        version,
        publicKey,
        capabilities,
        agents,
        address: peer?.address,
        state: PROTOCOL.PEER_STATES.DISCOVERED
      });

      this.peers.set(nodeId, newPeer);
      this.stats.peersDiscovered++;

      this.emit('peer:discovered', { peer: newPeer.toJSON() });
      console.log(`[NEURAL LINK] Discovered peer: ${name} (${nodeId.substring(0, 8)}...)`);
    }
  }

  handlePing(message, peer) {
    const pong = new Message(PROTOCOL.MESSAGES.PONG, {
      timestamp: message.payload.timestamp
    }, { sender: this.nodeId, replyTo: message.id });

    this.sendToPeer(peer, pong);
  }

  handlePong(message, peer) {
    const latency = Date.now() - message.payload.timestamp;
    if (peer) {
      peer.latency = latency;
      peer.updateLastSeen();
    }
  }

  handleHandshake(message, peer) {
    const { nodeId, name, version, publicKey, capabilities } = message.payload;

    // Create or update peer
    const existingPeer = this.peers.get(nodeId);
    if (existingPeer) {
      existingPeer.state = PROTOCOL.PEER_STATES.AUTHENTICATED;
      existingPeer.publicKey = publicKey;
      existingPeer.capabilities = capabilities;
    } else {
      const newPeer = new Peer({
        id: nodeId,
        name,
        version,
        publicKey,
        capabilities,
        state: PROTOCOL.PEER_STATES.AUTHENTICATED
      });
      this.peers.set(nodeId, newPeer);
      this.stats.peersConnected++;
    }

    // Send acknowledgment
    const ack = new Message(PROTOCOL.MESSAGES.HANDSHAKE_ACK, {
      nodeId: this.nodeId,
      name: this.config.name,
      accepted: true
    }, { sender: this.nodeId, replyTo: message.id });

    this.sendToPeer(this.peers.get(nodeId), ack);

    this.emit('peer:connected', { peerId: nodeId });
    console.log(`[NEURAL LINK] Connected to peer: ${name}`);
  }

  handleHandshakeAck(message, peer) {
    const { nodeId, accepted } = message.payload;

    if (accepted) {
      const existingPeer = this.peers.get(nodeId);
      if (existingPeer) {
        existingPeer.state = PROTOCOL.PEER_STATES.READY;
        this.emit('peer:ready', { peerId: nodeId });
      }
    }
  }

  handleTaskRequest(message, peer) {
    const task = new DistributedTask(message.payload);

    this.emit('task:received', { task, from: peer?.id });
    this.stats.tasksReceived++;

    // Execute task (in real implementation, delegate to agent system)
    this.executeTask(task).then(result => {
      const response = new Message(PROTOCOL.MESSAGES.TASK_RESPONSE, {
        taskId: task.id,
        status: 'completed',
        result
      }, { sender: this.nodeId, replyTo: message.id });

      if (peer) {
        this.sendToPeer(peer, response);
      }
    }).catch(error => {
      const response = new Message(PROTOCOL.MESSAGES.TASK_RESPONSE, {
        taskId: task.id,
        status: 'failed',
        error: error.message
      }, { sender: this.nodeId, replyTo: message.id });

      if (peer) {
        this.sendToPeer(peer, response);
      }
    });
  }

  handleTaskResponse(message, peer) {
    const { taskId, status, result, error } = message.payload;
    const task = this.activeTasks.get(taskId);

    if (task) {
      if (status === 'completed') {
        task.complete(result);
        this.completedTasks.set(taskId, task);
        this.emit('task:completed', { task });
      } else {
        task.fail(error);
        this.emit('task:failed', { task, error });
      }

      this.activeTasks.delete(taskId);
    }
  }

  handleSwarmInvite(message, peer) {
    const { swarmId, purpose, requiredAgents } = message.payload;

    // Auto-join if we have the required agents
    const canJoin = requiredAgents.every(agent =>
      this.getAvailableAgents().includes(agent)
    );

    if (canJoin) {
      this.joinSwarm(swarmId, message.sender);
    }

    this.emit('swarm:invited', { swarmId, from: peer?.id });
  }

  handleSwarmBroadcast(message, peer) {
    const { swarmId, data } = message.payload;

    this.emit('swarm:message', { swarmId, data, from: peer?.id });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Task Distribution
  // ─────────────────────────────────────────────────────────────────────────

  async distributeTask(taskData) {
    const task = new DistributedTask(taskData);

    // Find best peer for task
    const peer = this.selectPeerForTask(task);

    if (!peer) {
      // Execute locally if no peers available
      return this.executeTask(task);
    }

    task.assign(peer.id);
    this.activeTasks.set(task.id, task);
    this.stats.tasksDistributed++;

    const request = new Message(PROTOCOL.MESSAGES.TASK_REQUEST, {
      id: task.id,
      type: task.type,
      prompt: task.prompt,
      agent: task.agent,
      priority: task.priority
    }, { sender: this.nodeId });

    await this.sendToPeer(peer, request);

    this.emit('task:distributed', { task, peer: peer.toJSON() });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Task timeout'));
      }, 60000);

      this.once(`task:${task.id}:complete`, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      this.once(`task:${task.id}:failed`, (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  selectPeerForTask(task) {
    const readyPeers = Array.from(this.peers.values())
      .filter(p => p.state === PROTOCOL.PEER_STATES.READY)
      .filter(p => !task.agent || p.agents.includes(task.agent));

    if (readyPeers.length === 0) return null;

    // Select based on latency and reputation
    readyPeers.sort((a, b) => {
      const scoreA = a.reputation - a.latency;
      const scoreB = b.reputation - b.latency;
      return scoreB - scoreA;
    });

    return readyPeers[0];
  }

  async executeTask(task) {
    // Placeholder - integrate with agent system
    console.log(`[NEURAL LINK] Executing task: ${task.id}`);

    return {
      taskId: task.id,
      result: `Task ${task.type} completed`,
      timestamp: Date.now()
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Swarm Operations
  // ─────────────────────────────────────────────────────────────────────────

  createSwarm(purpose, requiredAgents = []) {
    const swarmId = crypto.randomUUID();

    const swarm = {
      id: swarmId,
      purpose,
      requiredAgents,
      creator: this.nodeId,
      members: [this.nodeId],
      createdAt: Date.now()
    };

    this.activeSwarms.set(swarmId, swarm);

    // Invite peers
    const invite = new Message(PROTOCOL.MESSAGES.SWARM_INVITE, {
      swarmId,
      purpose,
      requiredAgents
    }, { sender: this.nodeId });

    this.broadcast(invite);

    this.emit('swarm:created', { swarm });
    return swarm;
  }

  joinSwarm(swarmId, inviterId) {
    const join = new Message(PROTOCOL.MESSAGES.SWARM_JOIN, {
      swarmId,
      nodeId: this.nodeId,
      agents: this.getAvailableAgents()
    }, { sender: this.nodeId });

    const inviter = this.peers.get(inviterId);
    if (inviter) {
      this.sendToPeer(inviter, join);
    }

    this.emit('swarm:joined', { swarmId });
  }

  broadcastToSwarm(swarmId, data) {
    const swarm = this.activeSwarms.get(swarmId);
    if (!swarm) return;

    const message = new Message(PROTOCOL.MESSAGES.SWARM_BROADCAST, {
      swarmId,
      data
    }, { sender: this.nodeId });

    swarm.members.forEach(memberId => {
      if (memberId !== this.nodeId) {
        const peer = this.peers.get(memberId);
        if (peer) {
          this.sendToPeer(peer, message);
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Communication
  // ─────────────────────────────────────────────────────────────────────────

  async sendToPeer(peer, message) {
    if (!peer) return;

    message.sign(this.keyPair.privateKey);

    // In real implementation, use WebSocket/TCP
    // For demo, emit event
    this.emit('message:sent', { peer: peer.id, message: message.toJSON() });
    peer.stats.messagesSent++;
    this.stats.bytesOut += JSON.stringify(message).length;
  }

  broadcast(message) {
    for (const [peerId, peer] of this.peers) {
      if (peer.state === PROTOCOL.PEER_STATES.READY ||
          peer.state === PROTOCOL.PEER_STATES.AUTHENTICATED) {
        this.sendToPeer(peer, message);
      }
    }
  }

  receiveMessage(rawMessage, fromAddress) {
    try {
      const message = Message.fromJSON(rawMessage);

      if (message.isExpired()) {
        console.log('[NEURAL LINK] Ignoring expired message');
        return;
      }

      this.stats.messagesProcessed++;
      this.stats.bytesIn += JSON.stringify(rawMessage).length;

      const peer = this.peers.get(message.sender);
      if (peer) {
        peer.stats.messagesReceived++;
        peer.updateLastSeen();
      }

      // Emit message type event
      this.emit(message.type, message, peer);

    } catch (error) {
      console.error('[NEURAL LINK] Error processing message:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Heartbeat & Sync
  // ─────────────────────────────────────────────────────────────────────────

  sendHeartbeats() {
    for (const [peerId, peer] of this.peers) {
      if (peer.state === PROTOCOL.PEER_STATES.READY) {
        const ping = new Message(PROTOCOL.MESSAGES.PING, {
          timestamp: Date.now()
        }, { sender: this.nodeId });

        this.sendToPeer(peer, ping);
      }

      // Remove dead peers
      if (!peer.isAlive()) {
        console.log(`[NEURAL LINK] Peer ${peer.name} timed out`);
        this.peers.delete(peerId);
        this.stats.peersConnected--;
        this.emit('peer:timeout', { peerId });
      }
    }
  }

  syncWithPeers() {
    // Broadcast sync request to share memory/state
    const sync = new Message(PROTOCOL.MESSAGES.MEMORY_SYNC, {
      nodeId: this.nodeId,
      timestamp: Date.now(),
      // Add memory hashes for differential sync
    }, { sender: this.nodeId });

    this.broadcast(sync);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  getNodeInfo() {
    return {
      nodeId: this.nodeId,
      name: this.config.name,
      publicKey: this.keyPair.publicKey,
      capabilities: this.getCapabilities(),
      agents: this.getAvailableAgents(),
      stats: this.stats,
      uptime: Date.now() - this.stats.uptime
    };
  }

  getPeers() {
    return Array.from(this.peers.values()).map(p => p.toJSON());
  }

  getStats() {
    return {
      ...this.stats,
      uptime: Date.now() - this.stats.uptime,
      activePeers: Array.from(this.peers.values())
        .filter(p => p.state === PROTOCOL.PEER_STATES.READY).length
    };
  }

  getActiveSwarms() {
    return Array.from(this.activeSwarms.values());
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  NeuralLink,
  Peer,
  Message,
  DistributedTask,
  PROTOCOL
};
