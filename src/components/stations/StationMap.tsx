'use client';

import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface StationMapProps {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};



export default function StationMap({ lat, lng }: StationMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBCXNPK7GzR2ejGhj7J6Ri64kW9EJU_XxQ',
  });

  const center = { lat: parseFloat(`${lat}`), lng: parseFloat(`${lng}`) };
  console.log(center);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
      Loading Map...
    </div>
  );
}
