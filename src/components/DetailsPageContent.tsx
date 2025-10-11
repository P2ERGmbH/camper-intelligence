
import React, { useRef, useState } from 'react';
import VehicleSummary from './VehicleSummary';
import VehicleFeatures from './VehicleFeatures';
import DetailsStation from './DetailsStation';
import DetailsReviews from './DetailsReviews';
import DetailsRecommendations from './DetailsRecommendations';
import DetailsInformation from './DetailsInformation';
import DetailsRentalCompany from './DetailsRentalCompany';
import DetailsStage from './DetailsStage';
import DetailsMobileBox from './DetailsMobileBox';
import DetailsSpecs from './DetailsSpecs';
import DetailsNavigation from './DetailsNavigation';
import Loading from './Loading';
import DetailsSection from './DetailsSection';
import CancellationBox from './CancellationBox';
import CancellationTable from './CancellationTable';
import DetailsBox from './DetailsBox';
import DetailsBoxSidebar from './DetailsBoxSidebar';
import DetailsAddons from './DetailsAddons';

interface DetailsStaticProps {
  stage?: { images?: { src: string; alt: string; }[]; };
  summary?: { name?: string; renter?: string; };
  features?: { list?: string[]; };
  rentalCompany?: { info?: { rentalConditions?: string; }; };
  specs?: { segments?: { headline: string; items: { icon: string; label: string; value: string; }[]; }[]; };
}

interface Addon {
  id: string;
  name: string;
  price: number;
  // Add other addon properties as needed
}

interface Special {
  id: string;
  name: string;
  // Add other special properties as needed
}

interface DetailsProps {
  price?: number;
  locations?: { pickup?: { name: string; coords: { lat: number; lng: number; }; }; return?: { name: string; coords: { lat: number; lng: number; }; }; };
  duration?: { start: string; end: string; };
  costs?: { total: number; perNight: number; };
  participants?: { adults: number; children: number; };
  dates?: { from: string; to: string; };
  addons?: { items: Addon[]; };
  infos?: { headline: string; text: string; }[];
  specials?: Special[];
  stationTakeover?: { name: string; address: string; coords: { lat: number; lng: number; }; openingHours: string; };
  stationReturn?: { name: string; address: string; coords: { lat: number; lng: number; }; openingHours: string; };
  selectedAddons?: Record<string, { id: string; quantity: number; price: number; }>;
}

interface VehicleProps {
  name?: string;
  rating?: number;
  description?: string;
  max_adults?: number;
  max_children?: number;
  ideal_adults?: number;
  ideal_children?: number;
  passengers_seats?: number;
  passengers_seats_child_seats?: number;
}

interface AvailabilityProps {
  isAvailable: boolean;
  info: string;
}

interface ReviewsProps {
  overallRating: number;
  reviewCount: number;
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  reviews: { authorName: string; authorAvatarUrl: string; date: string; comment: string; rating: number; }[];
}

interface Recommendation {
  id: string;
  name: string;
  // Add other recommendation properties as needed
}

type RecommendationsProps = Recommendation[];

interface CancellationConditionsProps {
  isFree: boolean;
  boxHeadline: string;
  boxCopy: string;
  table: { daysBefore: string; fee: string; }[];
}

interface DetailsPageContentProps {
  detailsStatic: DetailsStaticProps;
  details: DetailsProps;
  vehicle: VehicleProps;
  availability: AvailabilityProps;
  reviews: ReviewsProps;
  recommendations: RecommendationsProps;
  cancellationConditions: CancellationConditionsProps;
  loading: boolean;
  detailsSidebarOpen: boolean;
  setDetailsSidebarOpen: (isOpen: boolean) => void;
}

const DetailsPageContent: React.FC<DetailsPageContentProps> = ({
  detailsStatic,
  details,
  vehicle,
  availability,
  reviews,
  recommendations,
  cancellationConditions,
  loading,
  detailsSidebarOpen,
  setDetailsSidebarOpen,
}) => {
  const [selectedAddonsState, setSelectedAddonsState] = useState<Record<string, { id: string; quantity: number; price: number; }>>({});

  const sections = {
    summary: useRef<HTMLDivElement>(null),
    addons: useRef<HTMLDivElement>(null),
    specs: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    rental: useRef<HTMLDivElement>(null),
  };

  if (loading) {
    return <Loading />;
  }

  const handleAddonChange = (addonId: string, addonValue: { id: string; quantity: number; price: number; }) => {
    setSelectedAddonsState({
      ...selectedAddonsState,
      [addonId]: addonValue,
    });
  };

  const handleAnchorClick = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleBookClick = () => {
    // Handle booking logic
  };

  const handleDetailsSidebar = (forcedState?: boolean) => {
    setDetailsSidebarOpen(forcedState ?? !detailsSidebarOpen);
  };

  const { locations, duration, costs, participants, dates, selectedAddons } = details || {};
  const rentalConditions = detailsStatic?.rentalCompany?.info?.rentalConditions;
  const rentalCompanyName = detailsStatic?.summary?.renter;
  const vehicleName = detailsStatic?.summary?.name;
  const vehicleThumbnail = detailsStatic?.stage?.images?.[0];

  return (
    <div>
      <DetailsNavigation sections={sections} onClick={handleAnchorClick} />
      <div className="px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <DetailsStage images={detailsStatic?.stage?.images} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          <div className="w-full lg:w-[calc(65%-48px)] lg:mr-12 -mt-12 md:-mt-16">
            <DetailsSection forwardRef={sections.summary}>
              <VehicleSummary
                rentalCompany={rentalCompanyName}
                name={vehicle?.name}
                rating={vehicle?.rating}
                description={vehicle?.description}
                maxAdults={vehicle?.max_adults}
                maxChildren={vehicle?.max_children}
                idealAdults={vehicle?.ideal_adults}
                idealChildren={vehicle?.ideal_children}
                passengerSeats={vehicle?.passengers_seats}
                passengerSeatsChildSeats={vehicle?.passengers_seats_child_seats}
                onRentalCompanyClick={() => handleAnchorClick(sections.rental)}
                onRatingClick={() => handleAnchorClick(sections.reviews)}
              />
              <VehicleFeatures list={detailsStatic?.features?.list} />
            </DetailsSection>
            <DetailsSection>
              <CancellationBox isFree={cancellationConditions?.isFree} boxHeadline={cancellationConditions?.boxHeadline} boxCopy={cancellationConditions?.boxCopy} />
              <DetailsInformation infos={details?.infos} specials={details?.specials} />
            </DetailsSection>
            <DetailsSection forwardRef={sections.addons}>
              <DetailsAddons
                price={details.price}
                addons={details?.addons?.items}
                onChange={handleAddonChange}
              />
            </DetailsSection>
            <DetailsSection forwardRef={sections.specs}>
              <DetailsSpecs specs={detailsStatic?.specs} />
            </DetailsSection>
            <DetailsSection forwardRef={sections.reviews}>
              <DetailsReviews reviews={reviews} />
            </DetailsSection>
            <DetailsSection forwardRef={sections.rental}>
              <DetailsRentalCompany rentalCompany={detailsStatic?.rentalCompany} />
            </DetailsSection>
            <CancellationTable headline="Cancellation Conditions" conditions={cancellationConditions?.table || []} />
            <DetailsSection>
              <DetailsStation station={details?.stationTakeover} headline="Takeover Station" expand />
              <DetailsStation station={details?.stationReturn} headline="Return Station" />
            </DetailsSection>
          </div>
          <div className="hidden lg:block w-[35%] self-start sticky top-20">
            <DetailsBox
              costs={costs}
              locations={locations}
              dates={dates}
              avail={availability}
              duration={duration}
              participants={participants}
              rentalConditions={rentalConditions}
              vehicleName={vehicleName}
              onBookClick={handleBookClick}
              onDetailsClick={() => handleDetailsSidebar(true)}
            />
          </div>
        </div>
      </div>
      <div>
        <DetailsRecommendations recommendations={recommendations} />
      </div>
      <DetailsMobileBox
        costs={costs}
        avail={availability}
        duration={duration}
        onBookClick={handleBookClick}
        onDetailsClick={() => handleDetailsSidebar(true)}
      />
      <DetailsBoxSidebar
        costs={costs}
        locations={locations}
        dates={dates}
        avail={availability}
        duration={duration}
        participants={participants}
        selectedAddons={selectedAddons}
        vehicleName={vehicleName}
        vehicleImage={vehicleThumbnail}
        rentalCompany={rentalCompanyName}
        rentalConditions={rentalConditions}
        isOpen={detailsSidebarOpen}
        onBookClick={handleBookClick}
        onCloseRequest={() => handleDetailsSidebar(false)}
      />
    </div>
  );
};

export default DetailsPageContent;
