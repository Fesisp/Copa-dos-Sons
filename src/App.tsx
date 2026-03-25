/**
 * Main App Component
 * Routes between screens and initializes game services
 */

import { useEffect, useState } from 'react';
import {
  MenuScreen,
  LevelSelectScreen,
  GameScreen,
  ResultsScreen,
  CreationScreen,
  ChallengeListScreen,
} from './ui/screens';
import { audioManager } from './services/audioManager';
import type { AppScreen } from './types';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize services on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize audio manager
        await audioManager.initialize();
        console.log('✓ App initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // App can continue without audio in some cases
        setIsInitialized(true);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      audioManager.destroy();
    };
  }, []);

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-field-50 to-uniform-50">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">⚽</div>
          <p className="font-display text-xl font-bold text-neutral-700">
            Carregando Copa dos Sons...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen === 'menu' && (
        <MenuScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'levelSelect' && (
        <LevelSelectScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'game' && (
        <GameScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'creation' && (
        <CreationScreen onNavigate={handleNavigate} />
      )}
      {currentScreen === 'challengeList' && (
        <ChallengeListScreen onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default App;
