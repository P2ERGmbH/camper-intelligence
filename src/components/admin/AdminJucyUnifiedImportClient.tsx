"use client";

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

export const AdminJucyUnifiedImportClient = () => {
  const t = useTranslations('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnifiedImport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API calls to fetch Jucy products and sites
      // TODO: Process data to establish relationships
      // TODO: Call server-side API to save unified data to database

      toast.success(t('jucyUnifiedImportSuccess'));
    } catch (error) {
      console.error('Unified Jucy import failed:', error);
      toast.error(t('jucyUnifiedImportError'));
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
    </div>
  );
};
