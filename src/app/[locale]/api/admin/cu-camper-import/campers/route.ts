import { NextResponse } from 'next/server';
import { createDbConnection, InsertResult } from '@/lib/db/utils';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { FieldPacket } from 'mysql2/promise';

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

const CU_CAMPER_API_URL = `${CU_CAMPER_BASE_URL}?run=VehiclesApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;

interface ProviderMapping {
  id: number;
  ext_id: string;
}

export async function POST() {
  let connection;
  try {
    const response = await fetch(CU_CAMPER_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from CU Camper API: ${response.statusText}`);
    }
    const externalCampers = await response.json();

    connection = await createDbConnection();
    const changesApplied: string[] = [];

    // Fetch all providers to map rental_company_id to provider_id
    const [providerRows] = await connection.execute('SELECT id, ext_id FROM providers');
    const providerMap = new Map<string, number>();
    (providerRows as ProviderMapping[]).forEach(p => {
      if (p.ext_id) {
        providerMap.set(p.ext_id, p.id);
      }
    });

    for (const extCamper of externalCampers) {
      if (!extCamper.id) {
        console.log('Skipping camper with empty ID:', extCamper);
        continue;
      }

      const providerId = providerMap.get(extCamper.rental_company_id);
      if (!providerId) {
        console.warn(`Skipping camper ${extCamper.id}: No matching provider found for rental_company_id ${extCamper.rental_company_id}`);
        continue;
      }

      const camperData = {
        ext_id: extCamper.id,
        rental_company_id: extCamper.rental_company_id, // Keep for reference, but provider_id is the FK
        active: extCamper.active,
        name: extCamper.name,
        typsort: extCamper.typsort,
        variant_id: extCamper.variant_id,
        variant: extCamper.variant,
        rating: extCamper.rating,
        rating_count: extCamper.rating_count,
        run_of_fleet: extCamper.run_of_fleet,
        description: extCamper.description,
        sleeps_adults: extCamper.sleeps_adults,
        sleeps_children: extCamper.sleeps_children,
        max_adults: extCamper.max_adults,
        max_children: extCamper.max_children,
        passengers_seats: extCamper.passengers_seats,
        passengers_seats_isofix: extCamper.passengers_seats_isofix,
        passengers_seats_child_seats: extCamper.passengers_seats_child_seats,
        ideal_adults: extCamper.ideal_adults,
        ideal_children: extCamper.ideal_children,
        dimension_length_min: extCamper.dimension_length_min,
        dimension_length_max: extCamper.dimension_length_max,
        dimension_height_min: extCamper.dimension_height_min,
        dimension_height_max: extCamper.dimension_height_max,
        dimension_width_min: extCamper.dimension_width_min,
        dimension_width_max: extCamper.dimension_width_max,
        driverslicense_de_overweight_required: extCamper.driverslicense_de_overweight_required,
        transmission_automatic: extCamper.transmission_automatic,
        awning: extCamper.awning,
        air_condition_driving_cabin: extCamper.air_condition_driving_cabin,
        air_condition_living_area: extCamper.air_condition_living_area,
        air_condition_sleeping_area: extCamper.air_condition_sleeping_area,
        cruise_control: extCamper.cruise_control,
        passage_drivers_cabin: extCamper.passage_drivers_cabin,
        slideout: extCamper.slideout,
        shower_wc: extCamper.shower_wc,
        running_water: extCamper.running_water,
        tank_freshwater: extCamper.tank_freshwater,
        tank_wastewater1: extCamper.tank_wastewater1,
        tank_wastewater2: extCamper.tank_wastewater2,
        washbasin: extCamper.washbasin,
        shower_outdoor: extCamper.shower_outdoor,
        tv: extCamper.tv,
        dvd: extCamper.dvd,
        radio: extCamper.radio,
        power12v: extCamper.power12v,
        sink: extCamper.sink,
        fridge: extCamper.fridge,
        generator: extCamper.generator,
        radiator: extCamper.radiator,
        navigation: extCamper.navigation,
        four_wd: extCamper.four_wd,
        consumption: extCamper.consumption,
        tank_fuel_min: extCamper.tank_fuel_min,
        tank_fuel_max: extCamper.tank_fuel_max,
        rear_cam: extCamper.rear_cam,
        jacks: extCamper.jacks,
        freezer: extCamper.freezer,
        cool_box: extCamper.cool_box,
        gas_stove: extCamper.gas_stove,
        microwave: extCamper.microwave,
        microwave_oven: extCamper.microwave_oven,
        oven: extCamper.oven,
        size_bed_rear_length: extCamper.size_bed_rear_length,
        size_bed_rear_width: extCamper.size_bed_rear_width,
        size_bed_sofa_length: extCamper.size_bed_sofa_length,
        size_bed_sofa_width: extCamper.size_bed_sofa_width,
        size_bed_dinette_length: extCamper.size_bed_dinette_length,
        size_bed_dinette_width: extCamper.size_bed_dinette_width,
        size_bed_dinette_alt: extCamper.size_bed_dinette_alt,
        size_bed_alcoven_length: extCamper.size_bed_alcoven_length,
        size_bed_alcoven_width: extCamper.size_bed_alcoven_width,
        size_bed_bunk_length: extCamper.size_bed_bunk_length,
        size_bed_bunk_width: extCamper.size_bed_bunk_width,
        size_bed_bunk_num: extCamper.size_bed_bunk_num,
        size_bed_roofbox_length: extCamper.size_bed_roofbox_length,
        size_bed_roofbox_width: extCamper.size_bed_roofbox_width,
        size_bed_tent_length: extCamper.size_bed_tent_length,
        size_bed_tent_width: extCamper.size_bed_tent_width,
        size_bed_alcoven_childonly: extCamper.size_bed_alcoven_childonly,
        mood1: extCamper.mood1,
        mood1_description: extCamper.mood1_description,
        mood2: extCamper.mood2,
        mood2_description: extCamper.mood2_description,
        mood3: extCamper.mood3,
        mood3_description: extCamper.mood3_description,
        mood4: extCamper.mood4,
        mood4_description: extCamper.mood4_description,
        mood5: extCamper.mood5,
        mood5_description: extCamper.mood5_description,
        misc1: extCamper.misc1,
        misc1_description: extCamper.misc1_description,
        misc2: extCamper.misc2,
        misc2_description: extCamper.misc2_description,
        exterior1: extCamper.exterior1,
        exterior1_description: extCamper.exterior1_description,
        exterior2: extCamper.exterior2,
        exterior2_description: extCamper.exterior2_description,
        exterior3: extCamper.exterior3,
        exterior3_description: extCamper.exterior3_description,
        exterior4: extCamper.exterior4,
        exterior4_description: extCamper.exterior4_description,
        exterior5: extCamper.exterior5,
        exterior5_description: extCamper.exterior5_description,
        interior1: extCamper.interior1,
        interior1_description: extCamper.interior1_description,
        interior2: extCamper.interior2,
        interior2_description: extCamper.interior2_description,
        interior3: extCamper.interior3,
        interior3_description: extCamper.interior3_description,
        interior4: extCamper.interior4,
        interior4_description: extCamper.interior4_description,
        interior5: extCamper.interior5,
        interior5_description: extCamper.interior5_description,
        floorplan_day: extCamper.floorplan_day,
        floorplan_day_description: extCamper.floorplan_day_description,
        floorplan_night: extCamper.floorplan_night,
        floorplan_night_description: extCamper.floorplan_night_description,
        floorplan_misc1: extCamper.floorplan_misc1,
        floorplan_misc1_description: extCamper.floorplan_misc1_description,
        floorplan_misc2: extCamper.floorplan_misc2,
        floorplan_misc2_description: extCamper.floorplan_misc2_description,
        provider_id: providerId,
        // station_id is not directly in the CU Camper API response for vehicles
      };

      const internalId = await getInternalIdByExternalIdAndPartner(connection, 'cu-camper', 'camper', extCamper.id);

      if (internalId) {
        // Update existing camper
        const updateFields = Object.keys(camperData).map(key => `\`${key}\` = ?`).join(', ');
        const updateValues = Object.values(camperData);
        await connection.execute(`UPDATE campers SET ${updateFields} WHERE id = ?`, [...updateValues, internalId]);
        changesApplied.push(`Updated camper: ${extCamper.name} (ID: ${extCamper.id}, Internal ID: ${internalId})`);
      } else {
        // Insert new camper
        const insertFields = Object.keys(camperData).map(key => `\`${key}\``).join(', ');
        const insertValues = Object.values(camperData).map(value => value === undefined ? null : value);
        const placeholders = Array(insertValues.length).fill('?').join(', ');
        const [result] = await connection.execute(`INSERT INTO campers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
        const newCamperId = result.insertId;
        await createPartnerMapping(connection, 'cu-camper', 'camper', newCamperId, extCamper.id);
        changesApplied.push(`Inserted new camper: ${extCamper.name} (ID: ${extCamper.id}, Internal ID: ${newCamperId})`);
      }
    }

    return NextResponse.json({ message: 'CU Camper campers imported successfully.', changes: changesApplied });
  } catch (error) {
    console.error('Error importing CU Camper campers:', error);
    return NextResponse.json({ error: 'Failed to import CU Camper campers.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
