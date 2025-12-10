import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';
import SwarmDashboard from './SwarmDashboard';

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
                <button
                    onClick={() => setView('metrics')}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: view === 'metrics' ? '#238636' : '#21262d',
                        color: '#c9d1d9',
                        fontFamily: 'monospace'
                    }}
                >
                    📊 Metrics
                </button>
                <button
                    onClick={() => setView('swarm')}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: view === 'swarm' ? '#238636' : '#21262d',
                        color: '#c9d1d9',
                        fontFamily: 'monospace'
                    }}
                >
                    🧬 Swarm
                </button>
            </div>

            {/* Dashboard Views */}
            {view === 'metrics' ? <Dashboard /> : <SwarmDashboard />}
        </div>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
