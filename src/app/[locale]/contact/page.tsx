import { useTranslations } from "next-intl";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
          <p className="text-lg text-gray-600 mb-8">{t("description")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("companyDetailsTitle")}</h2>
              <p className="text-gray-600">
                <strong>{t("companyName")}:</strong> Camper Intelligence GmbH
              </p>
              <p className="text-gray-600">
                <strong>{t("address")}:</strong> Musterstraße 123, 12345 Musterstadt
              </p>
              <p className="text-gray-600">
                <strong>{t("phone")}:</strong> +49 123 456789
              </p>
              <p className="text-gray-600">
                <strong>{t("email")}:</strong> info@camper-intelligence.com
              </p>
              <p className="mt-4 text-gray-600">{t("benefits")}</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("contactFormTitle")}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
