"use server";

import {cache} from 'react';
import {createDbConnection} from '@/lib/db/utils';
import {searchCampers} from '@/lib/db/campers';
import {searchProviders} from '@/lib/db/providers';
import {searchStations} from '@/lib/db/stations';
import {CamperWIthTileImage} from '@/types/camper';
import {ProviderWithImageTile} from '@/types/provider';
import {StationWithImageTile} from '@/types/station';

export interface SearchResults {
    campers: (CamperWIthTileImage & { providerName?: string })[];
    providers: ProviderWithImageTile[];
    stations: StationWithImageTile[];
}

export const performSearch = cache(async (query: string): Promise<SearchResults> => {
    let connection;
    try {
        connection = await createDbConnection();
        let campers: (CamperWIthTileImage & { providerName?: string })[] = await searchCampers(connection, query);
        const providers = await searchProviders(connection, query);
        const stations = await searchStations(connection, query);

        campers = campers?.length ? campers.map((camper) => {
            camper.providerName = providers?.length && providers.find(p => p.id === camper.provider_id)?.company_name || 'Unknown';
            return camper;
        }) : [];

        return {campers, providers, stations};
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
