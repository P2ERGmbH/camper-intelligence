import { useTranslations } from "next-intl";

interface ProductHeaderProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export default function ProductHeader({ name, location, rating, reviewCount }: ProductHeaderProps) {
  const t = useTranslations("camperDetails");

  return (
    <div className="flex justify-between items-center py-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
          </svg>
          <span>{rating.toFixed(2)}</span>
          <span className="mx-1">·</span>
          <a href="#reviews" className="underline">
            {t("reviews", { count: reviewCount })}
          </a>
          <span className="mx-1">·</span>
          <span>{location}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
          <span>{t("share")}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span>{t("save")}</span>
        </button>
      </div>
    </div>
  );
}
