
import React from 'react';

interface DetailsBadgeProps {
  children: React.ReactNode;
}

const DetailsBadge: React.FC<DetailsBadgeProps> = ({ children }) => {
  return (
    <div className="relative table mb-6 md:mb-10">
      <div className="bg-gray-900 text-white py-2 px-4 pl-4 md:pl-6 lg:pl-4 -ml-4 md:-ml-6 lg:ml-0">
        <h2 className="font-bold text-2xl">{children}</h2>
      </div>
      <div
        className="absolute top-0 left-full h-full w-8 bg-gray-900"
        style={{ transform: 'skewX(-20deg) translateX(-50%)' }}
      ></div>
    </div>
  );
};

export default DetailsBadge;
