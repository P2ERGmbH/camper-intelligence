
import React from 'react';

interface DetailsBackgroundProps {
  backgroundColor?: string;
}

const DetailsBackground: React.FC<DetailsBackgroundProps> = ({ backgroundColor = 'inherit' }) => {
  return (
    <div
      className="absolute top-0 left-1/2 -ml-[50vw] w-screen h-full"
      style={{ background: backgroundColor }}
    ></div>
  );
};

export default DetailsBackground;
