/**
 * 0RB SYSTEM - Main Page
 * THE SIMULATION AWAKENS
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for 3D components (client-side only)
const LoadingScreen = dynamic(
  () => import('@/components/LoadingScreen'),
  { ssr: false }
);

const MainConsole = dynamic(
  () => import('@/components/MainConsole'),
  { ssr: false }
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [systemReady, setSystemReady] = useState(false);

  useEffect(() => {
    // Simulate boot sequence
    const bootTimer = setTimeout(() => {
      setIsLoading(false);
      setSystemReady(true);
    }, 5000); // 5 second boot sequence

    return () => clearTimeout(bootTimer);
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
    setSystemReady(true);
  };

  return (
    <main className="orb-system">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadComplete} />
      ) : (
        <MainConsole />
      )}
    </main>
  );
}
