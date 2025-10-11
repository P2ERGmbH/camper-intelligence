
import React from 'react';
import Sidebar from './Sidebar';
import DetailsBoxPrice from './DetailsBoxPrice';
import VehicleAvailability from './VehicleAvailability';
import Button from './Button';
import DetailsBoxAddon from './DetailsBoxAddon';
import TotalAndPerNightPriceWrapper from './TotalAndPerNightPriceWrapper';
import TotalPriceAndDuration from './TotalPriceAndDuration';
import PricePerNight from './PricePerNight';
import DetailsBoxSearch from './DetailsBoxSearch';

// Define types for props
// ... (Add all necessary types here)

interface Addon {
  id: string;
  quantity: number;
  price: number;
  hidden?: boolean;
  label?: string;
  image?: string;
  amount?: number;
}

interface DetailsBoxSidebarProps {
  locations?: { pickup?: { name: string; coords: { lat: number; lng: number; }; }; return?: { name: string; coords: { lat: number; lng: number; }; }; };
  duration?: { start: string; end: string; };
  costs?: { pricePerNight?: number; price?: number; vehicle?: string; totalEur?: number; };
  participants?: { adults: number; children: number; };
  avail?: { NA?: boolean; UNKNOWN?: boolean; };
  dates?: { from: string; to: string; };
  selectedAddons?: Record<string, Addon>;
  vehicleName?: string;
  vehicleImage?: string;
  rentalCompany?: string;
  rentalConditions?: string;
  isOpen: boolean;
  onCloseRequest: () => void;
  onBookClick?: () => void;
}

const DetailsBoxSidebar: React.FC<DetailsBoxSidebarProps> = ({
  locations,
  duration,
  costs,
  participants,
  avail,
  dates,
  selectedAddons,
  vehicleName,
  vehicleImage,
  rentalCompany,
  rentalConditions,
  isOpen,
  onCloseRequest,
  onBookClick,
}) => {
  const renderHeadline = () => (
    <div className="flex items-center justify-between gap-2 md:gap-4 flex-auto bg-white text-black">
      <TotalAndPerNightPriceWrapper>
        <PricePerNight price={costs?.pricePerNight} label="night" currencySymbol="€" />
        <TotalPriceAndDuration
          duration={duration}
          durationLabel="nights"
          price={costs?.price}
          priceLabel="total"
          currencySymbol="€"
        />
      </TotalAndPerNightPriceWrapper>
      <div className="self-start rounded overflow-hidden">
        <VehicleAvailability avail={avail} />
      </div>
    </div>
  );

  return (
    <Sidebar isOpen={isOpen} headline={renderHeadline()} onCloseRequest={onCloseRequest} right>
      <div className="-mt-9 md:-mt-15 max-w-xl">
        <DetailsBoxSearch locations={locations} dates={dates} participants={participants} />
        <div className="my-8">
          <div className="border-b border-gray-200 mb-2 pb-2">
            <DetailsBoxAddon
              label={vehicleName}
              thumbnail={vehicleImage}
              price={costs?.vehicle}
              subheading={rentalCompany}
              link={{ label: "Rental Conditions", href: rentalConditions }}
            />
          </div>
          {Object.values(selectedAddons || {}).flatMap((addon: Addon) => {
            if (addon.hidden) return null;
            return (
              <div key={addon.index} className="border-b border-gray-200 mb-2 pb-2 last:border-b-0">
                <DetailsBoxAddon
                  label={addon.label}
                  thumbnail={addon.image}
                  price={addon.price}
                  amount={addon.amount}
                />
              </div>
            );
          })}
        </div>
        <DetailsBoxPrice price={costs?.price} totalEur={costs?.totalEur} currency="EUR" currencySymbol="€" theme="light" />
        <Button disabled={avail?.NA || avail?.UNKNOWN} onClick={onBookClick} className="w-full">
          Book Now
        </Button>
      </div>
    </Sidebar>
  );
};

export default DetailsBoxSidebar;
