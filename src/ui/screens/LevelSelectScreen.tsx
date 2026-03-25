/**
 * Level Select Screen
 * Difficulty level selection screen
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DifficultySelector, Button } from '../components';
import { useGameStore } from '../../store/gameStore';
import type { AppScreen, DifficultyLevel } from '../../types';

interface LevelSelectScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onNavigate }) => {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel | null>(null);

  const currentPlayer = useGameStore((s) => s.currentPlayer);
  const selectDifficulty = useGameStore((s) => s.selectDifficulty);
  const initializeGame = useGameStore((s) => s.initializeGame);

  const handleSelectDifficulty = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    if (selectedDifficulty && currentPlayer) {
      selectDifficulty(selectedDifficulty);
      initializeGame(currentPlayer, selectedDifficulty);
      onNavigate('game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-field-50 to-uniform-50 p-6">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => onNavigate('menu')}
            className="text-3xl hover:scale-110 transition-transform"
          >
            ←
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-field-700">
            Escolha o nível
          </h1>
        </div>
        <p className="text-neutral-600 ml-12">
          Olá, {currentPlayer?.name}! Selecione um nível para começar
        </p>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <DifficultySelector
          selected={selectedDifficulty}
          onSelect={handleSelectDifficulty}
        />
      </motion.div>

      {/* Info Box */}
      {selectedDifficulty && (
        <motion.div
          className="max-w-4xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-lg border-l-4 border-uniform-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-display font-bold text-lg mb-2">Como funciona:</h3>
          <ul className="text-neutral-600 space-y-1 text-sm">
            <li>🔊 Você ouvirá um som (fonema)</li>
            <li>🖼️ Escolha a imagem que corresponde ao som</li>
            <li>⭐ Acerte para ganhar pontos</li>
            <li>🎯 Alcance 80% de acertos para vencer!</li>
          </ul>
        </motion.div>
      )}

      {/* Start Button */}
      <motion.div
        className="max-w-4xl mx-auto flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="success"
          size="lg"
          disabled={!selectedDifficulty}
          onClick={handleStartGame}
        >
          🎮 Começar Jogo
        </Button>
      </motion.div>
    </div>
  );
};
