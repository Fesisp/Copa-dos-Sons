/**
 * Main App Component
 * Routes between screens and initializes game services
 */

import { useEffect, useState } from 'react';
import {
  VestiarioScreen,
  AlbumScreen,
  PranchetaScreen,
  CampoScreen,
  MatchScreen,
  CampeonatoScreen,
} from './ui/screens';
import { audioManager } from './services/audioManager';
import { playerService } from './services/databaseService';
import { useGameStore } from './store/gameStore';
import type { AppScreen } from './types';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('vestiario');
  const [isInitialized, setIsInitialized] = useState(false);
  const setCurrentPlayer = useGameStore((state) => state.setCurrentPlayer);
  const currentPlayer = useGameStore((state) => state.currentPlayer);

  // Initialize services on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize audio manager
        await audioManager.initialize();

        const persistedPlayer = await playerService.upsertPlayer('Craque da Turma');
        setCurrentPlayer(persistedPlayer);

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
  }, [setCurrentPlayer]);

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
      {!currentPlayer && currentScreen === 'vestiario' && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-display text-xl text-neutral-700">Preparando seu vestiário...</p>
        </div>
      )}

      {currentPlayer && currentScreen === 'vestiario' && <VestiarioScreen onNavigate={handleNavigate} />}
      {currentPlayer && currentScreen === 'album' && <AlbumScreen onNavigate={handleNavigate} />}
      {currentPlayer && currentScreen === 'prancheta' && <PranchetaScreen onNavigate={handleNavigate} />}
      {currentPlayer && currentScreen === 'campo' && <CampoScreen onNavigate={handleNavigate} />}
      {currentPlayer && currentScreen === 'match' && <MatchScreen onNavigate={handleNavigate} />}
      {currentPlayer && currentScreen === 'campeonato' && <CampeonatoScreen onNavigate={handleNavigate} />}
    </>
  );
}

export default App;
