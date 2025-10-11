
import React from 'react';
import Icon, { IconSizes } from './Icon';

interface DetailsReviewBoxItemProps {
  color: string;
  icon: string;
  description: string;
  label: string;
}

const colorMap: { [key: string]: string } = {
  'has-turquoise-color': 'text-green-700',
  'has-secondary-medium-dark-color': 'text-gray-500',
  'has-signal-red-color': 'text-red-700',
};

const DetailsReviewBoxItem: React.FC<DetailsReviewBoxItemProps> = ({
  color,
  icon,
  description,
  label,
}) => {
  const textColor = colorMap[color] || 'text-green-700';

  return (
    <div className="flex flex-row items-center gap-4">
      <div className={`relative flex items-center justify-center p-5 ${textColor}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-current rounded opacity-10"></div>
        <Icon size={IconSizes.XXL} name={icon} />
      </div>
      <div>
        <div className="text-gray-500">{description}</div>
        <div className="font-bold">{label}</div>
      </div>
    </div>
  );
};

export default DetailsReviewBoxItem;
