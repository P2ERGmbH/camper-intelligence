
import React from 'react';
import Icon, { IconSizes } from './Icon';

interface DetailsInfoButtonProps {
  className?: string;
  onClick: () => void;
}

const DetailsInfoButton: React.FC<DetailsInfoButtonProps> = ({ className, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      className={`cursor-pointer relative ${className}`}
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-100 opacity-0 transition-opacity duration-200 ease-out hover:opacity-100"></div>
      <Icon name="info" size={IconSizes.M} />
    </div>
  );
};

export default DetailsInfoButton;
