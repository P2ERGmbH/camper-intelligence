import mysql from 'mysql2/promise';
import {Provider, ProviderWithImageTile} from '@/types/provider';
import {getProviderLogo} from '@/lib/db/images';

export async function getProviderByExtId(connection: mysql.Connection, extId: string): Promise<Provider | null> {
    const [rows] = await connection.execute('SELECT * FROM providers WHERE ext_id = ?', [extId]);
    const providers = rows as Provider[];
    return providers.length > 0 ? providers[0] : null;
}

export async function getAllProviders(connection: mysql.Connection): Promise<ProviderWithImageTile[]> {
    const [rows] = await connection.execute('SELECT * FROM providers');
    const providers: Provider[] = rows as Provider[];
    const providersWithImages: ProviderWithImageTile[] = await Promise.all(
        providers.map(async (provider) => {
            const imageTile = await getProviderLogo(connection, provider.id);
            return {...provider, imageTile} as ProviderWithImageTile;
        })
    );
    return providersWithImages;
}

export async function updateProvider(connection: mysql.Connection, provider: Partial<Provider>): Promise<void> {
    const {id, ...fields} = provider;
    const setClauses = Object.keys(fields).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(fields);

    if (setClauses) {
        await connection.execute(`UPDATE providers
                                  SET ${setClauses}
                                  WHERE id = ?`, [...values, id]);
    }
}

export async function getProviderById(connection: mysql.Connection, id: number): Promise<Provider | null> {
    const [rows] = await connection.execute('SELECT * FROM providers WHERE id = ?', [id]);
    const providers = rows as Provider[];
    return providers.length > 0 ? providers[0] : null;
}

export async function getProvidersByUserId(connection: mysql.Connection, userId: number): Promise<Provider[]> {
    try {
        const [rows] = await connection.execute(`
            SELECT p.*
            FROM providers p
                     JOIN provider_users pu ON p.id = pu.provider_id
            WHERE pu.user_id = ?
        `, [userId]);
        return rows as Provider[];
    } catch (error) {
        console.error('Error fetching providers by user ID:', error);
        throw error;
    }
}

export async function searchProviders(connection: mysql.Connection, searchTerm: string): Promise<ProviderWithImageTile[]> {
    const [rows] = await connection.execute(
        'SELECT * FROM providers WHERE company_name LIKE ? OR description LIKE ?',
        [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    const providers: Provider[] = rows as Provider[];
    const providersWithImages: ProviderWithImageTile[] = await Promise.all(
        providers.map(async (provider) => {
            const imageTile = await getProviderLogo(connection, provider.id);
            return {...provider, imageTile} as ProviderWithImageTile;
        })
    );
    return providersWithImages;
}
