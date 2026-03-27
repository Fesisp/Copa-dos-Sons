import React, { useState } from 'react';
import { Button, PhonemeCard } from '../components';
import { useGameStore } from '../../store/gameStore';
import { customWordService } from '../../services/databaseService';
import { audioManager } from '../../services/audioManager';
import type { AppScreen } from '../../types';

interface PranchetaScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const PranchetaScreen: React.FC<PranchetaScreenProps> = ({ onNavigate }) => {
  const player = useGameStore((s) => s.currentPlayer);
  const cardsCatalog = useGameStore((s) => s.cardsCatalog);
  const [word, setWord] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const unlockedSet = new Set(player?.unlockedPhonemes ?? []);
  const unlockedCards = cardsCatalog.filter((card) => unlockedSet.has(card.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
          <h1 className="font-display text-3xl font-bold text-field-800">Prancheta</h1>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg mb-5">
          <p className="text-neutral-700 font-display font-bold mb-3">Linha de Passe</p>
          <div className="flex flex-wrap gap-2 min-h-12">
            {word.length === 0 ? (
              <span className="text-neutral-500">Monte sua jogada com as cartas desbloqueadas.</span>
            ) : (
              word.map((token, index) => (
                <span key={`${token}-${index}`} className="px-3 py-2 rounded-lg bg-uniform-600 text-white font-display font-bold uppercase">
                  {token}
                </span>
              ))
            )}
          </div>

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
                  setWord([]);
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              Salvar Tática
            </Button>
            <Button variant="danger" size="md" disabled={word.length === 0} onClick={() => setWord((prev) => prev.slice(0, -1))}>
              Desfazer
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
              onClick={() => {
                setWord((prev) => [...prev, card.audioKey]);
                void audioManager.playPhoneme(card.audioKey);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
