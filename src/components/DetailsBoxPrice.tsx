
import React from 'react';
import Loadable from './Loadable';

interface DetailsBoxPriceProps {
  price?: number;
  totalEur?: number;
  theme?: 'medium' | 'light' | 'dark';
  currency?: string;
  currencySymbol?: string;
}

const DetailsBoxPrice: React.FC<DetailsBoxPriceProps> = ({ price, totalEur, theme = 'medium', currency, currencySymbol }) => {
  const themeClasses = {
    light: 'bg-white text-black',
    dark: 'bg-black text-white',
    medium: 'bg-gray-200 text-black',
  };

  const currencyPrice = currency === 'EUR' ? totalEur : price;
  const priceEquivalent = currency !== 'EUR';

  return (
    <div className={`flex flex-col gap-1 p-4 md:p-6 ${themeClasses[theme]}`}>
      <div className="flex justify-between font-bold text-lg md:text-xl">
        <div>Your Price</div>
        <div>
          <Loadable placeholder="0.000">
            {currencyPrice && currencyPrice.toLocaleString()}
          </Loadable>
          {` ${currencySymbol}`}
        </div>
      </div>
      {priceEquivalent && (
        <div className="text-xs text-gray-500 self-end">
          {`equivalent to `}
          <Loadable placeholder="0.000">
            {totalEur && totalEur.toLocaleString()}
          </Loadable>{" "}
          €
        </div>
      )}
    </div>
  );
};

export default DetailsBoxPrice;
