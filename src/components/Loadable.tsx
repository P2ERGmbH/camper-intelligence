
import React from 'react';

interface LoadableProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  isLoading?: boolean;
}

const Loadable: React.FC<LoadableProps> = ({ children, placeholder = '-/-', isLoading = false }) => {
  if (!isLoading && children) {
    return <>{children}</>;
  }

  return (
    <div className="inline-flex relative overflow-hidden h-full rounded-sm bg-gray-200 animate-pulse">
      <div className="opacity-0">{children || placeholder}</div>
    </div>
  );
};

export default Loadable;
