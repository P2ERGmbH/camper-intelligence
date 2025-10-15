"use client";

import React, { useState } from 'react';
import {useLocale, useTranslations} from 'next-intl';
import Button from '@/components/Button';

export const AdminJucyUnifiedImportClient = () => {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const locale = useLocale();

  const handleUnifiedImport = async () => {
    setIsLoading(true);
    setResponseMessage(null);
    setIsError(false);

    try {
      const response = await fetch(`/${locale}/api/admin/import/unified/jucy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(t('jucyUnifiedImportSuccess'));
        setIsError(false);
      } else {
        setResponseMessage(data.message || t('jucyUnifiedImportError'));
        setIsError(true);
      }
    } catch (error) {
      console.error('Unified Jucy import failed:', error);
      setResponseMessage(t('jucyUnifiedImportError'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('jucyUnifiedImportTitle')}</h2>
      <Button onClick={handleUnifiedImport} disabled={isLoading}>
        {isLoading ? t('importing') : t('startUnifiedJucyImport')}
      </Button>
      {responseMessage && (
        <div className={`mt-4 p-3 rounded-md ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};
