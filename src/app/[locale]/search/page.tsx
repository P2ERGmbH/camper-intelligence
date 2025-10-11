import { useTranslations } from "next-intl";
import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/routing";

export default function SearchPage() {
  const t = useTranslations("search");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ClientHeader />

      <main className="flex-grow container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900">{t("hero-title")}</h1>
        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-600">{t("hero-subtitle")}</p>

        <div className="mb-16">
          {/* Search Bar Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-gray-200">
            <p className="text-gray-500">{t("searchBarPlaceholder")}</p>
            <Link href="#" className="mt-6 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              {t("searchButton")}
            </Link>
          </div>
        </div>

        {/* Unique Selling Points */}
        <section className="py-16 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{t("usp-title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* USP 1: Fast & Easy Search */}
              <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mx-auto mb-6">
                  <svg className="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t("usp-fastSearch-title")}</h3>
                <p className="text-gray-600">{t("usp-fastSearch-description")}</p>
              </div>

              {/* USP 2: Flexible Payment Methods */}
              <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mx-auto mb-6">
                  <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t("usp-paymentMethods-title")}</h3>
                <p className="text-gray-600">{t("usp-paymentMethods-description")}</p>
              </div>

              {/* USP 3: Awesome Booking Experience */}
              <div className="text-center p-8 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-purple-100 mx-auto mb-6">
                  <svg className="h-12 w-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M16 19h.01"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t("usp-bookingExperience-title")}</h3>
                <p className="text-gray-600">{t("usp-bookingExperience-description")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
