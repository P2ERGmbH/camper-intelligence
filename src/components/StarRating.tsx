
import React from 'react';
import Icon, { IconSizes } from './Icon';

export const StarRatingSize = {
  XS: IconSizes.XS,
  S: IconSizes.S,
  M: IconSizes.M,
  L: IconSizes.L,
};

interface StarRatingProps {
  value?: number;
  label?: string | number;
  max?: number;
  min?: number;
  size?: string | number;
  className?: string;
  short?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  label = '',
  max = 5,
  min = 0,
  size = StarRatingSize.S,
  className,
  short = false,
}) => {
  const getStars = () => {
    const stars = [];
    for (let i = min; i < max; i += 1) {
      stars.push(<Icon name="star" size={size} key={i} />);
    }
    return stars;
  };

  const roundedValue = Math.round(value * 2) / 2;
  const stars = getStars();

  return (
    <div className={`flex items-center gap-1 ${short ? 'items-start' : ''} ${className}`}>
      {short ? (
        <div className="relative">
          <div className="flex text-gray-700">
            <Icon name="star" size={size} />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex text-gray-200">{stars}</div>
          <div
            className="absolute top-0 left-0 h-full overflow-hidden flex text-gray-700"
            style={{ width: `${(roundedValue / max) * 100}%` }}
          >
            {stars}
          </div>
        </div>
      )}
      <div className={`text-gray-400 ${size === StarRatingSize.S ? 'text-sm' : size === StarRatingSize.M ? 'text-base' : ''}`}>
        {label || (value?.toLocaleString && value.toLocaleString())}
      </div>
    </div>
  );
};

export default StarRating;
