"use client";

import { useEffect } from 'react';
import { Provider } from '@/types/provider';
import { CamperWIthTileImage } from '@/types/camper';
import { Station } from '@/types/station';
import { Addon } from '@/types/addon';
import { useProviderContext } from '@/contexts/ProviderContext';
import ProviderDetailsClient from '@/components/provider/ProviderDetailsClient';

interface ProviderDetailsWrapperProps {
  provider: Provider;
  campers: CamperWIthTileImage[];
  stations: Station[];
  addons: Addon[];
}

export default function ProviderDetailsWrapper({
  provider,
  campers,
  stations,
  addons,
}: ProviderDetailsWrapperProps) {
  const { setProviders, setCampers, setStations, setAddons, setActiveProviderId } = useProviderContext();

  useEffect(() => {
    setProviders([provider]); // Assuming only one provider is active at a time for this view
    setCampers(campers);
    setStations(stations);
    setAddons(addons);
    setActiveProviderId(provider.id);
  }, [provider, campers, stations, addons, setProviders, setCampers, setStations, setAddons, setActiveProviderId]);

  return <ProviderDetailsClient />;
}
