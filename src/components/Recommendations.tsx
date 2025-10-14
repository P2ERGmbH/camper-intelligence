
import React, { useState } from 'react';
import VehicleTeaser from './VehicleTeaser';
import { Link } from './Link';
import Icon, { IconSizes } from './Icon';

interface Vehicle {
  id: string;
  name: string;
  rating?: number;
  mood1?: string;
  price?: number;
  isAvailable?: boolean; // Added isAvailable property
  // Add other vehicle properties as needed
}

interface RentalCompany {
  logo_image?: string;
  name?: string;
}

interface Recommendation {
  vehicle: Vehicle;
  rentalCompany: RentalCompany;
  stationLabel: string;
  stationCount: number;
}

interface RecommendationsProps {
  recommendations?: Recommendation[];
  loading?: boolean;
  limit?: number;
  hideUnavailable?: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations = [],
  loading,
  limit = 5,
  hideUnavailable,
}) => {
  const [teaserCount, setTeaserCount] = useState(limit);

  if (loading && recommendations.length === 0) {
    return null;
  }

  const limitedTeaserList = recommendations.slice(0, teaserCount);

  return (
    <div>
      <div className="grid grid-flow-col auto-cols-[min(400px,calc(100vw-48px))] gap-4 overflow-x-auto snap-x snap-mandatory scroll-p-4 scroll-smooth p-4 md:p-6 md:auto-cols-[minmax(auto,400px)]">
        {limitedTeaserList.map(({ vehicle, rentalCompany, stationLabel, stationCount }) => (
          <div key={vehicle.id} className="snap-center md:snap-start">
            <VehicleTeaser
              hideUnavailable={hideUnavailable}
              vehicle={vehicle}
              rentalCompany={rentalCompany}
              stationLabel={stationLabel}
              stationCount={stationCount}
              pricePerNight={vehicle?.price || 0}
              ctaLabel="View Offer"
              availability={vehicle.isAvailable ? 'FS' : 'NA'} // Pass availability prop
            />
          </div>
        ))}
        {limitedTeaserList.length < recommendations.length && (
          <div className="flex justify-center items-center">
            <div
              onClick={() => setTeaserCount(Math.min(limitedTeaserList.length + limit, recommendations.length))}
              className="flex relative items-center justify-center z-10 rounded-2xl shadow-md py-2 px-4 cursor-pointer select-none bg-white"
            >
              Show more
              <Icon name="slide-right" size={IconSizes.S} />
            </div>
          </div>
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/results" isBold isUnderlined={false}>
          + Show all results
        </Link>
      </div>
    </div>
  );
};

export default Recommendations;
