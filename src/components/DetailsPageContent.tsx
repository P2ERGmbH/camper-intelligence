
import React, { useRef, useState } from 'react';
import VehicleSummary from './VehicleSummary';
import VehicleFeatures from './VehicleFeatures';
import DetailsStation from './DetailsStation';
import { DetailsReviews } from './DetailsReviews';
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
  stage?: { images?: { src: string; alt: string; }[]; onAddImage?: () => void; };
  summary?: { name?: string; renter?: string; };
  features?: { list?: string[]; };
  rentalCompany?: { info?: { rentalConditions?: string; }; };
  specs?: { description?: string | null; sections?: { day?: { lists?: { label: string; icon: string; items: { label: string; value: string; }[]; }[]; floorplan?: string; width?: number; height?: number; }; night?: { lists?: { label: string; icon: string; items: { label: string; value: string; }[]; }[]; floorplan?: string; }; }; segments?: { headline: string; items: { icon: string; label: string; value: string; }[]; }[]; };
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
  description?: string | null;
  max_adults?: number | null;
  max_children?: number | null;
  ideal_adults?: number | null;
  ideal_children?: number | null;
  passengers_seats?: number | null;
  passengers_seats_child_seats?: number | null;
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

export interface Recommendation {
  id: string;
  name: string;
  vehicle: { id: string; name: string; rating?: number; mood1?: string; };
  rentalCompany: { logo_image?: string; name?: string; };
  stationLabel: string;
  stationCount: number;
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

  const handleAddonChange = (addonId: string, addonValue: { id: string; quantity: number; price: number; } | number) => {
    if (typeof addonValue === 'number') {
      // Handle number case, e.g., quantity change for a simple addon
      setSelectedAddonsState(prevState => ({
        ...prevState,
        [addonId]: { ...prevState[addonId], quantity: addonValue, price: (prevState[addonId]?.price / prevState[addonId]?.quantity) * addonValue || 0 }, // Assuming price per unit is constant
      }));
    } else {
      // Handle object case, e.g., selection of a specific option
      setSelectedAddonsState(prevState => ({
        ...prevState,
        [addonId]: addonValue,
      }));
    }
  };

  const handleAnchorClick = (ref: React.RefObject<HTMLDivElement | null>) => {
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

  const { locations, duration, participants, dates } = details || {};
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
            <DetailsSection ref={sections.summary}>
              <VehicleSummary
                rentalCompany={rentalCompanyName}
                name={vehicle?.name}
                rating={vehicle?.rating}
                description={vehicle?.description ?? undefined}
                maxAdults={vehicle?.max_adults ?? undefined}
                maxChildren={vehicle?.max_children ?? undefined}
                idealAdults={vehicle?.ideal_adults ?? undefined}
                idealChildren={vehicle?.ideal_children ?? undefined}
                passengerSeats={vehicle?.passengers_seats ?? undefined}
                passengerSeatsChildSeats={vehicle?.passengers_seats_child_seats ?? undefined}
                onRentalCompanyClick={() => handleAnchorClick(sections.rental)}
                onRatingClick={() => handleAnchorClick(sections.reviews)}
              />
              <VehicleFeatures list={detailsStatic?.features?.list?.map(feature => ({ name: feature, icon: "info", available: true })) || []} />
            </DetailsSection>
            <DetailsSection>
              <CancellationBox isFree={cancellationConditions?.isFree} boxHeadline={cancellationConditions?.boxHeadline} boxCopy={cancellationConditions?.boxCopy ? [cancellationConditions.boxCopy] : undefined} />
              <DetailsInformation infos={details?.infos} specials={details?.specials} />
            </DetailsSection>
            <DetailsSection ref={sections.addons}>
              <DetailsAddons
                price={details.price}
                addons={details?.addons?.items ? [{
                  headline: "Available Addons", // Default headline
                  itemIndex: 0,
                  addons: details.addons.items.map((addon, index) => ({
                    id: addon.id,
                    name: addon.name,
                    addonIndex: index,
                    description: "", // Default description
                    label: addon.name, // Use addon.name as label
                    options: [], // Default empty options
                    type: "", // Default empty type
                    totalPrice: addon.price, // Use addon.price as totalPrice
                  })),
                }] : []}
                onChange={handleAddonChange}
              />
            </DetailsSection>
            <DetailsSection ref={sections.specs}>
              <DetailsSpecs specs={{ ...detailsStatic?.specs, description: detailsStatic?.specs?.description ?? undefined, sections: {
                day: { ...detailsStatic?.specs?.sections?.day, lists: detailsStatic?.specs?.sections?.day?.lists ?? [], floorplan: detailsStatic?.specs?.sections?.day?.floorplan ?? '' },
                night: { ...detailsStatic?.specs?.sections?.night, lists: detailsStatic?.specs?.sections?.night?.lists ?? [], floorplan: detailsStatic?.specs?.sections?.night?.floorplan ?? '' },
              } }} />
            </DetailsSection>
            <DetailsSection ref={sections.reviews}>
              <DetailsReviews reviews={{
                items: {
                  ratings: {
                    others: Object.entries(reviews.ratingBreakdown).map(([key, value]) => ({
                      label: `${key} Stars`,
                      value: value,
                      color: "#000000", // Mock color
                      icon: "star", // Mock icon
                      description: "", // Mock description
                    })),
                    recommendation: { value: reviews.overallRating, label: "Overall Rating" }, // Assuming label format
                  },
                  reviews: reviews.reviews.map(review => ({
                    user_name: review.authorName,
                    date_start: review.date, // Assuming date is start date
                    date_end: review.date, // Assuming date is end date
                    destination: "", // No destination in original ReviewsProps
                    user_statement: review.comment,
                    id: `${review.authorName}-${review.date}`, // Unique ID
                    summary: [], // No summary in original ReviewsProps
                  })),
                }
              }} />
            </DetailsSection>
            <DetailsSection ref={sections.rental}>
              <DetailsRentalCompany rentalCompany={detailsStatic?.rentalCompany} />
            </DetailsSection>
            <CancellationTable headline="Cancellation Conditions" conditions={cancellationConditions?.table?.map(condition => ({ daysCol: condition.daysBefore, costCol: condition.fee })) || []} />
            <DetailsSection>
              <DetailsStation station={details?.stationTakeover ? {
                city: details.stationTakeover.name,
                lat: details.stationTakeover.coords.lat,
                lng: details.stationTakeover.coords.lng,
                description: `${details.stationTakeover.address}, ${details.stationTakeover.openingHours}`,
              } : undefined} headline="Takeover Station" expand />
              <DetailsStation station={details?.stationReturn ? {
                city: details.stationReturn.name,
                lat: details.stationReturn.coords.lat,
                lng: details.stationReturn.coords.lng,
                description: `${details.stationReturn.address}, ${details.stationReturn.openingHours}`,
              } : undefined} headline="Return Station" />
            </DetailsSection>
          </div>
          <div className="hidden lg:block w-[35%] self-start sticky top-20">
            <DetailsBox
              costs={details?.costs ? {
                pricePerNight: details.costs.perNight,
                price: details.costs.total,
                totalEur: details.costs.total,
              } : undefined}
              locations={locations}
              dates={dates}
              avail={availability ? { NA: !availability.isAvailable } : undefined}
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
        <DetailsRecommendations recommendations={recommendations.map(rec => ({
          ...rec,
          vehicle: { id: rec.id, name: rec.name, rating: 4.5, mood1: "adventure" }, // Mock vehicle data
          rentalCompany: { name: "Mock Rental Co." }, // Mock rental company data
          stationLabel: "Mock Station", // Mock station label
          stationCount: 1, // Mock station count
        }))} />
      </div>
      <DetailsMobileBox
        costs={details?.costs ? {
          pricePerNight: details.costs.perNight,
          price: details.costs.total,
        } : undefined}
        avail={availability ? { NA: !availability.isAvailable } : undefined}
        duration={duration}
        onBookClick={handleBookClick}
        onDetailsClick={() => handleDetailsSidebar(true)}
      />
      <DetailsBoxSidebar
        costs={details?.costs ? {
          pricePerNight: details.costs.perNight,
          price: details.costs.total,
          totalEur: details.costs.total,
        } : undefined}
        locations={locations}
        dates={dates}
        avail={availability ? { NA: !availability.isAvailable, UNKNOWN: false } : undefined}
        duration={duration}
        participants={participants}
        selectedAddons={selectedAddonsState}
        vehicleName={vehicleName}
        vehicleImage={vehicleThumbnail?.src}
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
