import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';
import SwarmDashboard from './SwarmDashboard';
import SwarmDashboardMax from './SwarmDashboardMax';

function App() {
    const [view, setView] = useState('metrics');

    return (
        <div style={{ minHeight: '100vh', background: '#0d1117' }}>
            {/* View Switcher */}
            <div style={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 100,
                display: 'flex',
                gap: 8,
                fontFamily: 'monospace'
            }}>
                <ViewButton
                    active={view === 'metrics'}
                    onClick={() => setView('metrics')}
                    icon="📊"
                    label="Metrics"
                />
                <ViewButton
                    active={view === 'swarm'}
                    onClick={() => setView('swarm')}
                    icon="🧬"
                    label="Swarm"
                />
                <ViewButton
                    active={view === 'multinode'}
                    onClick={() => setView('multinode')}
                    icon="🌐"
                    label="Multi-Node"
                />
            </div>

            {/* Dashboard Views */}
            {view === 'metrics' && <Dashboard />}
            {view === 'swarm' && <SwarmDashboard />}
            {view === 'multinode' && <SwarmDashboardMax />}
        </div>
    );
}

function ViewButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                background: active ? '#238636' : '#21262d',
                color: '#c9d1d9',
                fontFamily: 'monospace',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
