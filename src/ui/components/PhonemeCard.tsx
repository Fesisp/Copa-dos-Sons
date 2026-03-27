/**
 * PhonemeCard Component
 * Card displaying a phoneme image for selection
 */

import React from 'react';
import { motion, type PanInfo } from 'framer-motion';
import type { Card } from '../../types';

interface PhonemeCardProps {
  phoneme?: Card;
  id?: string;
  imageUrl?: string;
  altText?: string;
  status?: 'idle' | 'correct' | 'incorrect';
  variant?: 'normal' | 'blocked' | 'shiny';
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick?: ((phoneme: Card) => void) | ((id: string) => void);
  disabled?: boolean;
  draggable?: boolean;
  onDragMove?: (phonemeId: string, point: { x: number; y: number }) => void;
  onDragEndPosition?: (phonemeId: string, point: { x: number; y: number }) => void;
}

export const PhonemeCard: React.FC<PhonemeCardProps> = ({
  phoneme,
  id,
  imageUrl,
  altText,
  status,
  variant = 'normal',
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  onClick,
  disabled = false,
  draggable = false,
  onDragMove,
  onDragEndPosition,
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const resolvedId = phoneme?.id ?? id ?? '';
  const resolvedImageUrl = phoneme?.imageUrl ?? imageUrl ?? '/images/placeholder.png';
  const resolvedAltText = phoneme?.phoneme ?? altText ?? resolvedId;
  const resolvedStatus = status ?? (isCorrect ? 'correct' : isWrong ? 'incorrect' : 'idle');

  const handleClick = () => {
    if (!disabled && onClick) {
      if (phoneme) {
        (onClick as (phoneme: Card) => void)(phoneme);
      } else if (resolvedId) {
        (onClick as (id: string) => void)(resolvedId);
      }
    }
  };

  const animations = {
    idle: { scale: 1, rotate: 0, x: 0 },
    correct: { scale: 1.1, rotate: [0, -5, 5, -5, 0], x: 0, transition: { duration: 0.5 } },
    incorrect: { x: [-10, 10, -10, 10, 0], scale: 1, rotate: 0, transition: { duration: 0.4 } },
  };

  const borderColors = {
    idle: isSelected ? 'border-uniform-500 border-4' : 'border-white border-4',
    correct: 'border-field-500 border-8 shadow-green-500/50',
    incorrect: 'border-red-500 border-4 opacity-50',
  };

  const variantClasses = {
    normal: 'opacity-100 saturate-100',
    blocked: 'opacity-55 grayscale',
    shiny: 'ring-4 ring-yellow-300 shadow-[0_0_35px_rgba(250,204,21,0.8)]',
  };

  const isBlocked = variant === 'blocked';

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!resolvedId || !onDragMove) return;
    onDragMove(resolvedId, info.point);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!resolvedId || !onDragEndPosition) return;
    onDragEndPosition(resolvedId, info.point);
  };

  return (
    <motion.div
      animate={animations[resolvedStatus]}
      whileHover={!disabled && !isBlocked && resolvedStatus === 'idle' ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isBlocked && resolvedStatus === 'idle' ? { scale: 0.95 } : {}}
      drag={draggable && !disabled && !isBlocked && resolvedStatus === 'idle'}
      dragSnapToOrigin={draggable}
      onDrag={draggable ? handleDrag : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onClick={handleClick}
      className={`relative cursor-pointer rounded-2xl bg-white shadow-xl overflow-hidden ${disabled || isBlocked ? 'cursor-not-allowed' : ''} ${borderColors[resolvedStatus]} ${variantClasses[variant]}`}
    >
      <div className="aspect-square w-full p-4 flex items-center justify-center">
        {!imageFailed ? (
          <img
            src={resolvedImageUrl}
            alt={resolvedAltText}
            className="w-full h-full object-contain drop-shadow-md"
            draggable={false}
            onError={() => {
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-field-100 to-uniform-100 flex flex-col items-center justify-center border-2 border-dashed border-field-400">
            <span className="text-5xl">⚽</span>
            <span className="font-display font-bold text-3xl text-field-700 uppercase mt-1">
              {resolvedAltText}
            </span>
          </div>
        )}
      </div>

      {!!resolvedAltText && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-neutral-900/70 text-white px-3 py-1 rounded-full text-sm font-display font-bold uppercase">
          {resolvedAltText}
        </div>
      )}

      {variant === 'blocked' && (
        <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
          <span className="font-display font-bold text-white text-lg">BLOQUEADO</span>
        </div>
      )}

      {resolvedStatus === 'correct' && (
        <div className="absolute top-2 right-2 bg-field-500 rounded-full p-1 shadow-md">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};
