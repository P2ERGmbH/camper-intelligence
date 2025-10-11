
import React from 'react';

interface TotalAndPerNightPriceWrapperProps {
  children: React.ReactNode;
}

const TotalAndPerNightPriceWrapper: React.FC<TotalAndPerNightPriceWrapperProps> = ({ children }) => {
  return <div className="flex flex-col justify-between gap-1">{children}</div>;
};

export default TotalAndPerNightPriceWrapper;
