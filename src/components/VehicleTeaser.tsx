
import VehicleTileSlider from './VehicleTileSlider';
import StarRating from './StarRating';
import VehicleAvailability, { VehicleAvailabilityRounding } from './VehicleAvailability';
import PricePerNight from './PricePerNight';
import TotalAndPerNightPriceWrapper from './TotalAndPerNightPriceWrapper';
import Button from './Button';
import DestinationBubble from './DestinationBubble';
import Image from './Image';

// Define types for the props
interface Vehicle {
  id: string;
  name: string;
  rating?: number;
  mood1?: string;
  // Add other vehicle properties as needed
}

interface RentalCompany {
  logo_image?: string;
  name?: string;
}

interface NoticeItem {
  id: string;
  text: string;
}

interface VehicleTeaserProps {
  vehicle: Vehicle;
  rentalCompany?: RentalCompany;
  distance?: number;
  disabled?: boolean;
  distanceUnit?: string;
  pricePerNight: number;
  pricePerNightLabel?: string;
  stationLabel?: string;
  stationCount?: number;
  ctaLabel?: string;
  notice?: NoticeItem[];
  onFavourite?: () => void;
  isFavourite?: boolean;
  hideUnavailable?: boolean;
}

const VehicleTeaser: React.FC<VehicleTeaserProps> = ({
  vehicle,
  rentalCompany,
  distance,
  disabled = false,
  distanceUnit,
  pricePerNight,
  pricePerNightLabel,
  stationLabel,
  stationCount,
  ctaLabel,
  onFavourite,
  isFavourite,
  hideUnavailable,
}) => {
  const availability = 'FS'; // Mock availability

  if (pricePerNight === 0) {
    return null;
  }

  if (availability === 'NA' && hideUnavailable) {
    return null;
  }

  return (
    <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        <VehicleTileSlider
          images={[{ src: vehicle.mood1 || '', alt: vehicle.name }]}
          moodImage={{ src: vehicle.mood1 || '', alt: vehicle.name }}
          distance={distance}
          distanceUnit={distanceUnit}
          isFavourite={isFavourite}
          onFavourite={onFavourite}
          vehicle={vehicle}
          enableFavoriteFeature={false}
        />
        <div className="relative grid p-3 gap-4 items-center grid-cols-2">
          <div className="grid col-span-2 grid-cols-[50px_minmax(0,1fr)_minmax(50px,80px)] gap-2 items-center">
            <div className="col-span-3">
              <h3 className="font-bold truncate">{vehicle.name}</h3>
            </div>
            {vehicle.rating && <StarRating value={vehicle.rating} label={vehicle.rating.toFixed(1)} short />}
            <VehicleAvailability circle avail={{ [availability]: true }} rounding={VehicleAvailabilityRounding.LEFT} />
            {rentalCompany?.logo_image && (
              <div className="h-8">
                <Image src={rentalCompany.logo_image} alt={rentalCompany.name} width={160} height={64} />
              </div>
            )}
          </div>
          <TotalAndPerNightPriceWrapper>
            <PricePerNight
              price={Math.ceil(pricePerNight)}
              label={pricePerNightLabel}
              prelabel="from"
              currencySymbol="€"
            />
          </TotalAndPerNightPriceWrapper>
          <div>
            <Button onClick={() => {}} className="w-full">
              {ctaLabel}
            </Button>
          </div>
        </div>
        {/* Notices can be added here */}
        {stationLabel && stationCount && (
          <DestinationBubble
            stationLabel={stationLabel}
            stationCount={stationCount}
            onClick={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleTeaser;
