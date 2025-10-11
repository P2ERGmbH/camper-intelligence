
import React from 'react';
import Loadable from './Loadable';

interface PricePerNightProps {
  price?: number;
  label?: string;
  currencySymbol?: string;
  prelabel?: string;
  isLoading?: boolean;
}

const PricePerNight: React.FC<PricePerNightProps> = ({
  price,
  label,
  currencySymbol,
  prelabel,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-baseline gap-1">
      <div className="flex items-baseline flex-row">
        <small className="font-bold">{prelabel}</small>
        <div>&nbsp;</div>
        <h3 className="whitespace-nowrap leading-none">
          <Loadable isLoading={isLoading} placeholder="000">
            {price && price.toLocaleString()}
          </Loadable>{" "}
          {currencySymbol}
          &nbsp;
        </h3>
        <small className="whitespace-nowrap">{label}</small>
      </div>
    </div>
  );
};

export default PricePerNight;
