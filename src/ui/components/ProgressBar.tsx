/**
 * ProgressBar Component
 * Visual progress indicator for game progression
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  variant = 'primary',
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  const colorMap = {
    primary: 'bg-uniform-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <div className="flex justify-between text-neutral-600 font-bold mb-2 text-sm">
          <span>{label}</span>
          {showPercentage && <span>{current} / {total}</span>}
        </div>
      )}

      {!label && showPercentage && (
        <div className="flex justify-between text-neutral-600 font-bold mb-2 text-sm">
          <span>Progresso em Campo</span>
          <span>{current} / {total}</span>
        </div>
      )}

      <div className="h-6 w-full bg-neutral-200 rounded-full overflow-hidden border-2 border-neutral-300 shadow-inner">
        <motion.div
          className={`h-full ${colorMap[variant]} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
            }}
          />
        </motion.div>
      </div>

      {showPercentage && !label && (
        <p className="text-xs text-neutral-600 mt-2">
          {current} / {total} ({Math.round(percentage)}%)
        </p>
      )}
    </div>
  );
};
