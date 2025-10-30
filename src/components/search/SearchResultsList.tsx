import React from 'react';
import {useTranslations} from 'next-intl';
import SearchResultItem from '@/components/search/SearchResultItem';
import {generateProviderSlug} from '@/lib/utils/slug';
import {CamperWIthTileImage} from "@/types/camper";
import {ProviderWithImageTile} from "@/types/provider";
import {StationWithImageTile} from "@/types/station";

interface SearchResultsListProps {
    campers?: (CamperWIthTileImage & { providerName?: string })[];
    providers?: ProviderWithImageTile[];
    stations?: StationWithImageTile[];
    onResultClick?: () => void;

}

export default function SearchResultsList({campers, providers, stations, onResultClick}: SearchResultsListProps) {
    const t = useTranslations('search');


    const hasResults = campers?.length || providers?.length || stations?.length;
    if (!hasResults) {
        return null;
    }

    return (
        <>
            {providers?.length ? providers.map((provider) => (
                <SearchResultItem
                    key={provider.id}
                    type={'provider'}
                    name={provider.company_name}
                    description={t('provider')}
                    imageUrl={provider.imageTile?.url}
                    imageAlt={provider.company_name}
                    href={{
                        pathname: '/provider/[slug]',
                        params: {slug: generateProviderSlug(provider.company_name, provider.id)}
                    }}
                    onClick={onResultClick}
                />
            )) : null}
            {stations?.length ? stations.map((station) => (
                <SearchResultItem
                    key={station.id}
                    type="station"
                    name={station.city || station.name || 'Station'}
                    description={`${t('station')} · ${station.city}`}
                    imageUrl={station.imageTile?.url}
                    imageAlt={station.name || "Station"}
                    href={{
                        pathname: '/provider/[slug]/stations/[stationId]',
                        params: {
                            slug: generateProviderSlug('Vermieter', station.provider_id),
                            stationId: station.id
                        }
                    }}
                    onClick={onResultClick}
                />
            )) : null}
            {campers?.length ? campers.map((camper) => (
                <SearchResultItem
                    key={camper.id}                    type="camper"
                    name={camper.name}
                    description={`${t('camper')} · ${camper.providerName || 'Unknown'}`}
                    imageUrl={camper.tileImage?.url}
                    imageAlt={camper.name}
                    href={{
                        pathname: '/provider/[slug]/campers/[camperId]',
                        params: {
                            slug: generateProviderSlug('Camper', camper.provider_id),
                            camperId: camper.id
                        }
                    }}
                    onClick={onResultClick}
                />
            )) : null}
        </>
    );
}
