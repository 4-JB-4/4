/**
 * Simple test page - no 3D stuff
 */
export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#00ffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'monospace'
    }}>
      <h1 style={{
        fontSize: '4rem',
        textShadow: '0 0 20px #00ffff',
        letterSpacing: '0.3em'
      }}>
        0RB SYSTEM
      </h1>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
        THE SIMULATION IS ALIVE
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        border: '2px solid #00ffff',
        boxShadow: '0 0 20px #00ffff',
        cursor: 'pointer'
      }}>
        ENTER THE COCKPIT
      </div>
    </div>
  );
}
