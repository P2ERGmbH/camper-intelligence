
import React from 'react';

interface InfoBadgeProps {
  children: React.ReactNode;
  background?: string;
  withSpacing?: boolean;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ children, background, withSpacing }) => {
  return (
    <div
      className={`text-white w-fit h-fit rounded py-1 px-2 text-sm font-bold transition-colors duration-200 ease-out ${withSpacing ? 'mb-4' : ''}`}
      style={{ backgroundColor: background }}
    >
      {children}
    </div>
  );
};

export default InfoBadge;
