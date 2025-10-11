
import React from 'react';
import Recommendations from './Recommendations';

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

interface Recommendation {
  vehicle: Vehicle;
  rentalCompany: RentalCompany;
  stationLabel: string;
  stationCount: number;
}

interface DetailsRecommendationsProps {
  recommendations?: Recommendation[];
  loading?: boolean;
}

const DetailsRecommendations: React.FC<DetailsRecommendationsProps> = ({ recommendations, loading }) => {
  return (
    <>
      <div className="px-4 md:px-8 lg:px-16">
        <h3 className="font-bold text-xl mb-8">You might also like these vehicles:</h3>
      </div>
      <Recommendations recommendations={recommendations} loading={loading} limit={5} hideUnavailable />
    </>
  );
};

export default DetailsRecommendations;
