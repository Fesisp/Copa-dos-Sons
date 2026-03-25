/**
 * Button Component
 * Reusable button for UI interactions
 */

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, ...props }, ref) => {
    const baseStyles = 'font-display font-bold rounded-full shadow-lg transition-colors text-white outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<string, string> = {
      primary: 'bg-uniform-500 hover:bg-uniform-600 border-b-4 border-uniform-700 active:border-b-0 active:translate-y-1',
      secondary: 'bg-field-500 hover:bg-field-600 border-b-4 border-field-700 active:border-b-0 active:translate-y-1',
      danger: 'bg-red-500 hover:bg-red-600 border-b-4 border-red-700 active:border-b-0 active:translate-y-1',
      success: 'bg-success-600 hover:bg-success-500 border-b-4 border-success-700 active:border-b-0 active:translate-y-1',
      error: 'bg-error-600 hover:bg-error-500 border-b-4 border-error-700 active:border-b-0 active:translate-y-1',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-lg',
      lg: 'px-8 py-4 text-2xl w-full',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!props.disabled && !isLoading ? { scale: 1.05 } : {}}
        whileTap={!props.disabled && !isLoading ? { scale: 0.95 } : {}}
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
