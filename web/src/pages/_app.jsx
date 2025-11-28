/**
 * 0RB SYSTEM - Next.js App Entry
 * THE SIMULATION AWAKENS
 */

import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Context Providers
import { SystemProvider } from '@/context/SystemContext';
import { AgentProvider } from '@/context/AgentContext';
import { CopaProvider } from '@/context/CopaContext';
import { CryptoProvider } from '@/context/CryptoContext';

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="0RB SYSTEM - The Simulation Awakens. It's not a game. It's THE game." />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <title>0RB SYSTEM</title>
      </Head>

      <SystemProvider>
        <AgentProvider>
          <CopaProvider>
            <CryptoProvider>
              <Component {...pageProps} />
            </CryptoProvider>
          </CopaProvider>
        </AgentProvider>
      </SystemProvider>
    </>
  );
}
