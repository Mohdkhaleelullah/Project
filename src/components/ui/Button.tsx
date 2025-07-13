import React from 'react';
import clsx from 'clsx';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-400',
    success: 'bg-success-500 hover:bg-success-700 text-white focus:ring-success-500',
    error: 'bg-error-500 hover:bg-error-700 text-white focus:ring-error-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-primary-500',
  };
  
  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        disabledClasses,
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small\" light={variant !== 'outline' && variant !== 'ghost'} />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;