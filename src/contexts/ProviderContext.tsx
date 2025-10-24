"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Provider } from '@/types/provider';
import { Camper } from '@/types/camper';
import { Station } from '@/types/station';
import { Addon } from '@/types/addon';

interface ProviderContextType {
  providers: Provider[];
  setProviders: (providers: Provider[]) => void;
  campers: Camper[];
  setCampers: (campers: Camper[]) => void;
  stations: Station[];
  setStations: (stations: Station[]) => void;
  addons: Addon[];
  setAddons: (addons: Addon[]) => void;
  activeProviderId: number | null;
  setActiveProviderId: (id: number | null) => void;
  activeCamperId: number | null;
  setActiveCamperId: (id: number | null) => void;
  activeStationId: number | null;
  setActiveStationId: (id: number| null) => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export function ProviderContextProvider({ children, initial }: { children: ReactNode; initial?: { providers?: Provider[]; campers?: Camper[]; stations?: Station[]; addons?: Addon[], activeProviderId?:number } }) {
  const [providers, setProviders] = useState<Provider[]>(initial?.providers || []);
  const [campers, setCampers] = useState<Camper[]>(initial?.campers || []);
  const [stations, setStations] = useState<Station[]>(initial?.stations || []);
  const [addons, setAddons] = useState<Addon[]>(initial?.addons || []);
  const [activeProviderId, setActiveProviderId] = useState<number | null>(initial?.activeProviderId || initial?.providers?.[0]?.id || null);
  const [activeCamperId, setActiveCamperId] = useState<number | null>(null);
  const [activeStationId, setActiveStationId] = useState<number | null>(null);

  const value = {
    providers,
    setProviders,
    campers,
    setCampers,
    stations,
    setStations,
    addons,
    setAddons,
    activeProviderId,
    setActiveProviderId,
    activeCamperId,
    setActiveCamperId,
    activeStationId,
    setActiveStationId,
  };

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

export function useProviderContext() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProviderContext must be used within a ProviderProvider');
  }
  return context;
}
