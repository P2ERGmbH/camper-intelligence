
import React from 'react';
import SummaryItem from './SummaryItem';
import StarRating, { StarRatingSize } from './StarRating';

interface VehicleSummaryProps {
  rentalCompany?: string;
  name?: string;
  description?: string;
  rating?: number;
  maxAdults?: number;
  maxChildren?: number;
  idealAdults?: number;
  idealChildren?: number;
  passengerSeats?: number;
  passengerSeatsChildSeats?: number;
  onRentalCompanyClick?: () => void;
  onRatingClick?: () => void;
}

const VehicleSummary: React.FC<VehicleSummaryProps> = ({
  rentalCompany,
  name,
  description,
  rating,
  maxAdults,
  maxChildren,
  idealAdults,
  idealChildren,
  passengerSeats,
  passengerSeatsChildSeats,
  onRentalCompanyClick = () => {},
  onRatingClick = () => {},
}) => {
  const getBeds = ({ adults, children, ideal = false }: { adults?: number; children?: number; ideal?: boolean }) => {
    if (!adults) {
      return null;
    }
    const label = ideal ? "Ideal" : "Maximal";
    let adultsLabel = "Adult";
    if (adults > 1) {
      adultsLabel = "Adults";
    }
    let childrenLabel = "Child";
    if (children && children > 1) {
      childrenLabel = "Children";
    }
    let text = `${label}: ${adults} ${adultsLabel}`;
    if (children && children > 0) {
      text += `, ${children} ${childrenLabel}`;
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div onClick={onRentalCompanyClick} className="cursor-pointer">
          {rentalCompany || '-/-'}
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-2xl font-bold">{name || '-/-'}</h1>
        </div>
      </div>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === 'Enter' && onRatingClick()}
        onClick={onRatingClick}
        className="cursor-pointer"
      >
        <StarRating value={rating} size={StarRatingSize.L} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 my-8 pb-8 border-b-2 border-gray-100">
        <SummaryItem
          iconName="bed"
          iconSize="x-large"
          label="Sleeping Places"
          content={getBeds({ adults: maxAdults, children: maxChildren, ideal: false }) || ''}
          subline={getBeds({ adults: idealAdults, children: idealChildren, ideal: true }) || ''}
        />
        <SummaryItem
          iconName="child-seat"
          iconSize="x-large"
          label="Seats"
          infoHeadline="Description"
          infoContent={description}
          content={`${passengerSeats} with seatbelt`}
          subline={`${passengerSeatsChildSeats} for child seats`}
        />
      </div>
    </div>
  );
};

export default VehicleSummary;
