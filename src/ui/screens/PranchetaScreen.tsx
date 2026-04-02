import React, { useEffect, useRef, useState } from 'react';
import { Button, PhonemeCard } from '../components';
import { useGameStore } from '../../store/gameStore';
import { customWordService } from '../../services/databaseService';
import { audioManager } from '../../services/audioManager';
import type { AppScreen } from '../../types';
import { isTokenUnlockedForPhase, normalizePhonemeToken } from '../../config/phonotactics';

interface PranchetaScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const PranchetaScreen: React.FC<PranchetaScreenProps> = ({ onNavigate }) => {
  const player = useGameStore((s) => s.currentPlayer);
  const cardsCatalog = useGameStore((s) => s.cardsCatalog);
  const word = useGameStore((s) => s.labAssemblySlots);
  const difficultyPhase = useGameStore((s) => s.difficultyPhase);
  const maxAssemblySlots = useGameStore((s) => s.maxAssemblySlots);
  const lastAssemblyFeedback = useGameStore((s) => s.lastAssemblyFeedback);
  const startLaboratoryMode = useGameStore((s) => s.startLaboratoryMode);
  const appendLabPhoneme = useGameStore((s) => s.appendLabPhoneme);
  const removeLastLabPhoneme = useGameStore((s) => s.removeLastLabPhoneme);
  const clearLabAssembly = useGameStore((s) => s.clearLabAssembly);
  const [isSaving, setIsSaving] = useState(false);
  const [isLaneActive, setIsLaneActive] = useState(false);
  const compositionLaneRef = useRef<HTMLDivElement | null>(null);

  const unlockedSet = new Set(player?.unlockedPhonemes ?? []);
  const unlockedCards = cardsCatalog.filter(
    (card) => unlockedSet.has(card.id) && isTokenUnlockedForPhase(card.audioKey, difficultyPhase)
  );

  useEffect(() => {
    startLaboratoryMode();
  }, [startLaboratoryMode]);

  const isPointInsideCompositionLane = (point: { x: number; y: number }): boolean => {
    const lane = compositionLaneRef.current;
    if (!lane) return false;

    const rect = lane.getBoundingClientRect();
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  };

  const appendToken = (token: string) => {
    const accepted = appendLabPhoneme(normalizePhonemeToken(token));
    if (accepted) {
      void audioManager.playPhoneme(token);
    } else {
      void audioManager.playNearMissSound();
    }
  };

  return (
    <div className="min-h-screen chalkboard-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
          <h1 className="font-display text-3xl font-bold text-gold-300 drop-shadow">Prancheta</h1>
        </div>

        <div className="bg-white/95 rounded-2xl p-5 shadow-[0_10px_0_0_rgba(0,0,0,0.14)] mb-5 border border-white/70">
          <p className="text-neutral-700 font-display font-bold mb-3 chalk-pass-line">Linha de Passe</p>
          <p className="text-xs text-neutral-500 mb-2">
            Modo Laboratório · Fase {difficultyPhase} · Limite: {maxAssemblySlots} fonemas
          </p>
          <div
            ref={compositionLaneRef}
            className={`flex flex-wrap gap-2 min-h-16 rounded-xl border-2 p-3 transition-all ${
              isLaneActive
                ? 'border-gold-400 bg-gradient-to-r from-gold-50 to-white shadow-[0_0_0_4px_rgba(255,223,0,0.3)]'
                : 'border-dashed border-neutral-300 bg-gradient-to-r from-neutral-50 to-white'
            }`}
          >
            {word.length === 0 ? (
              <span className="text-neutral-500">Monte sua jogada com as cartas desbloqueadas.</span>
            ) : (
              word.map((token, index) => (
                <span key={`${token}-${index}`} className="px-3 py-2 rounded-lg bg-uniform-500 text-white font-display font-bold uppercase shadow-[0_4px_0_0_rgba(0,0,0,0.15)]">
                  {token}
                </span>
              ))
            )}
          </div>

          {lastAssemblyFeedback && (
            <p className="mt-2 text-sm font-display font-bold text-error-600">
              {lastAssemblyFeedback.message}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="primary" size="md" disabled={word.length === 0} onClick={() => void audioManager.playWordSequence(word)}>
              Ouvir Jogada
            </Button>
            <Button
              variant="success"
              size="md"
              isLoading={isSaving}
              disabled={word.length === 0 || isSaving}
              onClick={async () => {
                if (!player) return;
                setIsSaving(true);
                try {
                  await customWordService.saveCustomWord(word, player.name);
                  clearLabAssembly();
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              Salvar Tática
            </Button>
            <Button variant="danger" size="md" disabled={word.length === 0} onClick={removeLastLabPhoneme}>
              Desfazer
            </Button>
            <Button variant="secondary" size="md" disabled={word.length === 0} onClick={clearLabAssembly}>
              Resetar Tentativa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {unlockedCards.map((card) => (
            <PhonemeCard
              key={card.id}
              phoneme={card}
              status="idle"
              variant="normal"
              draggable
              onClick={() => {
                appendToken(card.audioKey);
              }}
              onDragMove={(_id, point) => {
                setIsLaneActive(isPointInsideCompositionLane(point));
              }}
              onDragEndPosition={(_id, point) => {
                const isInside = isPointInsideCompositionLane(point);
                setIsLaneActive(false);
                if (!isInside) return;
                appendToken(card.audioKey);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
