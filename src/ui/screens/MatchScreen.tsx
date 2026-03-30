import React, { useRef, useState } from 'react';
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
  const [showVarModal, setShowVarModal] = useState(false);
  const [showGoalBurst, setShowGoalBurst] = useState(false);
  const [fieldShake, setFieldShake] = useState(false);
  const [wrongCardId, setWrongCardId] = useState<string | null>(null);
  const [showNearMissHint, setShowNearMissHint] = useState(false);
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

  const toCard = (token: string, index: number): Card => {
    const known = cardsCatalog.find((card) => card.audioKey === token || card.id === token);
    if (known) {
      return { ...known, id: `${known.id}-${index}` };
    }

    return {
      id: `${token}-${index}`,
      phoneme: token,
      audioKey: token,
      leagueTier: 'serie-c',
      imageUrl: '/images/placeholder.png',
    };
  };

  React.useEffect(() => {
    if (matchStatus === 'victory' && matchSource === 'community') {
      setShowVarModal(true);
    }
  }, [matchStatus, matchSource]);

  React.useEffect(() => {
    if (matchStatus === 'victory') {
      setShowGoalBurst(true);
      const timeoutId = window.setTimeout(() => setShowGoalBurst(false), 900);
      return () => window.clearTimeout(timeoutId);
    }
  }, [matchStatus]);

  if (targetWord.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="mb-4">Nenhuma partida ativa.</p>
          <Button variant="secondary" size="md" onClick={() => onNavigate('vestiario')}>Voltar ao Vestiário</Button>
        </div>
      </div>
    );
  }

  const completedSlots = assembledSlots.filter(Boolean).length;
  const draggableCards = availableCards.map((token, index) => toCard(token, index));

  return (
    <div className="min-h-screen stadium-bg pitch-markings p-6">
      <div className={`max-w-6xl mx-auto ${fieldShake ? 'camera-shake' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" onClick={() => { resetCurrentMatch(); onNavigate('vestiario'); }}>← Sair da Partida</Button>
          <span className="px-3 py-1 rounded-full bg-white/90 text-sm font-display font-bold text-field-700 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
            {matchSource === 'official' ? 'Partida Oficial' : 'Partida da Comunidade'}
          </span>
          <Button variant="primary" size="sm" onClick={() => void audioManager.playWord(targetWord)}>🔊 Ouvir Jogada</Button>
        </div>

        <div className={`bg-white/95 rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.14)] mb-6 border border-white/80 ${matchStatus === 'victory' ? 'goal-flash' : ''}`}>
          <p className="font-display font-bold text-lg text-neutral-700 text-center mb-4">Monte a jogada no gramado</p>
          <div className="flex flex-wrap justify-center gap-3">
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
          <p className="text-center text-sm text-neutral-600 mt-4">Progresso: {completedSlots}/{targetWord.length} slots</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {draggableCards.map((card) => {
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
                  const draggedCard = draggableCards.find((candidate) => candidate.id === id);
                  if (!draggedCard) return;

                  const isCorrect = handleDrop(draggedCard.audioKey, slotIndex);
                  if (!isCorrect) {
                    setWrongCardId(id);
                    setFieldShake(true);
                    setShowNearMissHint(true);
                    void audioManager.playNearMissSound();
                    window.setTimeout(() => setWrongCardId(null), 360);
                    window.setTimeout(() => setFieldShake(false), 360);
                    window.setTimeout(() => setShowNearMissHint(false), 1100);
                  } else {
                    void audioManager.playSuccessSound();
                  }
                }}
              />
            );
          })}
        </div>

        {matchStatus === 'victory' && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.14)] border-l-8 border-gold-500">
            <h2 className="font-display text-3xl font-bold text-field-700 mb-2">GOOOOL! ⚽</h2>
            <p className="text-neutral-700 mb-4">Você atraiu +{crowdDelta} torcedores nesta jogada.</p>
            <p className="text-sm text-neutral-600 mb-4">Figurinha dourada destravada e torcida em festa!</p>

            {matchSource === 'official' && (
              <Button variant="primary" size="md" onClick={() => { resetCurrentMatch(); onNavigate('campo'); }}>
                Próxima Partida Oficial
              </Button>
            )}
          </div>
        )}
      </div>

      {showGoalBurst && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="animate-goal-pop px-8 py-4 rounded-3xl bg-gold-500/90 text-uniform-800 font-display text-5xl md:text-7xl font-extrabold shadow-[0_18px_35px_rgba(0,0,0,0.35)]">
            GOL!
          </div>
        </div>
      )}

      {showNearMissHint && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="rounded-2xl bg-white/95 border border-gold-300 px-5 py-2 shadow-[0_8px_0_0_rgba(0,0,0,0.12)] text-field-700 font-display font-bold text-lg animate-fade-in">
            Quase lá! Tenta de novo ⚽
          </div>
        </div>
      )}

      {showVarModal && matchSource === 'community' && selectedCommunityWordId && (
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
                  setShowVarModal(false);
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
                  setShowVarModal(false);
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
