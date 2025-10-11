import { useTranslations } from "next-intl";

interface StickyFooterProps {
  pricePerNight: number;
}

export default function StickyFooter({ pricePerNight }: StickyFooterProps) {
  const t = useTranslations("camperDetails");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center md:hidden shadow-lg">
      <div>
        <span className="text-xl font-bold text-gray-900">{pricePerNight}€</span>
        <span className="text-gray-600"> / {t("perNight")}</span>
      </div>
      <button className="bg-pink-600 text-white rounded-lg px-6 py-2 font-bold text-base hover:bg-pink-700 transition-colors">
        {t("reserve")}
      </button>
    </div>
  );
}
