/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ██████╗ ███████╗ █████╗ ██╗     ██╗████████╗██╗   ██╗                   ║
 * ║   ██╔══██╗██╔════╝██╔══██╗██║     ██║╚══██╔══╝╚██╗ ██╔╝                   ║
 * ║   ██████╔╝█████╗  ███████║██║     ██║   ██║    ╚████╔╝                    ║
 * ║   ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║     ╚██╔╝                     ║
 * ║   ██║  ██║███████╗██║  ██║███████╗██║   ██║      ██║                      ║
 * ║   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝                      ║
 * ║                                                                           ║
 * ║    ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███████╗███████╗██████╗    ║
 * ║   ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔══██╗   ║
 * ║   ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║███████╗█████╗  ██████╔╝   ║
 * ║   ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║╚════██║██╔══╝  ██╔══██╗   ║
 * ║   ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝███████║███████╗██║  ██║   ║
 * ║    ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝   ║
 * ║                                                                           ║
 * ║   VISUAL WORKFLOW BUILDER FOR MULTI-AGENT PIPELINES                       ║
 * ║   Drag. Drop. Create Reality.                                             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// NODE TYPES
// ═══════════════════════════════════════════════════════════════════════════

const NODE_TYPES = {
  // Agent nodes
  AGENT: {
    category: 'agents',
    color: '#00ffff',
    inputs: ['trigger'],
    outputs: ['result', 'error'],
    icon: '🤖'
  },

  // Input nodes
  INPUT_TEXT: {
    category: 'inputs',
    color: '#2ecc71',
    inputs: [],
    outputs: ['text'],
    icon: '📝'
  },
  INPUT_FILE: {
    category: 'inputs',
    color: '#2ecc71',
    inputs: [],
    outputs: ['file', 'content'],
    icon: '📁'
  },
  INPUT_API: {
    category: 'inputs',
    color: '#2ecc71',
    inputs: ['url', 'params'],
    outputs: ['response', 'error'],
    icon: '🌐'
  },
  INPUT_WEBHOOK: {
    category: 'inputs',
    color: '#2ecc71',
    inputs: [],
    outputs: ['payload'],
    icon: '🪝'
  },

  // Process nodes
  TRANSFORM: {
    category: 'process',
    color: '#9b59b6',
    inputs: ['data'],
    outputs: ['transformed'],
    icon: '🔄'
  },
  FILTER: {
    category: 'process',
    color: '#9b59b6',
    inputs: ['data', 'condition'],
    outputs: ['passed', 'failed'],
    icon: '🔍'
  },
  MERGE: {
    category: 'process',
    color: '#9b59b6',
    inputs: ['input1', 'input2', 'input3'],
    outputs: ['merged'],
    icon: '🔗'
  },
  SPLIT: {
    category: 'process',
    color: '#9b59b6',
    inputs: ['data'],
    outputs: ['part1', 'part2', 'part3'],
    icon: '✂️'
  },

  // Logic nodes
  CONDITION: {
    category: 'logic',
    color: '#f1c40f',
    inputs: ['value'],
    outputs: ['true', 'false'],
    icon: '❓'
  },
  LOOP: {
    category: 'logic',
    color: '#f1c40f',
    inputs: ['items'],
    outputs: ['item', 'complete'],
    icon: '🔁'
  },
  DELAY: {
    category: 'logic',
    color: '#f1c40f',
    inputs: ['trigger'],
    outputs: ['delayed'],
    icon: '⏱️'
  },
  PARALLEL: {
    category: 'logic',
    color: '#f1c40f',
    inputs: ['trigger'],
    outputs: ['branch1', 'branch2', 'branch3'],
    icon: '⚡'
  },

  // Output nodes
  OUTPUT_TEXT: {
    category: 'outputs',
    color: '#e74c3c',
    inputs: ['text'],
    outputs: [],
    icon: '💬'
  },
  OUTPUT_FILE: {
    category: 'outputs',
    color: '#e74c3c',
    inputs: ['content', 'filename'],
    outputs: [],
    icon: '💾'
  },
  OUTPUT_API: {
    category: 'outputs',
    color: '#e74c3c',
    inputs: ['data', 'url'],
    outputs: ['response'],
    icon: '📤'
  },
  OUTPUT_NOTIFICATION: {
    category: 'outputs',
    color: '#e74c3c',
    inputs: ['message'],
    outputs: [],
    icon: '🔔'
  },

  // Swarm nodes
  SWARM_CHAIN: {
    category: 'swarm',
    color: '#e67e22',
    inputs: ['trigger'],
    outputs: ['result'],
    icon: '⛓️'
  },
  SWARM_PARALLEL: {
    category: 'swarm',
    color: '#e67e22',
    inputs: ['trigger'],
    outputs: ['results'],
    icon: '🌐'
  },
  SWARM_COUNCIL: {
    category: 'swarm',
    color: '#e67e22',
    inputs: ['question'],
    outputs: ['consensus'],
    icon: '👥'
  },
  HIVEMIND: {
    category: 'swarm',
    color: '#e67e22',
    inputs: ['trigger'],
    outputs: ['unified_response'],
    icon: '🧠'
  }
};

const AGENTS = {
  APOLLO: { name: 'Apollo', color: '#FFD700', icon: '☀️' },
  ATHENA: { name: 'Athena', color: '#9B59B6', icon: '🦉' },
  HERMES: { name: 'Hermes', color: '#3498DB', icon: '⚡' },
  ARES: { name: 'Ares', color: '#E74C3C', icon: '⚔️' },
  HEPHAESTUS: { name: 'Hephaestus', color: '#E67E22', icon: '🔨' },
  ARTEMIS: { name: 'Artemis', color: '#1ABC9C', icon: '🏹' },
  MERCURY: { name: 'Mercury', color: '#00CED1', icon: '💨' }
};

// ═══════════════════════════════════════════════════════════════════════════
// NODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const WorkflowNode = ({ node, selected, onSelect, onDrag, onPortClick, connections }) => {
  const nodeType = NODE_TYPES[node.type] || NODE_TYPES.AGENT;
  const nodeRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('port')) return;
    e.preventDefault();
    onSelect(node.id);

    const startX = e.clientX - node.x;
    const startY = e.clientY - node.y;

    const handleMouseMove = (moveEvent) => {
      onDrag(node.id, moveEvent.clientX - startX, moveEvent.clientY - startY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: 180,
        background: 'rgba(20, 20, 35, 0.95)',
        border: `2px solid ${selected ? '#fff' : nodeType.color}`,
        borderRadius: '12px',
        cursor: 'move',
        zIndex: selected ? 1000 : 1,
        boxShadow: selected
          ? `0 0 20px ${nodeType.color}66`
          : '0 4px 20px rgba(0,0,0,0.3)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div style={{
        padding: '10px 12px',
        borderBottom: `1px solid ${nodeType.color}33`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{nodeType.icon}</span>
        <span style={{
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {node.label || node.type}
        </span>
        {node.agent && (
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: AGENTS[node.agent]?.color || '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem'
          }}>
            {AGENTS[node.agent]?.icon}
          </span>
        )}
      </div>

      {/* Inputs */}
      <div style={{ padding: '8px 0' }}>
        {nodeType.inputs.map((input, i) => (
          <div
            key={`in-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 12px',
              gap: '8px'
            }}
          >
            <div
              className="port port-input"
              onClick={() => onPortClick(node.id, 'input', input)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: connections.some(c => c.to === node.id && c.toPort === input)
                  ? nodeType.color
                  : 'transparent',
                border: `2px solid ${nodeType.color}`,
                cursor: 'pointer',
                marginLeft: '-18px'
              }}
            />
            <span style={{ color: '#888', fontSize: '0.75rem' }}>{input}</span>
          </div>
        ))}
      </div>

      {/* Outputs */}
      <div style={{ padding: '8px 0' }}>
        {nodeType.outputs.map((output, i) => (
          <div
            key={`out-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '4px 12px',
              gap: '8px'
            }}
          >
            <span style={{ color: '#888', fontSize: '0.75rem' }}>{output}</span>
            <div
              className="port port-output"
              onClick={() => onPortClick(node.id, 'output', output)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: connections.some(c => c.from === node.id && c.fromPort === output)
                  ? nodeType.color
                  : 'transparent',
                border: `2px solid ${nodeType.color}`,
                cursor: 'pointer',
                marginRight: '-18px'
              }}
            />
          </div>
        ))}
      </div>

      {/* Status indicator */}
      {node.status && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: node.status === 'running' ? '#2ecc71' :
                     node.status === 'error' ? '#e74c3c' :
                     node.status === 'complete' ? '#3498db' : '#888',
          border: '2px solid #0a0a0f',
          animation: node.status === 'running' ? 'pulse 1s infinite' : 'none'
        }} />
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONNECTIONS CANVAS
// ═══════════════════════════════════════════════════════════════════════════

const ConnectionsCanvas = ({ connections, nodes, pendingConnection, mousePos }) => {
  const getPortPosition = (nodeId, portType, portName) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const nodeType = NODE_TYPES[node.type] || NODE_TYPES.AGENT;
    const ports = portType === 'input' ? nodeType.inputs : nodeType.outputs;
    const portIndex = ports.indexOf(portName);

    const baseY = node.y + 50 + (portIndex * 28);

    if (portType === 'input') {
      return { x: node.x, y: baseY };
    } else {
      return { x: node.x + 180, y: baseY };
    }
  };

  const createPath = (from, to) => {
    const dx = to.x - from.x;
    const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);

    return `M ${from.x} ${from.y}
            C ${from.x + controlOffset} ${from.y},
              ${to.x - controlOffset} ${to.y},
              ${to.x} ${to.y}`;
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#9b59b6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Existing connections */}
      {connections.map((conn, i) => {
        const from = getPortPosition(conn.from, 'output', conn.fromPort);
        const to = getPortPosition(conn.to, 'input', conn.toPort);

        return (
          <g key={i}>
            <path
              d={createPath(from, to)}
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            {/* Animated pulse */}
            <circle r="4" fill="#00ffff">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={createPath(from, to)}
              />
            </circle>
          </g>
        );
      })}

      {/* Pending connection */}
      {pendingConnection && mousePos && (
        <path
          d={createPath(
            getPortPosition(pendingConnection.nodeId, pendingConnection.portType, pendingConnection.portName),
            mousePos
          )}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.5"
        />
      )}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// NODE PALETTE
// ═══════════════════════════════════════════════════════════════════════════

const NodePalette = ({ onAddNode }) => {
  const categories = {
    agents: { label: 'Agents', icon: '🤖' },
    inputs: { label: 'Inputs', icon: '📥' },
    process: { label: 'Process', icon: '⚙️' },
    logic: { label: 'Logic', icon: '🔀' },
    outputs: { label: 'Outputs', icon: '📤' },
    swarm: { label: 'Swarm', icon: '🌐' }
  };

  const [expandedCategory, setExpandedCategory] = useState('agents');

  const nodesByCategory = Object.entries(NODE_TYPES).reduce((acc, [type, config]) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push({ type, ...config });
    return acc;
  }, {});

  return (
    <div style={{
      width: '220px',
      background: 'rgba(20, 20, 35, 0.95)',
      borderRight: '1px solid rgba(0, 255, 255, 0.2)',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <h3 style={{
        color: '#00ffff',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)'
      }}>
        NODE PALETTE
      </h3>

      {Object.entries(categories).map(([catKey, cat]) => (
        <div key={catKey} style={{ marginBottom: '0.5rem' }}>
          <div
            onClick={() => setExpandedCategory(expandedCategory === catKey ? null : catKey)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              cursor: 'pointer',
              borderRadius: '6px',
              background: expandedCategory === catKey ? 'rgba(0, 255, 255, 0.1)' : 'transparent'
            }}
          >
            <span>{cat.icon}</span>
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{cat.label}</span>
            <span style={{ marginLeft: 'auto', color: '#666' }}>
              {expandedCategory === catKey ? '▼' : '▶'}
            </span>
          </div>

          <AnimatePresence>
            {expandedCategory === catKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', paddingLeft: '1rem' }}
              >
                {(nodesByCategory[catKey] || []).map((node) => (
                  <motion.div
                    key={node.type}
                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                    onClick={() => onAddNode(node.type)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${node.color}`
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{node.icon}</span>
                    <span style={{ color: '#ccc', fontSize: '0.8rem' }}>
                      {node.type.replace(/_/g, ' ')}
                    </span>
                  </motion.div>
                ))}

                {/* Agent selection for AGENT type */}
                {catKey === 'agents' && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                      Select Agent:
                    </div>
                    {Object.entries(AGENTS).map(([key, agent]) => (
                      <motion.div
                        key={key}
                        whileHover={{ x: 5 }}
                        onClick={() => onAddNode('AGENT', { agent: key, label: agent.name })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          borderLeft: `3px solid ${agent.color}`
                        }}
                      >
                        <span>{agent.icon}</span>
                        <span style={{ color: '#ccc', fontSize: '0.75rem' }}>{agent.name}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES PANEL
// ═══════════════════════════════════════════════════════════════════════════

const PropertiesPanel = ({ node, onUpdate, onDelete }) => {
  if (!node) {
    return (
      <div style={{
        width: '280px',
        background: 'rgba(20, 20, 35, 0.95)',
        borderLeft: '1px solid rgba(0, 255, 255, 0.2)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        Select a node to edit
      </div>
    );
  }

  const nodeType = NODE_TYPES[node.type];

  return (
    <div style={{
      width: '280px',
      background: 'rgba(20, 20, 35, 0.95)',
      borderLeft: '1px solid rgba(0, 255, 255, 0.2)',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <h3 style={{
        color: '#00ffff',
        fontSize: '0.9rem',
        letterSpacing: '0.1em',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>{nodeType?.icon}</span>
        PROPERTIES
      </h3>

      {/* Node label */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
          Label
        </label>
        <input
          type="text"
          value={node.label || ''}
          onChange={(e) => onUpdate({ ...node, label: e.target.value })}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.85rem'
          }}
          placeholder="Node label..."
        />
      </div>

      {/* Agent selector for AGENT nodes */}
      {node.type === 'AGENT' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
            Agent
          </label>
          <select
            value={node.agent || ''}
            onChange={(e) => onUpdate({ ...node, agent: e.target.value })}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            <option value="">Select agent...</option>
            {Object.entries(AGENTS).map(([key, agent]) => (
              <option key={key} value={key}>{agent.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Prompt/Config */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
          Configuration
        </label>
        <textarea
          value={node.config || ''}
          onChange={(e) => onUpdate({ ...node, config: e.target.value })}
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.85rem',
            resize: 'vertical'
          }}
          placeholder="Enter node configuration or prompt..."
        />
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(node.id)}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'rgba(231, 76, 60, 0.2)',
          border: '1px solid #e74c3c',
          borderRadius: '6px',
          color: '#e74c3c',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        Delete Node
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN REALITY COMPOSER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function RealityComposer() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef(null);

  // Handle adding new nodes
  const handleAddNode = useCallback((type, extraProps = {}) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      x: 300 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      label: extraProps.label || type.replace(/_/g, ' '),
      ...extraProps
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
  }, []);

  // Handle node dragging
  const handleNodeDrag = useCallback((nodeId, x, y) => {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n
    ));
  }, []);

  // Handle port clicks for connections
  const handlePortClick = useCallback((nodeId, portType, portName) => {
    if (!pendingConnection) {
      // Start new connection
      setPendingConnection({ nodeId, portType, portName });
    } else {
      // Complete connection
      if (pendingConnection.portType === 'output' && portType === 'input') {
        setConnections(prev => [...prev, {
          from: pendingConnection.nodeId,
          fromPort: pendingConnection.portName,
          to: nodeId,
          toPort: portName
        }]);
      } else if (pendingConnection.portType === 'input' && portType === 'output') {
        setConnections(prev => [...prev, {
          from: nodeId,
          fromPort: portName,
          to: pendingConnection.nodeId,
          toPort: pendingConnection.portName
        }]);
      }
      setPendingConnection(null);
    }
  }, [pendingConnection]);

  // Handle mouse move for pending connection
  const handleMouseMove = useCallback((e) => {
    if (pendingConnection && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [pendingConnection]);

  // Cancel pending connection on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPendingConnection(null);
      }
      if (e.key === 'Delete' && selectedNode) {
        handleDeleteNode(selectedNode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  // Handle node update
  const handleNodeUpdate = useCallback((updatedNode) => {
    setNodes(prev => prev.map(n =>
      n.id === updatedNode.id ? updatedNode : n
    ));
  }, []);

  // Handle node delete
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  }, []);

  // Run workflow
  const handleRunWorkflow = useCallback(async () => {
    setIsRunning(true);
    // Simulate workflow execution
    for (const node of nodes) {
      setNodes(prev => prev.map(n =>
        n.id === node.id ? { ...n, status: 'running' } : n
      ));
      await new Promise(r => setTimeout(r, 1000));
      setNodes(prev => prev.map(n =>
        n.id === node.id ? { ...n, status: 'complete' } : n
      ));
    }
    setIsRunning(false);
  }, [nodes]);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0a0a0f',
      fontFamily: '"Rajdhani", sans-serif'
    }}>
      {/* Node Palette */}
      <NodePalette onAddNode={handleAddNode} />

      {/* Main Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'rgba(20, 20, 35, 0.95)',
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 600,
                width: '200px'
              }}
            />
            <span style={{ color: '#666', fontSize: '0.8rem' }}>
              {nodes.length} nodes • {connections.length} connections
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunWorkflow}
              disabled={isRunning}
              style={{
                padding: '0.5rem 1.5rem',
                background: isRunning ? 'rgba(46, 204, 113, 0.5)' : 'rgba(46, 204, 113, 0.2)',
                border: '1px solid #2ecc71',
                borderRadius: '6px',
                color: '#2ecc71',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isRunning ? '⏳ Running...' : '▶ Run Workflow'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '6px',
                color: '#00ffff',
                cursor: 'pointer'
              }}
            >
              💾 Save
            </motion.button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (pendingConnection) setPendingConnection(null);
            setSelectedNode(null);
          }}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            background: `
              radial-gradient(circle at center, rgba(0, 255, 255, 0.03) 0%, transparent 70%),
              linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 20px 20px, 20px 20px'
          }}
        >
          {/* Connections */}
          <ConnectionsCanvas
            connections={connections}
            nodes={nodes}
            pendingConnection={pendingConnection}
            mousePos={mousePos}
          />

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map(node => (
              <WorkflowNode
                key={node.id}
                node={node}
                selected={selectedNode === node.id}
                onSelect={(id) => { setSelectedNode(id); }}
                onDrag={handleNodeDrag}
                onPortClick={handlePortClick}
                connections={connections}
              />
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Reality Composer</div>
              <div style={{ fontSize: '0.9rem' }}>
                Drag nodes from the palette to create your workflow
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <PropertiesPanel
        node={selectedNodeData}
        onUpdate={handleNodeUpdate}
        onDelete={handleDeleteNode}
      />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
