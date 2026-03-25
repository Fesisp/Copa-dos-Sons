/**
 * Button Component
 * Reusable button for UI interactions
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, ...props }, ref) => {
    const baseStyles = 'font-display font-bold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:scale-105';

    const variantStyles: Record<string, string> = {
      primary: 'bg-field-600 hover:bg-field-700 text-white shadow-button hover:shadow-lg',
      secondary: 'bg-uniform-600 hover:bg-uniform-700 text-white shadow-button hover:shadow-lg',
      success: 'bg-success-600 hover:bg-success-500 text-white shadow-button hover:shadow-lg',
      error: 'bg-error-600 hover:bg-error-500 text-white shadow-button hover:shadow-lg',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? '⏳ Carregando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
