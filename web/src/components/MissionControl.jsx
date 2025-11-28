/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗                    ║
 * ║   ████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║                    ║
 * ║   ██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║                    ║
 * ║   ██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║                    ║
 * ║   ██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║                    ║
 * ║   ╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝                    ║
 * ║                                                                           ║
 * ║    ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗                ║
 * ║   ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║                ║
 * ║   ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║                ║
 * ║   ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║                ║
 * ║   ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗           ║
 * ║    ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝           ║
 * ║                                                                           ║
 * ║   REAL-TIME AGENT COMMAND CENTER                                          ║
 * ║   See everything. Control everything. BE everything.                      ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// AGENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const AGENTS = {
  APOLLO: { name: 'Apollo', domain: 'Content & Creativity', color: '#FFD700', icon: '☀️', symbol: '🎭' },
  ATHENA: { name: 'Athena', domain: 'Strategy & Wisdom', color: '#9B59B6', icon: '🦉', symbol: '⚖️' },
  HERMES: { name: 'Hermes', domain: 'Sales & Communication', color: '#3498DB', icon: '⚡', symbol: '🪽' },
  ARES: { name: 'Ares', domain: 'Competition & Growth', color: '#E74C3C', icon: '⚔️', symbol: '🛡️' },
  HEPHAESTUS: { name: 'Hephaestus', domain: 'Code & Building', color: '#E67E22', icon: '🔨', symbol: '⚒️' },
  ARTEMIS: { name: 'Artemis', domain: 'Research & Discovery', color: '#1ABC9C', icon: '🏹', symbol: '🌙' },
  MERCURY: { name: 'Mercury', domain: 'Data & Speed', color: '#00CED1', icon: '💨', symbol: '☿️' }
};

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard = ({ label, value, trend, icon, color }) => (
  <motion.div
    className="metric-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    style={{
      background: 'linear-gradient(135deg, rgba(20,20,35,0.9) 0%, rgba(30,30,50,0.9) 100%)',
      border: `1px solid ${color || '#00ffff'}33`,
      borderRadius: '12px',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          {label}
        </p>
        <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
          {value}
        </h3>
        {trend && (
          <span style={{
            color: trend > 0 ? '#2ecc71' : '#e74c3c',
            fontSize: '0.8rem'
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <span style={{ fontSize: '2rem', opacity: 0.5 }}>{icon}</span>
    </div>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${color || '#00ffff'}, transparent)`
    }} />
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// AGENT STATUS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const AgentStatus = ({ agent, data, onSelect, isSelected }) => {
  const statusColors = {
    idle: '#888',
    active: '#2ecc71',
    busy: '#f1c40f',
    error: '#e74c3c'
  };

  return (
    <motion.div
      onClick={() => onSelect(agent)}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: isSelected
          ? `linear-gradient(90deg, ${AGENTS[agent].color}22, transparent)`
          : 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        cursor: 'pointer',
        border: isSelected ? `1px solid ${AGENTS[agent].color}` : '1px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Status indicator */}
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: statusColors[data.status],
        boxShadow: data.status === 'active' ? `0 0 10px ${statusColors[data.status]}` : 'none',
        animation: data.status === 'active' ? 'pulse 2s infinite' : 'none'
      }} />

      {/* Agent icon */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: `${AGENTS[agent].color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        {AGENTS[agent].icon}
      </div>

      {/* Agent info */}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
          {AGENTS[agent].name}
        </div>
        <div style={{ color: '#666', fontSize: '0.75rem' }}>
          {data.currentTask || AGENTS[agent].domain}
        </div>
      </div>

      {/* Activity bar */}
      <div style={{ width: '60px' }}>
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.activity}%` }}
            style={{
              height: '100%',
              background: AGENTS[agent].color,
              borderRadius: '2px'
            }}
          />
        </div>
        <div style={{ color: '#666', fontSize: '0.65rem', marginTop: '2px', textAlign: 'right' }}>
          {data.activity}%
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY FEED COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ActivityFeed = ({ activities }) => (
  <div style={{
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '0.5rem'
  }}>
    <AnimatePresence>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: index * 0.05 }}
          style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.85rem'
          }}
        >
          <span style={{ color: AGENTS[activity.agent]?.color || '#00ffff' }}>
            {AGENTS[activity.agent]?.icon || '●'}
          </span>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#fff' }}>{activity.action}</span>
            <div style={{ color: '#666', fontSize: '0.7rem', marginTop: '2px' }}>
              {activity.timestamp}
            </div>
          </div>
          {activity.status === 'success' && <span style={{ color: '#2ecc71' }}>✓</span>}
          {activity.status === 'error' && <span style={{ color: '#e74c3c' }}>✗</span>}
          {activity.status === 'pending' && <span style={{ color: '#f1c40f' }}>●</span>}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// SWARM VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const SwarmVisualization = ({ agents, connections }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Agent positions in circle
    const agentKeys = Object.keys(agents);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const positions = {};
    agentKeys.forEach((agent, i) => {
      const angle = (i / agentKeys.length) * Math.PI * 2 - Math.PI / 2;
      positions[agent] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    // Animation
    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      connections.forEach(conn => {
        const from = positions[conn.from];
        const to = positions[conn.to];
        if (!from || !to) return;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, `${AGENTS[conn.from]?.color || '#00ffff'}44`);
        gradient.addColorStop(1, `${AGENTS[conn.to]?.color || '#00ffff'}44`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = conn.strength * 3;
        ctx.stroke();

        // Animated pulse along connection
        const pulsePos = (frame * 0.02 + conn.offset) % 1;
        const pulseX = from.x + (to.x - from.x) * pulsePos;
        const pulseY = from.y + (to.y - from.y) * pulsePos;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
      });

      // Draw agents
      agentKeys.forEach(agent => {
        const pos = positions[agent];
        const agentData = agents[agent];

        // Outer glow
        if (agentData.status === 'active') {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 25 + Math.sin(frame * 0.1) * 5, 0, Math.PI * 2);
          ctx.fillStyle = `${AGENTS[agent].color}22`;
          ctx.fill();
        }

        // Agent circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = `${AGENTS[agent].color}88`;
        ctx.fill();
        ctx.strokeStyle = AGENTS[agent].color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Agent label
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(AGENTS[agent].name, pos.x, pos.y + 35);
      });

      // Center orb
      const orbPulse = 15 + Math.sin(frame * 0.05) * 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbPulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }, [agents, connections]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '250px',
        borderRadius: '8px',
        background: 'rgba(10, 10, 15, 0.5)'
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND TERMINAL
// ═══════════════════════════════════════════════════════════════════════════

const CommandTerminal = ({ onCommand }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: '0RB MISSION CONTROL v1.0.0' },
    { type: 'system', text: 'Type "help" for available commands' }
  ]);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'input', text: `> ${input}` }];

    // Process command
    const response = processCommand(input);
    newHistory.push({ type: 'output', text: response });

    setHistory(newHistory);
    onCommand?.(input);
    setInput('');
  };

  const processCommand = (cmd) => {
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];

    switch (command) {
      case 'help':
        return `Available commands:
  status [agent]  - Check agent status
  deploy <agent>  - Deploy an agent
  recall <agent>  - Recall an agent
  swarm <pattern> - Initiate swarm pattern
  metrics         - Show system metrics
  clear           - Clear terminal`;
      case 'status':
        return parts[1]
          ? `${parts[1].toUpperCase()}: Active | Tasks: 12 | Memory: 2.4GB`
          : 'All systems operational. 7 agents online.';
      case 'metrics':
        return `Total Requests: 1,247 | Avg Latency: 234ms | Uptime: 99.9%`;
      case 'clear':
        setHistory([]);
        return '';
      default:
        return `Command "${command}" not recognized. Type "help" for available commands.`;
    }
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
      padding: '1rem',
      fontFamily: 'monospace',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '0.5rem'
      }}>
        {history.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.type === 'input' ? '#00ffff' :
                     line.type === 'system' ? '#888' : '#fff',
              marginBottom: '0.25rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <span style={{ color: '#00ffff' }}>{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }}
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MISSION CONTROL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function MissionControl() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentData, setAgentData] = useState({});
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    activeAgents: 0,
    memoryUsed: 0,
    uptime: 0
  });
  const [connections, setConnections] = useState([]);

  // Initialize mock data
  useEffect(() => {
    // Generate agent data
    const data = {};
    Object.keys(AGENTS).forEach(agent => {
      data[agent] = {
        status: Math.random() > 0.3 ? 'active' : 'idle',
        activity: Math.floor(Math.random() * 100),
        currentTask: Math.random() > 0.5 ? 'Processing request...' : null,
        tasksCompleted: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 500)
      };
    });
    setAgentData(data);

    // Generate connections
    const conns = [];
    const agents = Object.keys(AGENTS);
    for (let i = 0; i < 10; i++) {
      conns.push({
        from: agents[Math.floor(Math.random() * agents.length)],
        to: agents[Math.floor(Math.random() * agents.length)],
        strength: Math.random(),
        offset: Math.random()
      });
    }
    setConnections(conns);

    // Generate activities
    const acts = [];
    for (let i = 0; i < 10; i++) {
      acts.push({
        id: i,
        agent: agents[Math.floor(Math.random() * agents.length)],
        action: ['Completed task', 'Started analysis', 'Generated content', 'Processed data'][Math.floor(Math.random() * 4)],
        timestamp: `${Math.floor(Math.random() * 60)}m ago`,
        status: ['success', 'pending', 'error'][Math.floor(Math.random() * 3)]
      });
    }
    setActivities(acts);

    // Set metrics
    setMetrics({
      totalTasks: 1247,
      activeAgents: Object.values(data).filter(d => d.status === 'active').length,
      memoryUsed: 2.4,
      uptime: 99.9
    });
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentData(prev => {
        const updated = { ...prev };
        const agents = Object.keys(updated);
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        updated[randomAgent] = {
          ...updated[randomAgent],
          activity: Math.min(100, Math.max(0, updated[randomAgent].activity + (Math.random() - 0.5) * 20))
        };
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      color: '#fff',
      padding: '2rem',
      fontFamily: '"Rajdhani", sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            margin: 0,
            background: 'linear-gradient(90deg, #00ffff, #9b59b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            MISSION CONTROL
          </h1>
          <p style={{ color: '#666', margin: 0, letterSpacing: '0.1em' }}>
            0RB SYSTEM COMMAND CENTER
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(46, 204, 113, 0.2)',
            border: '1px solid #2ecc71',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: '#2ecc71'
          }}>
            ● SYSTEMS ONLINE
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <MetricCard label="TOTAL TASKS" value={metrics.totalTasks.toLocaleString()} trend={12} icon="📊" color="#00ffff" />
        <MetricCard label="ACTIVE AGENTS" value={`${metrics.activeAgents}/7`} icon="🤖" color="#2ecc71" />
        <MetricCard label="MEMORY USED" value={`${metrics.memoryUsed}GB`} trend={-5} icon="💾" color="#9b59b6" />
        <MetricCard label="UPTIME" value={`${metrics.uptime}%`} icon="⚡" color="#f1c40f" />
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr 350px',
        gap: '1.5rem'
      }}>
        {/* Left Panel - Agent List */}
        <div style={{
          background: 'rgba(20, 20, 35, 0.5)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(0, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            color: '#888',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            THE PANTHEON
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.keys(AGENTS).map(agent => (
              <AgentStatus
                key={agent}
                agent={agent}
                data={agentData[agent] || { status: 'idle', activity: 0 }}
                onSelect={setSelectedAgent}
                isSelected={selectedAgent === agent}
              />
            ))}
          </div>
        </div>

        {/* Center Panel - Visualization & Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Swarm Visualization */}
          <div style={{
            background: 'rgba(20, 20, 35, 0.5)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(0, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: '#888',
              marginBottom: '1rem'
            }}>
              SWARM NETWORK
            </h3>
            <SwarmVisualization agents={agentData} connections={connections} />
          </div>

          {/* Command Terminal */}
          <div style={{
            background: 'rgba(20, 20, 35, 0.5)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid rgba(0, 255, 255, 0.1)',
            flex: 1
          }}>
            <h3 style={{
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              color: '#888',
              marginBottom: '1rem'
            }}>
              COMMAND TERMINAL
            </h3>
            <CommandTerminal />
          </div>
        </div>

        {/* Right Panel - Activity Feed */}
        <div style={{
          background: 'rgba(20, 20, 35, 0.5)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(0, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            color: '#888',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            ACTIVITY FEED
          </h3>
          <ActivityFeed activities={activities} />

          {/* Quick Actions */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>QUICK ACTIONS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Deploy All', 'Recall All', 'Sync Memory', 'Export Logs'].map(action => (
                <motion.button
                  key={action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 255, 255, 0.1)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: '#00ffff',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'inherit'
                  }}
                >
                  {action}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(0, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#666',
        fontSize: '0.8rem'
      }}>
        <span>0RB SYSTEM v1.0.0 | THE SIMULATION AWAKENS</span>
        <span>Neural Router: ACTIVE | Memory System: ONLINE | Swarm: CONNECTED</span>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
