/**
 * PhonemeCard Component
 * Card displaying a phoneme image for selection
 */

import React from 'react';
import { motion, type PanInfo, useReducedMotion } from 'framer-motion';
import type { Card } from '../../types';
import { audioManager } from '../../services/audioManager';

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
  const shouldReduceMotion = useReducedMotion();
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
    correct: shouldReduceMotion
      ? { scale: 1.03, rotate: 0, x: 0, transition: { duration: 0.2 } }
      : { scale: 1.1, rotate: [0, -5, 5, -5, 0], x: 0, transition: { duration: 0.5 } },
    incorrect: shouldReduceMotion
      ? { x: [-3, 3, 0], scale: 1, rotate: 0, transition: { duration: 0.2 } }
      : { x: [-6, 6, -5, 5, 0], scale: 1, rotate: [0, -2, 2, -2, 0], transition: { duration: 0.35 } },
  };

  const borderColors = {
    idle: isSelected ? 'border-uniform-500 border-4' : 'border-white border-4',
    correct: 'border-field-500 border-8 shadow-green-500/50',
    incorrect: 'border-red-500 border-4 opacity-50',
  };

  const variantClasses = {
    normal: 'opacity-100 saturate-100',
    blocked: 'opacity-55 grayscale',
    shiny: 'ring-4 ring-gold-300 shadow-[0_0_35px_rgba(255,223,0,0.8)] holo-sheen',
  };

  const isBlocked = variant === 'blocked';
  const isVowel = phoneme?.isVowel ?? false;

  const baseSurface = isVowel
    ? 'bg-gradient-to-br from-cyan-200 via-sky-200 to-uniform-200'
    : 'bg-gradient-to-br from-amber-200 via-orange-200 to-gold-200';

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
      whileHover={!disabled && !isBlocked && resolvedStatus === 'idle' && !shouldReduceMotion ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isBlocked && resolvedStatus === 'idle' ? (shouldReduceMotion ? { scale: 0.99 } : { scale: 0.95 }) : {}}
      drag={draggable && !disabled && !isBlocked && resolvedStatus === 'idle'}
      dragSnapToOrigin={draggable}
      dragElastic={0.28}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 520, bounceDamping: 16 }}
      whileDrag={shouldReduceMotion ? { scale: 1.02, rotate: 0 } : { scale: 1.1, rotate: 5, boxShadow: '0 22px 30px rgba(0, 0, 0, 0.32)' }}
      onDragStart={() => {
        if (draggable && !disabled && !isBlocked) {
          void audioManager.playUiSwishSound();
        }
      }}
      onDrag={draggable ? handleDrag : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onClick={handleClick}
      className={`relative cursor-pointer rounded-2xl shadow-card-physical overflow-hidden ${disabled || isBlocked ? 'cursor-not-allowed' : ''} ${borderColors[resolvedStatus]} ${variantClasses[variant]}`}
    >
      <div className={`relative aspect-square w-full p-3 ${baseSurface}`}>
        <div className="absolute inset-2 rounded-xl border-2 border-white/60 pointer-events-none" />

        <div className="w-full h-full p-2 flex items-center justify-center">
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
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/85 to-white/50 flex flex-col items-center justify-center border-2 border-dashed border-field-400">
            <span className="text-5xl">⚽</span>
            <span className="font-display font-bold text-3xl text-field-700 uppercase mt-1">
              {resolvedAltText}
            </span>
          </div>
        )}
        </div>

        <div className="absolute top-2 left-2 rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-display font-bold uppercase text-neutral-700">
          {isVowel ? 'Vogal' : 'Consoante'}
        </div>
      </div>

      {!!resolvedAltText && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-neutral-900/75 text-white px-3 py-1 rounded-full text-sm font-display font-bold uppercase">
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
