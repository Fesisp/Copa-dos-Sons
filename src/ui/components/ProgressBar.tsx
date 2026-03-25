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
  const percentage = Math.min((current / total) * 100, 100);

  const colorMap = {
    primary: 'bg-uniform-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
  };

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-semibold text-neutral-700 mb-2">
          {label}
        </p>
      )}

      <div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden shadow-md">
        <motion.div
          className={`h-full ${colorMap[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {showPercentage && (
        <p className="text-xs text-neutral-600 mt-2">
          {current} / {total} ({Math.round(percentage)}%)
        </p>
      )}
    </div>
  );
};
