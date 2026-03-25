/**
 * DifficultySelector Component
 * Component to select game difficulty level
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DifficultyLevel } from '../../types';

interface DifficultySelectorProps {
  selected: DifficultyLevel | null;
  onSelect: (difficulty: DifficultyLevel) => void;
}

const difficulties: Array<{
  level: DifficultyLevel;
  label: string;
  description: string;
  emoji: string;
  color: string;
}> = [
  {
    level: 'easy',
    label: 'Fácil',
    description: 'Sons simples: p, b, m, t, d, n, k, g',
    emoji: '🌱',
    color: 'from-field-400 to-field-500',
  },
  {
    level: 'medium',
    label: 'Médio',
    description: 'Sons intermediários: fricativas e líquidas',
    emoji: '🌳',
    color: 'from-field-600 to-field-700',
  },
  {
    level: 'hard',
    label: 'Difícil',
    description: 'Sons complexos: dígrafos e nasalizações',
    emoji: '🏆',
    color: 'from-field-700 to-field-900',
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {difficulties.map((diff) => (
        <motion.button
          key={diff.level}
          onClick={() => onSelect(diff.level)}
          className={`
            relative p-6 rounded-xl text-white font-display font-bold
            transition-all duration-200 shadow-md
            ${selected === diff.level ? 'ring-4 ring-uniform-300 scale-105' : 'hover:scale-102'}
            bg-gradient-to-br ${diff.color}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: difficulties.indexOf(diff) * 0.1 }}
        >
          <div className="text-5xl mb-3">{diff.emoji}</div>
          <h3 className="text-2xl mb-2">{diff.label}</h3>
          <p className="text-sm text-white/90">{diff.description}</p>

          {selected === diff.level && (
            <motion.div
              className="absolute top-3 right-3 bg-white text-field-600 rounded-full w-8 h-8 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ✓
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};
