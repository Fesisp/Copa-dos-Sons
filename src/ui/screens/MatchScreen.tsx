import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, DropZone, PhonemeCard } from '../components';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../services/audioManager';
import { customWordService } from '../../services/databaseService';
import type { AppScreen, Card } from '../../types';

interface MatchScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const MatchScreen: React.FC<MatchScreenProps> = ({ onNavigate }) => {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [fieldShake, setFieldShake] = useState(false);
  const [wrongCardId, setWrongCardId] = useState<string | null>(null);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const cardsCatalog = useGameStore((s) => s.cardsCatalog);
  const targetWord = useGameStore((s) => s.targetWord);
  const availableCards = useGameStore((s) => s.availableCards);
  const assembledSlots = useGameStore((s) => s.assembledSlots);
  const matchStatus = useGameStore((s) => s.matchStatus);
  const matchSource = useGameStore((s) => s.currentMatchSource);
  const selectedCommunityWordId = useGameStore((s) => s.selectedCommunityWordId);
  const crowdDelta = useGameStore((s) => s.crowdDelta);

  const handleDrop = useGameStore((s) => s.handleDrop);
  const resetCurrentMatch = useGameStore((s) => s.resetCurrentMatch);

  const findSlotByPoint = (point: { x: number; y: number }): number | null => {
    for (let index = 0; index < slotRefs.current.length; index += 1) {
      const element = slotRefs.current[index];
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const isInside = point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
      if (isInside) return index;
    }
    return null;
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const cards = availableCards.map((token, index) => {
        const known = cardsCatalog.find((card) => card.audioKey === token || card.id === token);
        if (known) {
          return { ...known, id: `${known.id}-${index}` };
        }

        return {
          id: `${token}-${index}`,
          phoneme: token,
          audioKey: token,
          leagueTier: 'serie-c' as const,
          imageUrl: '/images/placeholder.png',
        };
      });

      setShuffledCards([...cards].sort(() => Math.random() - 0.5));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [availableCards, cardsCatalog]);

  const showVarModal = matchStatus === 'victory' && matchSource === 'community' && !!selectedCommunityWordId;

  if (targetWord.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen stadium-bg pitch-markings p-4 md:p-8 flex flex-col">
      <div className={`max-w-5xl mx-auto w-full flex-1 flex flex-col ${fieldShake ? 'camera-shake' : ''}`}>
        <div className="flex items-center justify-between mb-8">
          <Button variant="secondary" size="sm" onClick={() => { resetCurrentMatch(); onNavigate('vestiario'); }}>
            ⬅ Sair
          </Button>
          <div className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-display font-bold shadow-lg">
            {matchSource === 'official' ? '🏆 Partida Oficial' : '🤝 Desafio da Turma'}
          </div>
          <div className="w-[100px]" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void audioManager.playWord(targetWord)}
            className="relative flex flex-col items-center justify-center w-36 h-36 bg-gold-400 rounded-full border-8 border-white shadow-card-float mb-8 z-10 group cursor-pointer"
            type="button"
          >
            <div className="absolute inset-0 rounded-full border-4 border-gold-400 animate-ping opacity-60" />
            <span className="text-6xl group-hover:scale-110 transition-transform">🔊</span>
            <span className="text-white font-display font-bold text-sm uppercase mt-1 drop-shadow-md">Ouvir</span>
          </motion.button>

          <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/20 shadow-2xl mb-12 flex flex-wrap justify-center gap-4 ${matchStatus === 'victory' ? 'goal-flash' : ''}`}>
            {targetWord.map((_, index) => (
              <DropZone
                key={`slot-${index}`}
                ref={(element) => { slotRefs.current[index] = element; }}
                slotIndex={index}
                value={assembledSlots[index]}
                isActive={hoveredSlot === index}
                isCompleted={matchStatus === 'victory'}
              />
            ))}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-t-3xl p-6 -mx-4 md:mx-0 border-t border-white/20">
          <p className="text-white/80 text-center font-display font-bold mb-4 uppercase tracking-widest text-sm">As tuas cartas</p>
          <div className="flex flex-wrap justify-center gap-4">
          {shuffledCards.map((card) => {
            const isUsed = assembledSlots.includes(card.audioKey);
            if (isUsed && matchStatus !== 'victory') {
              return <div key={card.id} className="w-28 h-36 opacity-0" />;
            }

            return (
              <PhonemeCard
                key={card.id}
                phoneme={card}
                status={wrongCardId === card.id ? 'incorrect' : 'idle'}
                variant="normal"
                draggable={matchStatus === 'playing'}
                onClick={() => void audioManager.playPhoneme(card.audioKey)}
                onDragMove={(_id, point) => {
                  const slotIndex = findSlotByPoint(point);
                  setHoveredSlot(slotIndex);
                }}
                onDragEndPosition={(id, point) => {
                  const slotIndex = findSlotByPoint(point);
                  setHoveredSlot(null);
                  if (slotIndex === null) return;

                  const isCorrect = handleDrop(card.audioKey, slotIndex);
                  if (!isCorrect) {
                    setWrongCardId(id);
                    setFieldShake(true);
                    void audioManager.playNearMissSound();
                    window.setTimeout(() => setWrongCardId(null), 400);
                    window.setTimeout(() => setFieldShake(false), 400);
                  } else {
                    void audioManager.playSuccessSound();
                  }
                }}
              />
            );
          })}
          </div>
        </div>

        {matchStatus === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-8 shadow-2xl border-b-8 border-gold-500 z-50 text-center min-w-[320px]"
          >
            <h2 className="font-display text-4xl font-extrabold text-field-600 mb-2">GOLAÇO! ⚽</h2>
            <p className="text-neutral-700 text-lg font-bold mb-6">+{crowdDelta} Torcedores</p>
            {matchSource === 'official' && (
              <Button variant="primary" size="md" onClick={() => { resetCurrentMatch(); onNavigate('campo'); }}>
                Continuar a Jogar
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {matchStatus === 'victory' && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-[120px] md:text-[180px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
          >
            ⚽
          </motion.div>
        </div>
      )}

      {showVarModal && selectedCommunityWordId && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-l-8 border-yellow-400">
            <h3 className="font-display text-2xl text-field-700 font-bold mb-2">VAR - Árbitro de Vídeo</h3>
            <p className="text-sm text-neutral-600 mb-4">A jogada fez sentido? Vote para subir no ranking da turma.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="success"
                size="md"
                onClick={async () => {
                  await customWordService.voteWord(selectedCommunityWordId, 'golaco');
                  resetCurrentMatch();
                  onNavigate('campeonato');
                }}
              >
                👍 Golaço
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={async () => {
                  await customWordService.voteWord(selectedCommunityWordId, 'falta');
                  resetCurrentMatch();
                  onNavigate('campeonato');
                }}
              >
                👎 Falta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
