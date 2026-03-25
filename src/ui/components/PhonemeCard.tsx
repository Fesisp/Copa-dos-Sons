/**
 * PhonemeCard Component
 * Card displaying a phoneme image for selection
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Phoneme } from '../../types';

interface PhonemeCardProps {
  phoneme: Phoneme;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick?: (phoneme: Phoneme) => void;
  disabled?: boolean;
}

export const PhonemeCard: React.FC<PhonemeCardProps> = ({
  phoneme,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(phoneme);
    }
  };

  return (
    <motion.div
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isWrong ? 'bg-error-100 border-2 border-error-500' : 'bg-white'}
        ${isCorrect ? 'bg-success-100 border-2 border-success-500' : ''}
        ${isSelected && !isCorrect && !isWrong ? 'border-2 border-uniform-500' : 'border-2 border-neutral-200'}
        shadow-card hover:shadow-md
      `}
      onClick={handleClick}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isCorrect ? { scale: 1.1 } : isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: isCorrect ? 0.5 : isWrong ? 0.4 : 0.2 }}
    >
      <div className="aspect-square w-full bg-neutral-50 rounded-md flex items-center justify-center overflow-hidden mb-3">
        <img
          src={phoneme.imageUrl}
          alt={phoneme.phoneme}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/placeholder.png';
          }}
        />
      </div>

      <div className="text-center">
        <p className="font-display text-2xl font-bold text-neutral-900 mb-1">
          {phoneme.phoneme.toUpperCase()}
        </p>
        <p className="text-sm text-neutral-600">
          {phoneme.examples[0]}
        </p>
      </div>

      {isCorrect && (
        <div className="absolute top-2 right-2 bg-success-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
          ✓
        </div>
      )}

      {isWrong && (
        <div className="absolute top-2 right-2 bg-error-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
          ✗
        </div>
      )}
    </motion.div>
  );
};
