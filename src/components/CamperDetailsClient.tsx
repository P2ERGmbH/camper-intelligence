'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import DetailsPageContent from "@/components/DetailsPageContent";

import { Camper } from "@/types/camper";

interface Vehicle {
  id: string;
  name: string;
  rating?: number;
  mood1?: string;
  price?: number;
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

interface CamperDetail extends Camper {
  images: { src: string; alt: string; }[];
  price_per_day: number;
  features: string[];
  location: string;
  rating: number;
  reviewCount: number;
  specs: { icon: string; label: string; value: string | number; }[];
  host: { name: string; avatarUrl: string; joinDate: string; isSuperhost?: boolean; };
  reviews: { authorName: string; authorAvatarUrl: string; date: string; comment: string; rating: number; }[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

interface CamperDetailsClientProps {
  initialCamper: CamperDetail | null;
  initialLoading: boolean;
  initialError: string | null;
}

export default function CamperDetailsClient({ initialCamper, initialLoading, initialError }: CamperDetailsClientProps) {
  const t = useTranslations("camperDetails");
  const params = useParams();
  const { id, locale } = params;
  const [camper, setCamper] = useState<CamperDetail | null>(initialCamper);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [detailsSidebarOpen, setDetailsSidebarOpen] = useState(false);

  // Client-side re-fetching if needed, e.g., after an action
  useEffect(() => {
    const fetchCamperDetails = async () => {
      if (initialCamper === null && !initialLoading && !initialError) {
        setLoading(true);
        setError(null);
        try {
          // For now, using mock data. In a real scenario, this would be an API call.
          // const response = await fetch(`/${locale}/api/camper/${id}`);
          // if (!response.ok) {
          //   throw new Error("Failed to fetch camper details");
          // }
          // const data = await response.json();
          // setCamper(data);

          // Mock data
          setCamper({
            id: parseInt(id as string),
            provider_id: 1,
            name: "Adventure Seeker 5000",
            description: "A robust and comfortable camper perfect for long journeys and off-grid adventures. Equipped with all modern amenities.",
            price_per_day: 120,
            images: [
              { src: "/public/uploads/img.png", alt: "Camper van exterior", width: 768, height: 432 },
              { src: "/public/uploads/img.png", alt: "Camper van interior 1", width: 768, height: 432 },
              { src: "/public/uploads/img.png", alt: "Camper van interior 2", width: 768, height: 432 },
              { src: "/public/uploads/img.png", alt: "Camper van kitchen", width: 768, height: 432 },
              { src: "/public/uploads/img.png", alt: "Camper van bedroom", width: 768, height: 432 },
              { src: "/public/uploads/img.png", alt: "Camper van bathroom", width: 768, height: 432 },
            ],
            features: ["Sleeps 4", "Kitchenette", "Solar Panels", "A/C", "Heater", "Outdoor Shower"],
            sleeps_adults: 2,
            sleeps_children: 2,
            max_adults: 3,
            max_children: 2,
            passengers_seats: 4,
            passengers_seats_isofix: 2,
            dimension_length_min: 600,
            dimension_height_min: 300,
            dimension_width_min: 200,
            transmission_automatic: true,
            awning: true,
            air_condition_driving_cabin: true,
            air_condition_living_area: true,
            shower_wc: 1,
            tank_freshwater: 100,
            tank_wastewater1: 80,
            fridge: true,
            navigation: true,
            consumption: 10,
            four_wd: false,
            rear_cam: true,
            tv: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            location: "Norderstedt, Schleswig-Holstein",
            rating: 4.95,
            reviewCount: 124,
            specs: [
              { icon: "sleeps", label: t("sleeps"), value: 2 + 2 },
              { icon: "passengers", label: t("passengers"), value: 4 },
              { icon: "transmission", label: t("transmission"), value: true ? t("automatic") : t("manual") },
              { icon: "consumption", label: t("consumption"), value: `${10} l/100km` },
            ],
            host: {
              name: "John Doe",
              avatarUrl: "/file.svg", // Placeholder avatar
              joinDate: "2023",
              isSuperhost: true,
            },
            reviews: [
              {
                authorName: "Alice Wonderland",
                authorAvatarUrl: "/file.svg",
                date: "October 2025",
                comment: "Absolutely loved this camper! It was clean, well-maintained, and perfect for our family trip. The solar panels were a huge plus for off-grid camping.",
                rating: 5,
              },
              {
                authorName: "Bob The Builder",
                authorAvatarUrl: "/file.svg",
                date: "September 2025",
                comment: "Great experience overall. The camper was spacious enough for us and our two kids. The kitchenette was very handy. Would rent again!",
                rating: 4,
              },
              {
                authorName: "Charlie Chaplin",
                authorAvatarUrl: "/file.svg",
                date: "August 2025",
                comment: "The camper was as described. Had a minor issue with the water pump, but the host was very responsive and helped us fix it quickly.",
                rating: 3,
              },
            ],
            ratingBreakdown: { 5: 80, 4: 30, 3: 10, 2: 2, 1: 2 },
          });
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCamperDetails();
  }, [id, locale, t, initialCamper, initialLoading, initialError]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
        <ClientHeader />
        <main className="flex-grow container mx-auto px-6 py-12 text-center">
          <p>{t("loading")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
        <ClientHeader />
        <main className="flex-grow container mx-auto px-6 py-12 text-center">
          <p className="text-red-500">{t("error")}: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!camper) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
        <ClientHeader />
        <main className="flex-grow container mx-auto px-6 py-12 text-center">
          <p>{t("notFound")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ClientHeader />
      <main className="flex-grow">
        {camper && (
          <DetailsPageContent
            detailsStatic={{
              stage: { images: camper.images },
              summary: {
                name: camper.name,
                renter: camper.host.name,
              },
              features: {
                list: camper.features,
              },
              rentalCompany: {
                info: {
                  rentalConditions: "Mock rental conditions",
                },
              },
              specs: {
                description: camper.description,
                sections: {
                  day: {
                    lists: [
                      {
                        label: t("dimensions"),
                        icon: "ruler", // Mock icon
                        items: [
                          {
                            label: t("length"),
                            value: `${camper.dimension_length_min / 100} m`,
                          },
                          {
                            label: t("height"),
                            value: `${camper.dimension_height_min / 100} m`,
                          },
                          {
                            label: t("width"),
                            value: `${camper.dimension_width_min / 100} m`,
                          },
                        ],
                      },
                      {
                        label: t("capacity"),
                        icon: "water-tank", // Mock icon
                        items: [
                          {
                            label: t("freshwaterTank"),
                            value: `${camper.tank_freshwater} l`,
                          },
                          {
                            label: t("wastewaterTank"),
                            value: `${camper.tank_wastewater1} l`,
                          },
                        ],
                      },
                      {
                        label: t("generalSpecs"),
                        icon: "info", // Mock icon
                        items: camper.specs.map(s => ({
                          label: s.label,
                          value: s.value.toString()
                        }))
                      }
                    ],
                    floorplan: "/public/uploads/floorplan.png", width: 680, height: 1669, // Mock floorplan image
                  },
                  night: {
                    lists: [],
                    floorplan: "",
                  },
                },
              },
            }}
            details={{
              price: camper.price_per_day,
              locations: {
                pickup: {
                  name: camper.location,
                  coords: { lat: 53.6789, lng: 10.0 }, // Mock coordinates
                },
                return: {
                  name: camper.location,
                  coords: { lat: 53.6789, lng: 10.0 }, // Mock coordinates
                },
              },
              duration: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
              },
              costs: {
                total: camper.price_per_day * 7,
                perNight: camper.price_per_day,
              },
              participants: {
                adults: camper.sleeps_adults,
                children: camper.sleeps_children,
              },
              dates: {
                from: new Date().toISOString(),
                to: new Date(Date.now() + 86400000 * 7).toISOString(),
              },
              addons: {
                items: [], // Mock addons
              },
              infos: [
                {
                  headline: t("descriptionTitle"),
                  text: camper.description,
                },
              ],
              specials: [],
              stationTakeover: {
                name: camper.location,
                address: "Mock Street 1, 12345 Mock City",
                coords: { lat: 53.6789, lng: 10.0 },
                openingHours: "Mo-Fr: 09:00-17:00",
              },
              stationReturn: {
                name: camper.location,
                address: "Mock Street 1, 12345 Mock City",
                coords: { lat: 53.6789, lng: 10.0 },
                openingHours: "Mo-Fr: 09:00-17:00",
              },
            }}
            vehicle={{
              name: camper.name,
              rating: camper.rating,
              description: camper.description,
              max_adults: camper.max_adults,
              max_children: camper.max_children,
              ideal_adults: camper.sleeps_adults,
              ideal_children: camper.sleeps_children,
              passengers_seats: camper.passengers_seats,
              passengers_seats_child_seats: camper.passengers_seats_isofix,
            }}
            availability={{
              isAvailable: true,
              info: t("available"),
            }}
            reviews={{
              overallRating: camper.rating,
              reviewCount: camper.reviewCount,
              ratingBreakdown: camper.ratingBreakdown,
              reviews: camper.reviews,
            }}
            recommendations={[] as Recommendation[]} // Mock recommendations
            cancellationConditions={{
              isFree: true,
              boxHeadline: t("cancellationBoxHeadline"),
              boxCopy: t("cancellationBoxCopy"),
              table: [
                {
                  daysBefore: "30+",
                  fee: "0%",
                },
                {
                  daysBefore: "15-29",
                  fee: "50%",
                },
                {
                  daysBefore: "0-14",
                  fee: "100%",
                },
              ],
            }}
            loading={loading}
            detailsSidebarOpen={detailsSidebarOpen}
            setDetailsSidebarOpen={setDetailsSidebarOpen}
          />
        )}
      </main>

    </div>
  );
}
