import { NextResponse } from 'next/server';
import { createDbConnection, InsertResult } from '@/lib/db/utils';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { getAllProviders } from '@/lib/db/providers';
import { JucyRentalCatalogResponse, JucyProduct, ExcessReductionFeature } from '@/types/jucy'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { FieldPacket } from 'mysql2/promise';
import { Addon } from '@/types/addon';
import { Camper } from '@/types/camper';

const JUCY_RENTAL_CATALOG_API_URL = process.env.JUCY_RENTAL_CATALOG_API_URL || 'http://localhost:3000/de/api/partner/jucy/v3/rental-catalog'; // Adjust as needed

export async function POST() {
  let connection;
  try {
    const response = await fetch(JUCY_RENTAL_CATALOG_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Jucy Rental Catalog API: ${response.statusText}`);
    }
    const jucyData: JucyRentalCatalogResponse = await response.json();
    const jucyProducts = jucyData.products;

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // Fetch all providers to map brand to provider_id
    const existingProviders = await getAllProviders(connection);
    const providerMap = new Map<string, number>(); // Map: brandName -> providerId
    const providerExtIdMap = new Map<string, number>(); // Map: ext_id -> providerId
    existingProviders.forEach(p => {
      if (p.company_name) {
        providerMap.set(p.company_name.toLowerCase(), p.id);
      }
      if (p.ext_id) {
        providerExtIdMap.set(p.ext_id.toLowerCase(), p.id);
      }
    });

    // Fetch all existing addons to avoid duplicates
    const [existingAddonsRows] = await connection.execute('SELECT id, name FROM addons');
    const existingAddons = new Map<string, number>(); // Map: addonName -> addonId
    (existingAddonsRows as Addon[]).forEach(addon => {
      existingAddons.set(addon.name.toLowerCase(), addon.id);
    });

    for (const jucyProduct of jucyProducts) {
      if (jucyProduct.fleetTypeSlug === 'car') {
        changesApplied.push(`Skipping Jucy product ${jucyProduct.name} (ID: ${jucyProduct.id}) - fleetTypeSlug is 'car'.`);
        continue;
      }

      // 1. Provider Mapping
      let providerId: number | null = null;
      const brandName = jucyProduct.brand.toLowerCase();

      if (providerMap.has(brandName)) {
        providerId = providerMap.get(brandName)!;
      } else if (providerExtIdMap.has(brandName)) {
        providerId = providerExtIdMap.get(brandName)!;
      }
      else {
        // Create new provider
        const newProviderData = {
          company_name: jucyProduct.brand,
          ext_id: jucyProduct.brand, // Using brand as ext_id for Jucy providers
          is_active: true,
        };
        const insertFields = Object.keys(newProviderData).map(key => `\`${key}\``).join(', ');
        const insertValues = Object.values(newProviderData);
        const placeholders = Array(insertValues.length).fill('?').join(', ');
        const [result] = await connection.execute(`INSERT INTO providers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
        providerId = result.insertId;
        providerMap.set(brandName, providerId);
        providerExtIdMap.set(brandName, providerId);
        changesApplied.push(`Created new provider: ${jucyProduct.brand} (Internal ID: ${providerId})`);
      }

      if (!providerId) {
        changesApplied.push(`Skipping Jucy product ${jucyProduct.name} (ID: ${jucyProduct.id}) - Could not determine provider ID.`);
        continue;
      }

      // 2. Camper Mapping
      const camperData: Partial<Camper> = {
        ext_id: jucyProduct.id,
        provider_id: providerId,
        name: jucyProduct.name,
        description: jucyProduct.description,
        sleeps_adults: jucyProduct.sleepCount,
        max_adults: jucyProduct.maxOccupants,
        passengers_seats: jucyProduct.seatCount,
        transmission_automatic: jucyProduct.transmission.toLowerCase() === 'automatic',
        dimension_length_max: parseFloat(jucyProduct.length) || null,
        dimension_width_max: parseFloat(jucyProduct.width) || null,
        dimension_height_max: parseFloat(jucyProduct.weight) || null, // Assuming 'weight' is height for now, needs clarification
        // Map other fields as appropriate
        rating: null, // JucyProduct doesn't seem to have a direct rating field
        rating_count: null,
        run_of_fleet: false, // Defaulting to false, needs clarification from Jucy API if available
        active: true, // Defaulting to active
        variant: jucyProduct.fleetType,
        variant_id: jucyProduct.fleetTypeId,
        // Images - need to handle separately if we want to store them
        mood1: jucyProduct.scenicImage,
        mood2: jucyProduct.studioImage,
        mood3: jucyProduct.emailImage,
        floorplan_day: jucyProduct.floorPlans.length > 0 ? jucyProduct.floorPlans[0].url : null,
      };

      let internalCamperId: number | null = await getInternalIdByExternalIdAndPartner(connection, 'jucy', 'camper', jucyProduct.id);

      if (internalCamperId) {
        // Update existing camper
        const updateFields = Object.keys(camperData).map(key => `\`${key}\` = ?`).join(', ');
        const updateValues = Object.values(camperData).map(value => value === undefined ? null : value);
        await connection.execute(`UPDATE campers SET ${updateFields} WHERE id = ?`, [...updateValues, internalCamperId]);
        changesApplied.push(`Updated camper: ${jucyProduct.name} (External ID: ${jucyProduct.id}, Internal ID: ${internalCamperId})`);
      } else {
        // Insert new camper
        const insertFields = Object.keys(camperData).map(key => `\`${key}\``).join(', ');
        const insertValues = Object.values(camperData).map(value => value === undefined ? null : value);
        const placeholders = Array(insertValues.length).fill('?').join(', ');
        const [result] = await connection.execute(`INSERT INTO campers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
        const newCamperId = result.insertId;
        await createPartnerMapping(connection, 'jucy', 'camper', newCamperId, jucyProduct.id);
        internalCamperId = newCamperId; // Set for addon association
        changesApplied.push(`Inserted new camper: ${jucyProduct.name} (External ID: ${jucyProduct.id}, Internal ID: ${newCamperId})`);
      }

      // 3. Addon Mapping (Excess Reduction Features)
      if (internalCamperId && jucyProduct.excessReductionFeatures && jucyProduct.excessReductionFeatures.length > 0) {
        for (const feature of jucyProduct.excessReductionFeatures) {
          const addonName = feature.name;
          let addonId: number | null = null;

          if (existingAddons.has(addonName.toLowerCase())) {
            addonId = existingAddons.get(addonName.toLowerCase())!;
          } else {
            // Create new addon
            const newAddonData = {
              name: addonName,
              category: 'insurance', // Assuming excess reduction features fall under 'insurance'
              description: `Excess reduction feature: ${addonName}`,
              price_per_unit: 0, // Price might be dynamic, setting to 0 for now
              max_quantity: 1,
            };
            const insertFields = Object.keys(newAddonData).map(key => `\`${key}\``).join(', ');
            const insertValues = Object.values(newAddonData);
            const placeholders = Array(insertValues.length).fill('?').join(', ');
            const [result] = await connection.execute(`INSERT INTO addons (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
            addonId = result.insertId;
            existingAddons.set(addonName.toLowerCase(), addonId);
            changesApplied.push(`Created new addon: ${addonName} (Internal ID: ${addonId})`);
          }

          // Associate addon with camper
          if (addonId) {
            const [existingCamperAddonRows] = await connection.execute(
              'SELECT * FROM camper_addons WHERE camper_id = ? AND addon_id = ?',
              [internalCamperId, addonId]
            );
            if ((existingCamperAddonRows as any[]).length === 0) { // eslint-disable-line @typescript-eslint/no-explicit-any
              await connection.execute(
                'INSERT INTO camper_addons (camper_id, addon_id) VALUES (?, ?)',
                [internalCamperId, addonId]
              );
              changesApplied.push(`Associated addon '${addonName}' with camper '${jucyProduct.name}'`);
            }
          }
        }
      }
    }

    return NextResponse.json({ message: 'Jucy campers imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing Jucy campers:', error);
    return NextResponse.json({ error: 'Failed to import Jucy campers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
