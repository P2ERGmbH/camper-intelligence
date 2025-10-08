'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TabNavigation from '@/components/layout/TabNavigation';

export default function LegalPage() {
  const t = useTranslations('dashboard');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/provider/whoami');
        if (!res.ok) {
          router.push('/provider/login');
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push('/provider/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchLegalInfo = async () => {
      try {
        const res = await fetch('/api/provider/legal');
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.company_name || '');
          setAddress(data.address || '');
          setTaxId(data.tax_id || '');
        }
      } catch (error) {
        console.error('Failed to fetch legal info', error);
      }
    };
    fetchLegalInfo();
  }, []);

  const handleLegalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch('/api/provider/legal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, address, tax_id: taxId }),
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Information saved successfully!' });
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || 'Failed to save information.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <TabNavigation />
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('legal-title')}</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <form className="space-y-6" onSubmit={handleLegalSubmit}>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    {t('legal-company_name')}
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    {t('legal-address')}
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                    {t('legal-tax_id')}
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    id="tax_id"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : t('legal-save_button')}
                  </button>
                </div>
                {feedback.message && (
                  <div className={`text-sm text-center ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
