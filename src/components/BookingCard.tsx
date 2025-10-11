import { useTranslations } from "next-intl";
import { useState } from "react";

interface BookingCardProps {
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  serviceFee?: number;
  cleaningFee?: number;
}

export default function BookingCard({ pricePerNight, rating, reviewCount, serviceFee = 0, cleaningFee = 0 }: BookingCardProps) {
  const t = useTranslations("camperDetails");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  // Mock calculation for now
  const numberOfNights = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const subtotal = pricePerNight * numberOfNights;
  const total = subtotal + serviceFee + cleaningFee;

  return (
    <div className="sticky top-8 border rounded-xl shadow-lg p-6 bg-white">
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-2xl font-bold text-gray-900">{pricePerNight}€ / {t("perNight")}</span>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
          </svg>
          <span>{rating.toFixed(2)}</span>
          <span className="mx-1">·</span>
          <a href="#reviews" className="underline">
            {t("reviews", { count: reviewCount })}
          </a>
        </div>
      </div>

      <div className="border rounded-lg mb-4">
        <div className="grid grid-cols-2 border-b">
          <div className="p-3 border-r">
            <label htmlFor="check-in" className="block text-xs font-bold text-gray-700">{t("checkIn")}</label>
            <input type="date" id="check-in" className="w-full mt-1 focus:outline-none" onChange={(e) => setStartDate(new Date(e.target.value))} />
          </div>
          <div className="p-3">
            <label htmlFor="check-out" className="block text-xs font-bold text-gray-700">{t("checkOut")}</label>
            <input type="date" id="check-out" className="w-full mt-1 focus:outline-none" onChange={(e) => setEndDate(new Date(e.target.value))} />
          </div>
        </div>
        <div className="p-3">
          <label htmlFor="guests" className="block text-xs font-bold text-gray-700">{t("guests")}</label>
          <input type="number" id="guests" min="1" value={numberOfGuests} className="w-full mt-1 focus:outline-none" onChange={(e) => setNumberOfGuests(parseInt(e.target.value))} />
        </div>
      </div>

      <button className="w-full bg-pink-600 text-white rounded-lg py-3 font-bold text-lg hover:bg-pink-700 transition-colors mb-4">
        {t("reserve")}
      </button>

      {numberOfNights > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">{pricePerNight}€ x {numberOfNights} {t("nights")}</span>
            <span>{subtotal.toFixed(2)}€</span>
          </div>
          {serviceFee > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{t("serviceFee")}</span>
              <span>{serviceFee.toFixed(2)}€</span>
            </div>
          )}
          {cleaningFee > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{t("cleaningFee")}</span>
              <span>{cleaningFee.toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
            <span>{t("total")}</span>
            <span>{total.toFixed(2)}€</span>
          </div>
        </div>
      )}
    </div>
  );
}
