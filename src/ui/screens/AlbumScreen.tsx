import React from 'react';
import { motion } from 'framer-motion';
import { Button, PhonemeCard } from '../components';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../services/audioManager';
import type { AppScreen } from '../../types';

interface AlbumScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const AlbumScreen: React.FC<AlbumScreenProps> = ({ onNavigate }) => {
  const cardsCatalog = useGameStore((s) => s.cardsCatalog);
  const currentPlayer = useGameStore((s) => s.currentPlayer);

  const unlocked = new Set(currentPlayer?.unlockedPhonemes ?? []);

  const handlePlayCard = async (audioKey: string) => {
    await audioManager.playPhoneme(audioKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" size="sm" onClick={() => onNavigate('vestiario')}>← Vestiário</Button>
          <h1 className="font-display text-3xl font-bold text-field-800">Álbum da Copa</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cardsCatalog.map((card) => {
            const isUnlocked = unlocked.has(card.id);
            return (
              <motion.div key={card.id} whileHover={{ scale: 1.02 }}>
                <PhonemeCard
                  phoneme={card}
                  status="idle"
                  variant={isUnlocked ? 'normal' : 'blocked'}
                  onClick={() => {
                    if (isUnlocked) {
                      void handlePlayCard(card.audioKey);
                    }
                  }}
                  disabled={!isUnlocked}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
