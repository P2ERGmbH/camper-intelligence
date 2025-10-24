import React from 'react';
import ProviderTile from "@/components/provider/ProviderTile";
import {CamperWIthTileImage} from "@/types/camper";


interface ProviderStationTileProps {
    camper: CamperWIthTileImage;
    children: React.ReactNode;
    onToggleActive: (camperId: number, isActive: boolean) => void;
}

export default function ProviderCamperTile({camper, children, onToggleActive}: ProviderStationTileProps) {
    return (
        <ProviderTile
            onToggleActive={(isActive)=>{onToggleActive(camper.id, isActive)}}
            headline={camper.name}
            copy={(
                <p className={"whitespace-nowrap overflow-ellipsis overflow-hidden"}>
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
