
import React from 'react';
import { LinkButton } from './Link';
import Button from './Button';
import PricePerNight from './PricePerNight';
import TotalPriceAndDuration from './TotalPriceAndDuration';
import TotalAndPerNightPriceWrapper from './TotalAndPerNightPriceWrapper';

interface Costs {
  price?: number;
  pricePerNight?: number;
}

interface Avail {
  NA?: boolean;
  UNKNOWN?: boolean;
}

interface DetailsMobileBoxProps {
  costs?: Costs;
  avail?: Avail;
  duration?: { start: string; end: string; };
  isLoadingDetails?: boolean;
  onBookClick: () => void;
  onDetailsClick: () => void;
}

const DetailsMobileBox: React.FC<DetailsMobileBoxProps> = ({
  costs,
  avail,
  duration,
  isLoadingDetails,
  onBookClick,
  onDetailsClick,
}) => {
  const startDate = duration?.start ? new Date(duration.start) : undefined;
  const endDate = duration?.end ? new Date(duration.end) : undefined;

  const durationInNights = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

  return (
    <div className="flex justify-between gap-4 p-4 sticky bottom-0 left-0 w-full z-50 bg-white shadow-lg md:hidden">
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === 'Enter' && onDetailsClick()}
        onClick={onDetailsClick}
        className="flex flex-col gap-0.5 flex-1"
      >
        <TotalAndPerNightPriceWrapper>
          <PricePerNight
            label="night"
            price={costs?.pricePerNight}
            currencySymbol="€"
            isLoading={isLoadingDetails}
          />
          <TotalPriceAndDuration
            priceLabel="total"
            durationLabel="nights"
            price={costs?.price}
            duration={durationInNights}
            currencySymbol="€"
            isLoading={isLoadingDetails}
          />
        </TotalAndPerNightPriceWrapper>
        <LinkButton
          onClick={onDetailsClick}
          isUnderlined={false}
          isBold
          isDisabled={isLoadingDetails}
        >
          <small>Details</small>
        </LinkButton>
      </div>
      <div className="flex-1">
        <Button
          className="w-full"
          disabled={avail?.NA || avail?.UNKNOWN}
          onClick={onBookClick}
        >
          To Checkout
        </Button>
      </div>
    </div>
  );
};

export default DetailsMobileBox;
