
import React, { Children } from 'react';
import DetailsBackground from './DetailsBackground';

interface DetailsSpecsSegmentProps {
  children: React.ReactNode;
  type: 'day' | 'night';
}

const DetailsSpecsSegment: React.FC<DetailsSpecsSegmentProps> = ({ children, type }) => {
  const theme = type === 'day' ? 'bg-gray-200 text-black' : 'bg-black text-white';

  return (
    <div className={`relative flex ${theme}`}>
      <DetailsBackground />
      {Children.map(children, (child) => {
        if (!child) return null;
        return <div className="relative w-1/2">{child}</div>;
      })}
    </div>
  );
};

export default DetailsSpecsSegment;
