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
  phoneme, id, imageUrl, altText, status,
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

  const isBlocked = variant === 'blocked' || disabled;
  const isVowel = phoneme?.isVowel ?? false;

  const cardTheme = isVowel
    ? 'from-blue-400 via-sky-300 to-cyan-200 border-blue-500'
    : 'from-orange-400 via-amber-300 to-yellow-200 border-orange-500';

  const animations = {
    idle: { scale: 1, rotate: 0, x: 0 },
    correct: shouldReduceMotion
      ? { scale: 1.03, rotate: 0, x: 0, transition: { duration: 0.2 } }
      : { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.4 } },
    incorrect: shouldReduceMotion
      ? { x: [-3, 3, 0], scale: 1, rotate: 0, transition: { duration: 0.2 } }
      : { x: [-8, 8, -5, 5, 0], transition: { type: 'spring' as const, stiffness: 400, damping: 10 } },
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!resolvedId || !onDragEndPosition) return;
    onDragEndPosition(resolvedId, info.point);
  };

  const glowClass = variant === 'shiny' ? 'ring-4 ring-gold-300 shadow-[0_0_35px_rgba(255,223,0,0.6)]' : '';
  const selectedClass = isSelected ? 'ring-4 ring-uniform-300' : '';

  return (
    <motion.div
      animate={animations[resolvedStatus]}
      whileHover={!isBlocked && resolvedStatus === 'idle' && !shouldReduceMotion ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isBlocked && resolvedStatus === 'idle' ? (shouldReduceMotion ? { scale: 0.99 } : { scale: 0.95 }) : {}}
      drag={draggable && !isBlocked && resolvedStatus === 'idle'}
      dragSnapToOrigin={draggable}
      dragElastic={0.4}
      whileDrag={
        shouldReduceMotion
          ? { scale: 1.03, rotate: 0, zIndex: 50 }
          : { scale: 1.15, rotate: 6, boxShadow: '0 30px 40px rgba(0,0,0,0.4)', zIndex: 50 }
      }
      onDragStart={() => {
        if (draggable && !isBlocked) {
          void audioManager.playUiSwishSound();
        }
      }}
      onDrag={draggable ? (_event, info) => onDragMove?.(resolvedId, info.point) : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onClick={() => {
        if (isBlocked || !onClick) return;
        if (phoneme) {
          (onClick as (value: Card) => void)(phoneme);
        } else {
          (onClick as (value: string) => void)(resolvedId);
        }
      }}
      className={`relative cursor-pointer w-28 h-36 rounded-2xl overflow-hidden border-[6px] border-white shadow-card-physical flex-shrink-0 group ${glowClass} ${selectedClass} ${isBlocked ? 'opacity-50 grayscale cursor-not-allowed' : `bg-gradient-to-br ${cardTheme}`}`}
    >
      {!isBlocked && (
        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 -translate-x-full group-hover:animate-holo-sweep pointer-events-none" />
      )}

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

      <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-display font-bold uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
        {isVowel ? 'Vogal' : 'Consoante'}
      </div>

      <div className="absolute inset-2 mt-4 bg-white/90 rounded-xl shadow-inner flex items-center justify-center p-2 overflow-hidden">
        {!imageFailed ? (
          <img
            src={resolvedImageUrl}
            alt={resolvedAltText}
            className="w-full h-full object-contain drop-shadow-md relative z-10"
            draggable={false}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-4xl filter drop-shadow-md">⚽</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 flex items-center justify-center z-10 border-t-2 border-white/20">
        <span className="text-white font-display font-extrabold text-xl uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {resolvedAltText}
        </span>
      </div>

      {variant === 'blocked' && (
        <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
          <span className="font-display font-bold text-white text-lg">BLOQUEADO</span>
        </div>
      )}

      {resolvedStatus === 'incorrect' && <div className="absolute inset-0 bg-red-500/40 z-30 pointer-events-none" />}
    </motion.div>
  );
};
