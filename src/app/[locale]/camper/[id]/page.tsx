'use client';

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";

import DetailsPageContent from "@/components/DetailsPageContent";

import { Camper } from "@/types/camper";
import { ImageProps } from '@/types/image';



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

export default function CamperDetailsPage() {
  const t = useTranslations("camperDetails");
  const params = useParams();
  const { id, locale } = params;
  const [camper, setCamper] = useState<CamperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsSidebarOpen, setDetailsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCamperDetails = async () => {
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
          station_id: null,
          name: "Adventure Seeker 5000",
          description: "A robust and comfortable camper perfect for long journeys and off-grid adventures. Equipped with all modern amenities.",
          price_per_day: 120,
          images: [
            { src: "/public/uploads/img.png", alt: "Camper van exterior", width: 768, height: 432 } as ImageProps,
            { src: "/public/uploads/img.png", alt: "Camper van interior 1", width: 768, height: 432 } as ImageProps,
            { src: "/public/uploads/img.png", alt: "Camper van interior 2", width: 768, height: 432 } as ImageProps,
            { src: "/public/uploads/img.png", alt: "Camper van kitchen", width: 768, height: 432 } as ImageProps,
            { src: "/public/uploads/img.png", alt: "Camper van bedroom", width: 768, height: 432 } as ImageProps,
            { src: "/public/uploads/img.png", alt: "Camper van bathroom", width: 768, height: 432 } as ImageProps,
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCamperDetails();
  }, [id, locale, t]);

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
                segments: [
                  {
                    headline: t("dimensions"),
                    items: [
                      {
                        icon: "ruler", // Mock icon
                        label: t("length"),
                        value: `${(camper.dimension_length_min ?? 0) / 100} m`,
                      },
                      {
                        icon: "ruler", // Mock icon
                        label: t("height"),
                        value: `${(camper.dimension_height_min ?? 0) / 100} m`,
                      },
                      {
                        icon: "ruler", // Mock icon
                        label: t("width"),
                        value: `${(camper.dimension_width_min ?? 0) / 100} m`,
                      },
                    ],
                  },
                  {
                    headline: t("capacity"),
                    items: [
                      {
                        icon: "water-tank", // Mock icon
                        label: t("freshwaterTank"),
                        value: `${camper.tank_freshwater ?? 0} l`,
                      },
                      {
                        icon: "water-tank", // Mock icon
                        label: t("wastewaterTank"),
                        value: `${camper.tank_wastewater1 ?? 0} l`,
                      },
                    ],
                  },
                  {
                    headline: t("generalSpecs"),
                    items: camper.specs.map(s => ({
                      icon: s.icon, // Assuming s.icon exists
                      label: s.label,
                      value: s.value.toString()
                    }))
                  }
                ],
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
                adults: camper.sleeps_adults ?? 0,
                children: camper.sleeps_children ?? 0,
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
                  text: camper.description ?? '',
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
              description: camper.description ?? undefined,
              max_adults: camper.max_adults ?? undefined,
              max_children: camper.max_children ?? undefined,
              ideal_adults: camper.sleeps_adults ?? undefined,
              ideal_children: camper.sleeps_children ?? undefined,
              passengers_seats: camper.passengers_seats ?? undefined,
              passengers_seats_child_seats: camper.passengers_seats_isofix ?? undefined,
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
            recommendations={[{ // Mock recommendations
              id: "1",
              name: "Mock Camper",
              vehicle: { id: "1", name: "Mock Camper", rating: 4.5, mood1: "adventure" },
              rentalCompany: { name: "Mock Rental Co." },
              stationLabel: "Mock Station",
              stationCount: 1,
            }]} 
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
