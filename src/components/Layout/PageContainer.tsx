import React from 'react';
import Navbar from './Navbar';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '' 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${className}`}>
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 VideoPredictAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PageContainer;