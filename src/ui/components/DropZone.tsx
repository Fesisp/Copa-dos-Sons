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
          h-20 w-20 md:h-24 md:w-24 rounded-2xl border-4 flex items-center justify-center
          font-display text-2xl font-bold uppercase shadow-lg transition-all
          ${value ? 'bg-field-500 text-white border-field-700' : 'bg-white text-neutral-400 border-dashed border-neutral-300'}
          ${isCompleted ? 'ring-4 ring-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.75)]' : ''}
          ${isActive ? 'ring-4 ring-uniform-300 scale-105' : ''}
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
