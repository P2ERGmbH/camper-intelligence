
import React from 'react';
import DetailsBoxPrice from './DetailsBoxPrice';
import VehicleAvailability from './VehicleAvailability';
import Button from './Button';
import { Link, LinkButton } from './Link';
import PricePerNight from './PricePerNight';
import Loadable from './Loadable';
import TotalAndPerNightPriceWrapper from './TotalAndPerNightPriceWrapper';
import TotalPriceAndDuration from './TotalPriceAndDuration';
import DetailsBoxSearch from './DetailsBoxSearch';

// Define types for props
// ... (Add all necessary types here)

interface DetailsBoxProps {
  locations?: { pickup?: { name: string; coords: { lat: number; lng: number; }; }; return?: { name: string; coords: { lat: number; lng: number; }; }; };
  costs?: { pricePerNight?: number; price?: number; vehicle?: string; totalEur?: number; };
  participants?: { adults: number; children: number; };
  avail?: { NA?: boolean; };
  dates?: { from: string; to: string; };
  rentalConditions?: string;
  vehicleName?: string;
  isLoadingDetails?: boolean;
  onBookClick?: () => void;
  onDetailsClick?: () => void;
}

const DetailsBox: React.FC<DetailsBoxProps> = ({
  locations,
  costs,
  participants,
  avail,
  dates,
  rentalConditions,
  vehicleName,
  isLoadingDetails,
  onBookClick,
  onDetailsClick,
}) => {
  const bookButtonDisabled = isLoadingDetails || avail?.NA;

  const startDate = dates?.from ? new Date(dates.from) : undefined;
  const endDate = dates?.to ? new Date(dates.to) : undefined;

  const durationInNights = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

  const formattedLocations = locations ? {
    from: locations.pickup ? { name: locations.pickup.name } : undefined,
    to: locations.return ? { name: locations.return.name } : undefined,
  } : undefined;

  const formattedDates = dates ? {
    start: dates.from,
    end: dates.to,
  } : undefined;

  const formattedParticipants = participants ? {
    amount: participants.adults + participants.children,
    label: `${participants.adults} Adults, ${participants.children} Children`,
  } : undefined;

  return (
    <div>
      <div className="rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="flex items-baseline justify-between gap-2 md:gap-4 p-6 bg-gray-800 text-white">
          <TotalAndPerNightPriceWrapper>
            <PricePerNight
              price={costs?.pricePerNight}
              label="night"
              currencySymbol="€"
              isLoading={isLoadingDetails}
            />
            <TotalPriceAndDuration
              price={costs?.price}
              priceLabel="total"
              durationLabel="nights"
              duration={durationInNights}
              currencySymbol="€"
              isLoading={isLoadingDetails}
            />
          </TotalAndPerNightPriceWrapper>
          <VehicleAvailability avail={avail} />
        </div>
        <div className="-mt-4 px-4 md:px-6">
          <DetailsBoxSearch
            locations={formattedLocations}
            dates={formattedDates}
            participants={formattedParticipants}
          />
          <div className="my-4">
            <Button
              className={`w-full ${!bookButtonDisabled ? 'shadow-lg' : ''}`}
              disabled={bookButtonDisabled}
              onClick={onBookClick || (() => {})}
            >
              Book Now
            </Button>
          </div>
          <div className="my-6">
            <div className="flex justify-between my-2.5">
              <small className="truncate">{vehicleName || "Vehicle"}</small>
              <small className="whitespace-nowrap"><Loadable placeholder="0.000 €">{costs?.vehicle}</Loadable></small>
            </div>
            {/* Other costs */}
            <div className="flex gap-1">
              <LinkButton onClick={onDetailsClick} isDisabled={isLoadingDetails} isUnderlined={false}>
                <small>Details</small>
              </LinkButton>
              <small className="text-gray-200"> | </small>
              <Link href={rentalConditions} target="_blank" isUnderlined={false}>
                <small>Rental Conditions</small>
              </Link>
            </div>
          </div>
        </div>
        <DetailsBoxPrice
          price={costs?.price}
          totalEur={costs?.totalEur}
          currency="EUR"
          currencySymbol="€"
          isLoading={isLoadingDetails}
        />
      </div>
    </div>
  );
};

export default DetailsBox;
