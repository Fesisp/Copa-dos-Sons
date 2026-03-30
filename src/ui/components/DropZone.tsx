import React from 'react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  slotIndex: number;
  value: string | null;
  isActive: boolean;
  isCompleted?: boolean;
}

export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  ({ slotIndex, value, isActive, isCompleted = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`
          h-20 w-20 md:h-24 md:w-24 rounded-2xl border-[3px] flex items-center justify-center
          font-display text-2xl font-bold uppercase transition-all
          ${value ? 'bg-field-500 text-white border-field-800 shadow-[0_8px_0_0_rgba(0,0,0,0.14)]' : 'bg-white/90 text-neutral-400 border-dashed border-white/70 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]'}
          ${isCompleted ? 'ring-4 ring-gold-300 goal-flash' : ''}
          ${isActive ? 'ring-4 ring-uniform-300 scale-105 bg-gold-50' : ''}
        `}
        animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value ?? '•'}
        <span className="sr-only">Slot {slotIndex + 1}</span>
      </motion.div>
    );
  }
);

DropZone.displayName = 'DropZone';
