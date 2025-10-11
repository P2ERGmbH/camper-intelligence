import { useTranslations } from "next-intl";

interface LocationMapProps {
  locationName: string;
}

export default function LocationMap({ locationName }: LocationMapProps) {
  const t = useTranslations("camperDetails");

  return (
    <div className="py-6 border-t mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whereYoullBe")}</h2>
      <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden my-6 flex items-center justify-center text-gray-500">
        {/* Placeholder for map component */}
        <p>{t("mapPlaceholder", { location: locationName })}</p>
      </div>
      <h3 className="font-bold text-xl text-gray-900">{locationName}</h3>
    </div>
  );
}
