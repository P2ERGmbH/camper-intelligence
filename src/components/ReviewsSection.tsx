import { useTranslations } from "next-intl";
import Image from "next/image";

interface Review {
  authorName: string;
  authorAvatarUrl: string;
  date: string;
  comment: string;
  rating: number;
}

interface ReviewsSectionProps {
  overallRating: number;
  reviewCount: number;
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  reviews: Review[]; // Typically a subset, e.g., the first 6
}

export default function ReviewsSection({ overallRating, reviewCount, ratingBreakdown, reviews }: ReviewsSectionProps) {
  const t = useTranslations("camperDetails");

  const totalReviews = Object.values(ratingBreakdown).reduce((sum, count) => sum + count, 0);

  const getProgressBarWidth = (starCount: number) => {
    if (totalReviews === 0) return "0%";
    return `${(starCount / totalReviews) * 100}%`;
  };

  return (
    <div className="py-6 border-t mt-8" id="reviews">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
        {overallRating.toFixed(2)} · {t("reviews", { count: reviewCount })}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{star} {t("stars")}</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: getProgressBarWidth(ratingBreakdown[star as keyof typeof ratingBreakdown]) }}
              ></div>
            </div>
            <span className="text-sm text-gray-700">{ratingBreakdown[star as keyof typeof ratingBreakdown]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
        {reviews.map((review, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={review.authorAvatarUrl}
                  alt={review.authorName}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{review.authorName}</span>
                <span className="text-sm text-gray-600">{review.date}</span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      <button className="mt-6 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
        {t("showAllReviews", { count: reviewCount })}
      </button>
    </div>
  );
}
