import React from 'react';
import {StationWithImageTile} from '@/types/station';
import ProviderTile from "@/components/provider/ProviderTile";


interface ProviderStationTileProps {
    station: StationWithImageTile;
    children: React.ReactNode;
    onToggleActive: (isActive: boolean) => void;
}

export default function ProviderStationTile({station, children, onToggleActive}: ProviderStationTileProps) {
    return (
        <ProviderTile
            headline={station.city}
            copy={(
                <>
                    <p>{station.street} {station.street_number}</p>
                    <p>{station.postal_code} {station.city}</p>
                </>
            )}
            countryCode={station?.country_code || ''}
            active={station.active}
            images={station?.imageTile && [station.imageTile] || []}
            onToggleActive={onToggleActive}>
            {children}
        </ProviderTile>
    );
}
