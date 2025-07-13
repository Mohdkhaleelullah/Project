import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  light?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  light = false,
  className 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-10 h-10 border-3',
  };

  const colorClasses = light 
    ? 'border-white/30 border-t-white' 
    : 'border-primary-300 border-t-primary-600';

  return (
    <div 
      className={clsx(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses,
        className
      )}
    />
  );
};

export default LoadingSpinner;