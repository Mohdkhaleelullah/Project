import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variantStyles = {
    info: {
      container: 'bg-primary-50 border-primary-300 text-primary-900',
      icon: <Info className="h-5 w-5 text-primary-500" />,
    },
    success: {
      container: 'bg-success-50 border-success-300 text-success-900',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-300 text-warning-900',
      icon: <AlertCircle className="h-5 w-5 text-warning-500" />,
    },
    error: {
      container: 'bg-error-50 border-error-300 text-error-900',
      icon: <XCircle className="h-5 w-5 text-error-500" />,
    },
  };

  return (
    <div
      className={clsx(
        'border-l-4 p-4 rounded-r-md flex',
        variantStyles[variant].container,
        className
      )}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {variantStyles[variant].icon}
      </div>
      <div className="flex-grow">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;