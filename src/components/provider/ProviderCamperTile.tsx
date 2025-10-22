import React from 'react';
import ProviderTile from "@/components/provider/ProviderTile";
import {CamperWIthTileImage} from "@/types/camper";


interface ProviderStationTileProps {
    camper: CamperWIthTileImage;
    children: React.ReactNode;
}

export default function ProviderCamperTile({camper, children}: ProviderStationTileProps) {
    return (
        <ProviderTile
            headline={camper.name}
            copy={(
                <p className={"whitespace-nowrap overflow-ellipsis"}>
                    {camper.description}
                </p>
            )}
            countryCode={''}
            active={camper.active || false}
            images={camper?.tileImage && [camper.tileImage] || []}>
            {children}
        </ProviderTile>
    );
}
