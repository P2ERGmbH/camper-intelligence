import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';

const CU_CAMPER_API_URL = 'https://www.cu-camper.com/api/api.php?run=RentalCompaniesApi&language=de&affiliate=cuweb&apikey=99a9a56487b3f745abe9832b78541aa9512e801a';

interface ExistingProvider {
  id: number;
}

export async function POST() {
  let connection;
  try {
    const response = await fetch(CU_CAMPER_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from CU Camper API: ${response.statusText}`);
    }
    const externalProviders = await response.json();

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    for (const extProvider of externalProviders) {
      // Check if provider already exists by ext_id
      const [existing] = await connection.execute('SELECT id FROM providers WHERE ext_id = ?', [extProvider.id]);
      const existingProvider = (existing as ExistingProvider[])[0];

      const providerData = {
        ext_id: extProvider.id,
        company_name: extProvider.name,
        page_url: extProvider.page,
        is_active: extProvider.active,
        country_code: extProvider.country,
        logo_image_url: extProvider.logo_image,
        teaser_image_url: extProvider.teaser_image,
        teaser_image_2_url: extProvider.teaser_image_2,
        seo_image_1_url: extProvider.seo_image_1,
        seo_image_2_url: extProvider.seo_image_2,
        seo_image_1_alt: extProvider.seo_image_1_alt,
        seo_image_2_alt: extProvider.seo_image_2_alt,
        seo_image_1_caption: extProvider.seo_image_1_caption,
        seo_image_2_caption: extProvider.seo_image_2_caption,
        seo_image_1_author: extProvider.seo_image_1_author,
        seo_image_2_author: extProvider.seo_image_2_author,
        rating: extProvider.rating,
        rating_count: extProvider.rating_count,
        description: extProvider.description,
        fleet_size: extProvider.fleet_size,
        models_count: extProvider.models_num,
        stations_count: extProvider.stations_num,
        founded_year: extProvider.founded,
        model_years: extProvider.modelyears,
        subline: extProvider.subline,
        external_url_slug: extProvider.url,
        min_driver_age: extProvider.minage,
        deposit_amount: extProvider.deposit,
        // email and website are not directly in the CU Camper API response for providers
        // For now, we'll leave them as null or existing values if updating
      };

      if (existingProvider) {
        // Update existing provider
        const updateFields = Object.keys(providerData).map(key => `\`${key}\` = ?`).join(', ');
        const updateValues = Object.values(providerData);
        await connection.execute(`UPDATE providers SET ${updateFields} WHERE id = ?`, [...updateValues, existingProvider.id]);
        changesApplied.push(`Updated provider: ${extProvider.name} (ID: ${extProvider.id})`);
      } else {
        // Insert new provider
        const insertFields = Object.keys(providerData).map(key => `\`${key}\``).join(', ');
        const insertValues = Object.values(providerData).map(value => value === undefined ? null : value);
        const placeholders = Array(insertValues.length).fill('?').join(', ');
        await connection.execute(`INSERT INTO providers (${insertFields}) VALUES (${placeholders})`, insertValues);
        changesApplied.push(`Inserted new provider: ${extProvider.name} (ID: ${extProvider.id})`);
      }
    }

    return NextResponse.json({ message: 'CU Camper providers imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing CU Camper providers:', error);
    return NextResponse.json({ error: 'Failed to import CU Camper providers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
