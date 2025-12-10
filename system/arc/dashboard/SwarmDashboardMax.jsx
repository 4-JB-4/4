/**
 * Amoeba V4.0 Multi-Node Swarm Dashboard
 * Connects to multiple orchestrator nodes for distributed visualization
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Configure your orchestrator nodes
const DEFAULT_NODES = [
    'ws://localhost:8080',
    'ws://localhost:8081',
    'ws://localhost:8082',
    'ws://localhost:8083'
];

export default function SwarmDashboardMax({ nodes = DEFAULT_NODES }) {
    const canvasRef = useRef(null);
    const [branches, setBranches] = useState([]);
    const [particles, setParticles] = useState([]);
    const [nodeStatus, setNodeStatus] = useState({});
    const [stats, setStats] = useState({
        totalParticles: 0,
        totalBranches: 0,
        nodesConnected: 0,
        wins: 0
    });

    // Node colors for visual distinction
    const nodeColors = [
        '#58a6ff', // Blue
        '#3fb950', // Green
        '#a371f7', // Purple
        '#f0883e', // Orange
        '#f778ba', // Pink
        '#ffd33d', // Yellow
        '#79c0ff', // Light blue
        '#7ee787'  // Light green
    ];

    // Connect to multiple WebSocket nodes
    useEffect(() => {
        const sockets = nodes.map((url, nodeIndex) => {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                setNodeStatus(prev => ({ ...prev, [url]: 'connected' }));
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    channels: ['metrics', 'branch', 'progress']
                }));
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                if (msg.type === 'metrics') {
                    const data = msg.data;
                    setBranches(prev => [...prev.slice(-500), { ...data, nodeIndex, url }]);

                    // Create particle
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 100 + Math.random() * 200;
                    const centerX = 600;
                    const centerY = 400;

                    // Position particles in clusters by node
                    const nodeAngle = (nodeIndex / nodes.length) * Math.PI * 2;
                    const nodeX = centerX + Math.cos(nodeAngle) * 250;
                    const nodeY = centerY + Math.sin(nodeAngle) * 200;

                    setParticles(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        x: nodeX + (Math.random() - 0.5) * 100,
                        y: nodeY + (Math.random() - 0.5) * 100,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        nodeIndex,
                        phase: data.phase,
                        branchId: data.branchId,
                        score: data.score || data.successRate || 0.5,
                        status: data.status,
                        life: 1.0,
                        size: 6 + (data.score || 0.5) * 12
                    }]);

                    // Update stats
                    if (data.status === 'win') {
                        setStats(s => ({ ...s, wins: s.wins + 1 }));
                    }
                }

                if (msg.type === 'branch' && msg.data.event === 'spawn') {
                    // Spawn burst from node center
                    const nodeAngle = (nodeIndex / nodes.length) * Math.PI * 2;
                    const nodeX = 600 + Math.cos(nodeAngle) * 250;
                    const nodeY = 400 + Math.sin(nodeAngle) * 200;

                    for (let i = 0; i < 5; i++) {
                        const burstAngle = Math.random() * Math.PI * 2;
                        const speed = 3 + Math.random() * 4;
                        setParticles(prev => [...prev, {
                            id: Date.now() + Math.random(),
                            x: nodeX,
                            y: nodeY,
                            vx: Math.cos(burstAngle) * speed,
                            vy: Math.sin(burstAngle) * speed,
                            nodeIndex,
                            phase: msg.data.phase,
                            branchId: msg.data.branchId,
                            score: 0.5,
                            status: 'spawn',
                            life: 1.0,
                            size: 4
                        }]);
                    }
                }
            };

            ws.onclose = () => {
                setNodeStatus(prev => ({ ...prev, [url]: 'disconnected' }));
            };

            ws.onerror = () => {
                setNodeStatus(prev => ({ ...prev, [url]: 'error' }));
            };

            return ws;
        });

        return () => sockets.forEach(ws => ws.close());
    }, [nodes]);

    // Update stats
    useEffect(() => {
        const connected = Object.values(nodeStatus).filter(s => s === 'connected').length;
        setStats(s => ({
            ...s,
            nodesConnected: connected,
            totalParticles: particles.length,
            totalBranches: branches.length
        }));
    }, [nodeStatus, particles.length, branches.length]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        function draw() {
            // Clear with fade effect
            ctx.fillStyle = 'rgba(13, 17, 23, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw node centers
            nodes.forEach((url, i) => {
                const angle = (i / nodes.length) * Math.PI * 2;
                const x = 600 + Math.cos(angle) * 250;
                const y = 400 + Math.sin(angle) * 200;
                const color = nodeColors[i % nodeColors.length];
                const status = nodeStatus[url];

                // Node circle
                ctx.beginPath();
                ctx.arc(x, y, status === 'connected' ? 30 : 15, 0, Math.PI * 2);
                ctx.fillStyle = status === 'connected'
                    ? `${color}33`
                    : 'rgba(139, 148, 158, 0.2)';
                ctx.fill();
                ctx.strokeStyle = status === 'connected' ? color : '#484f58';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Node label
                ctx.fillStyle = status === 'connected' ? '#c9d1d9' : '#484f58';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`Node ${i + 1}`, x, y + 45);
            });

            // Update and draw particles
            setParticles(prev => {
                const updated = [];

                for (const p of prev) {
                    // Attract to node center
                    const nodeAngle = (p.nodeIndex / nodes.length) * Math.PI * 2;
                    const nodeX = 600 + Math.cos(nodeAngle) * 250;
                    const nodeY = 400 + Math.sin(nodeAngle) * 200;

                    const dx = nodeX - p.x;
                    const dy = nodeY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Gentle attraction
                    if (dist > 80) {
                        p.vx += (dx / dist) * 0.05;
                        p.vy += (dy / dist) * 0.05;
                    }

                    // Update position
                    p.x += p.vx;
                    p.y += p.vy;

                    // Friction
                    p.vx *= 0.98;
                    p.vy *= 0.98;

                    // Boundary bounce
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.8;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.8;

                    // Decay
                    p.life -= 0.003;

                    if (p.life > 0) {
                        const color = nodeColors[p.nodeIndex % nodeColors.length];
                        const alpha = p.life * 0.8;

                        // Draw particle
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);

                        if (p.status === 'win') {
                            ctx.fillStyle = `rgba(63, 185, 80, ${alpha})`;
                            ctx.shadowColor = '#3fb950';
                            ctx.shadowBlur = 15;
                        } else if (p.status === 'failed') {
                            ctx.fillStyle = `rgba(248, 81, 73, ${alpha * 0.7})`;
                        } else {
                            ctx.fillStyle = hexToRgba(color, alpha);
                        }

                        ctx.fill();
                        ctx.shadowBlur = 0;

                        updated.push(p);
                    }
                }

                return updated;
            });

            // Draw connections between particles of same node
            const currentParticles = particles;
            for (let i = 0; i < Math.min(currentParticles.length, 100); i++) {
                for (let j = i + 1; j < Math.min(currentParticles.length, 100); j++) {
                    const p1 = currentParticles[i];
                    const p2 = currentParticles[j];

                    if (p1.nodeIndex !== p2.nodeIndex) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        const alpha = (1 - dist / 60) * 0.3 * Math.min(p1.life, p2.life);
                        ctx.strokeStyle = hexToRgba(nodeColors[p1.nodeIndex % nodeColors.length], alpha);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw inter-node connections on wins
            const recentWins = currentParticles.filter(p => p.status === 'win' && p.life > 0.5);
            for (const win of recentWins) {
                ctx.strokeStyle = 'rgba(63, 185, 80, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(win.x, win.y);
                ctx.lineTo(600, 400); // Center
                ctx.stroke();
            }

            animationId = requestAnimationFrame(draw);
        }

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [particles, nodes, nodeStatus]);

    return (
        <div style={{ position: 'relative', width: '100%', background: '#0d1117', fontFamily: 'monospace' }}>
            {/* Header */}
            <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 10
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#c9d1d9' }}>
                        🧬 Multi-Node Swarm
                    </h2>
                    <div style={{ color: '#8b949e', fontSize: 12, marginTop: 4 }}>
                        Distributed Amoeba Orchestration
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <StatBox label="Nodes" value={`${stats.nodesConnected}/${nodes.length}`} color="#58a6ff" />
                    <StatBox label="Particles" value={stats.totalParticles} color="#a371f7" />
                    <StatBox label="Wins" value={stats.wins} color="#3fb950" />
                </div>
            </div>

            {/* Node Status */}
            <div style={{
                position: 'absolute',
                top: 80,
                left: 16,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}>
                {nodes.map((url, i) => (
                    <div key={url} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: nodeStatus[url] === 'connected' ? nodeColors[i] : '#484f58'
                        }} />
                        <span style={{ color: nodeStatus[url] === 'connected' ? '#c9d1d9' : '#484f58' }}>
                            {url.replace('ws://', '')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 10,
                fontSize: 11,
                color: '#8b949e'
            }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                    <span>🟢 Win</span>
                    <span>🔴 Fail</span>
                    <span>⚪ Active</span>
                </div>
                <div style={{ color: '#484f58' }}>
                    Particles cluster around their origin node
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                style={{ display: 'block', width: '100%', height: '800px' }}
            />
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div style={{
            background: '#161b22',
            border: '1px solid #21262d',
            borderRadius: 4,
            padding: '8px 12px',
            minWidth: 80
        }}>
            <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 2 }}>{label}</div>
            <div style={{ color: color || '#c9d1d9', fontSize: 18, fontWeight: 'bold' }}>{value}</div>
        </div>
    );
}

function hexToRgba(hex, alpha) {
    if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
