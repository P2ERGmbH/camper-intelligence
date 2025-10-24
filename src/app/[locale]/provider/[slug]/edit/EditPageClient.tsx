'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Provider } from '@/types/provider';
import { useRouter } from 'next/navigation';
import {useProviderContext} from "@/contexts/ProviderContext";

export default function EditPageClient() {
  const t = useTranslations('dashboard');
  const router = useRouter();

  const { providers  } =  useProviderContext()
    const provider: Provider = providers[0];

  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    email: '',
    page_url: '',
    description: '',
    website: '',
    tax_id: '',
    min_driver_age: 0,
    deposit_amount: 0,
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        company_name: provider.company_name || '',
        address: provider.address || '',
        email: provider.email || '',
        page_url: provider.page_url || '',
        description: provider.description || '',
        website: provider.website || '',
        tax_id: provider.tax_id || '',
        min_driver_age: provider.min_driver_age || 0,
        deposit_amount: provider.deposit_amount || 0,
      });
    }
  }, [provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/provider/${provider.ext_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(t('provider-update-success'));
        router.refresh(); // Refresh the page to show updated data
      } else {
        const errorData = await response.json();
        alert(`${t('provider-update-error')}: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to update provider:', error);
      alert(t('provider-update-error-network'));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('editButton')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">{t('company-name')}</label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('address')}</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="page_url" className="block text-sm font-medium text-gray-700">{t('page-url')}</label>
          <input
            type="text"
            name="page_url"
            id="page_url"
            value={formData.page_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('description')}</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">{t('website')}</label>
          <input
            type="text"
            name="website"
            id="website"
            value={formData.website}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">{t('tax-id')}</label>
          <input
            type="text"
            name="tax_id"
            id="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="min_driver_age" className="block text-sm font-medium text-gray-700">{t('min-driver-age')}</label>
          <input
            type="number"
            name="min_driver_age"
            id="min_driver_age"
            value={formData.min_driver_age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700">{t('deposit-amount')}</label>
          <input
            type="number"
            name="deposit_amount"
            id="deposit_amount"
            value={formData.deposit_amount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {t('save-changes')}
        </button>
      </form>
    </div>
  );
}
