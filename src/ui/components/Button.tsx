/**
 * Button Component
 * Reusable button for UI interactions
 */

import React from 'react';
import { motion, type HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { audioManager } from '../../services/audioManager';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  playSound?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, playSound = true, className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const baseStyles = 'font-display font-bold rounded-2xl shadow-press transition-all text-white outline-none focus:ring-4 focus:ring-gold-300/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none';

    const variantStyles: Record<string, string> = {
      primary: 'bg-uniform-500 hover:bg-uniform-400 border-b-[6px] border-uniform-800',
      secondary: 'bg-field-500 hover:bg-field-400 border-b-[6px] border-field-800',
      danger: 'bg-error-500 hover:bg-error-600 border-b-[6px] border-error-600',
      success: 'bg-success-500 hover:bg-success-600 border-b-[6px] border-success-600',
      error: 'bg-error-500 hover:bg-error-600 border-b-[6px] border-error-600',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-lg',
      lg: 'px-8 py-4 text-2xl w-full',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!props.disabled && !isLoading && !shouldReduceMotion ? { scale: 1.03, y: -2 } : {}}
        whileTap={!props.disabled && !isLoading ? (shouldReduceMotion ? { y: 2 } : { scale: 0.98, y: 4, boxShadow: '0 2px 0 0 rgba(0,0,0,0.2)' }) : {}}
        onTapStart={() => {
          if (!props.disabled && !isLoading && playSound) {
            void audioManager.playUiTapSound();
          }
        }}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? '⏳ Carregando...' : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
