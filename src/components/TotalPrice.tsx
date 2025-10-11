
import React from 'react';
import Loadable from './Loadable';

interface TotalPriceProps {
  price?: number;
  label?: string;
  currencySymbol?: string;
  isLoading?: boolean;
}

const TotalPrice: React.FC<TotalPriceProps> = ({ price, label, currencySymbol, isLoading = false }) => {
  return (
    <small className="font-bold whitespace-nowrap text-gray-300">
      <Loadable isLoading={isLoading} placeholder="0.000">
        {price && price.toLocaleString()}
      </Loadable>{" "}
      {currencySymbol} {label}
    </small>
  );
};

export default TotalPrice;
