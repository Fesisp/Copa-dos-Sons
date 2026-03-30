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
  const checkWordCompletion = useGameStore((s) => s.checkWordCompletion);
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
    <div className="min-h-screen bg-gradient-to-b from-field-100 to-uniform-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" onClick={() => { resetCurrentMatch(); onNavigate('vestiario'); }}>← Sair da Partida</Button>
          <span className="px-3 py-1 rounded-full bg-white/80 text-sm font-display font-bold text-field-700 shadow">
            {matchSource === 'official' ? 'Partida Oficial' : 'Partida da Comunidade'}
          </span>
          <Button variant="primary" size="sm" onClick={() => void audioManager.playWord(targetWord)}>🔊 Ouvir Jogada</Button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
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
                status="idle"
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
                  if (isCorrect) {
                    checkWordCompletion();
                  }
                }}
              />
            );
          })}
        </div>

        {matchStatus === 'victory' && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border-l-4 border-yellow-400">
            <h2 className="font-display text-3xl font-bold text-field-700 mb-2">GOOOOL! ⚽</h2>
            <p className="text-neutral-700 mb-4">Você atraiu +{crowdDelta} torcedores nesta jogada.</p>

            {matchSource === 'official' && (
              <Button variant="primary" size="md" onClick={() => { resetCurrentMatch(); onNavigate('campo'); }}>
                Próxima Partida Oficial
              </Button>
            )}
          </div>
        )}
      </div>

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
