/**
 * Main App Component
 * Routes between screens and initializes game services
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { audioManager } from './services/audioManager';
import { playerService } from './services/databaseService';
import { useGameStore } from './store/gameStore';
import type { AppScreen } from './types';
import {
  loadAlbumScreen,
  loadBoletimTecnicoScreen,
  loadCampeonatoScreen,
  loadCampoScreen,
  loadMatchScreen,
  loadPranchetaScreen,
  loadVestiarioScreen,
  prefetchScreens,
} from './ui/screens/screenLoaders';
import './index.css';

const VestiarioScreen = lazy(() =>
  loadVestiarioScreen().then((module) => ({ default: module.VestiarioScreen }))
);

const AlbumScreen = lazy(() =>
  loadAlbumScreen().then((module) => ({ default: module.AlbumScreen }))
);

const PranchetaScreen = lazy(() =>
  loadPranchetaScreen().then((module) => ({ default: module.PranchetaScreen }))
);

const CampoScreen = lazy(() =>
  loadCampoScreen().then((module) => ({ default: module.CampoScreen }))
);

const MatchScreen = lazy(() =>
  loadMatchScreen().then((module) => ({ default: module.MatchScreen }))
);

const CampeonatoScreen = lazy(() =>
  loadCampeonatoScreen().then((module) => ({ default: module.CampeonatoScreen }))
);

const BoletimTecnicoScreen = lazy(() =>
  loadBoletimTecnicoScreen().then((module) => ({ default: module.BoletimTecnicoScreen }))
);

const ScreenLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="font-display text-xl text-neutral-700">Carregando módulo...</p>
  </div>
);

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('vestiario');
  const [isInitialized, setIsInitialized] = useState(false);
  const hasPrefetchedFromVestiario = useRef(false);
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

  useEffect(() => {
    if (!isInitialized || !currentPlayer || currentScreen !== 'vestiario' || hasPrefetchedFromVestiario.current) {
      return;
    }

    hasPrefetchedFromVestiario.current = true;

    const runPrefetch = () => {
      prefetchScreens(['campo', 'match', 'prancheta', 'album', 'campeonato']);
    };

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const requestIdle = globalThis.requestIdleCallback;
    const cancelIdle = globalThis.cancelIdleCallback;

    if (typeof requestIdle === 'function') {
      idleId = requestIdle(runPrefetch, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(runPrefetch, 250);
    }

    return () => {
      if (idleId !== undefined && typeof cancelIdle === 'function') {
        cancelIdle(idleId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isInitialized, currentPlayer, currentScreen]);

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

      <Suspense fallback={<ScreenLoadingFallback />}>
        {currentPlayer && currentScreen === 'vestiario' && <VestiarioScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'album' && <AlbumScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'prancheta' && <PranchetaScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'campo' && <CampoScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'match' && <MatchScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'campeonato' && <CampeonatoScreen onNavigate={handleNavigate} />}
        {currentPlayer && currentScreen === 'boletim' && <BoletimTecnicoScreen onNavigate={handleNavigate} />}
      </Suspense>
    </>
  );
}

export default App;
