
import React from 'react';
import Loadable from './Loadable';
import TotalPrice from './TotalPrice';

interface TotalPriceAndDurationProps {
  price?: number;
  duration?: number;
  priceLabel?: string;
  durationLabel?: string;
  currencySymbol?: string;
  isLoading?: boolean;
}

const TotalPriceAndDuration: React.FC<TotalPriceAndDurationProps> = ({
  price,
  duration,
  priceLabel,
  durationLabel,
  currencySymbol,
  isLoading = false,
}) => {
  return (
    <div className="flex gap-1">
      <small className="font-bold whitespace-nowrap text-gray-300">
        <Loadable isLoading={isLoading} placeholder="00">
          {duration}
        </Loadable>{" "}
        {durationLabel}
        {" · "}
      </small>
      <TotalPrice
        price={price}
        label={priceLabel}
        isLoading={isLoading}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

export default TotalPriceAndDuration;
