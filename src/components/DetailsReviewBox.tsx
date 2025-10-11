
import React from 'react';
import DetailsReviewBoxItem from './DetailsReviewBoxItem';

interface OtherRating {
  color: string;
  icon: string;
  description: string;
  label: string;
}

interface Recommendation {
  value: number;
  description: string;
}

interface DetailsReviewBoxProps {
  others: OtherRating[];
  recommendation: Recommendation;
}

const DetailsReviewBox: React.FC<DetailsReviewBoxProps> = ({ others, recommendation }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4 flex-auto">
        {others.map(({ color, icon, description, label }) => (
          <DetailsReviewBoxItem
            key={icon}
            color={color}
            icon={icon}
            description={description}
            label={label}
          />
        ))}
      </div>
      <div className="flex flex-row md:flex-col md:items-center md:justify-center gap-4 flex-shrink-0 md:w-2/5">
        <div className="relative w-28 h-28 flex justify-center items-center text-gray-500">
          <div className="absolute top-0 left-0 w-full h-full bg-current rounded opacity-10 md:hidden"></div>
          <div className="relative text-4xl md:text-7xl font-bold text-gray-900">
            {recommendation.value}
            <span className="absolute top-0 left-full text-2xl -translate-y-1/4">%</span>
          </div>
        </div>
        <div className="text-gray-500 self-center md:text-center">
          <b>{recommendation.description}</b>
        </div>
      </div>
    </div>
  );
};

export default DetailsReviewBox;
