import mysql from 'mysql2/promise';
import { InsertResult } from '@/lib/db/utils';
import { getInternalIdByExternalIdAndPartner, createPartnerMapping } from '@/lib/db/partnerMappings';
import { upsertImage, linkProviderImage, linkStationImage, linkCamperImage } from '@/lib/db/images';
import { getCuCamperImageUrl, fetchCuCamperImageMetadata } from '@/lib/utils/image';
import { createStation, updateStation } from '@/lib/db/stations';
import { Station } from '@/types/station';
import { FieldPacket } from 'mysql2/promise';

interface CuStation {
  id: string;
  rental_company_id: string;
  active: boolean; // "true" or "false"
  name: string;
  iata: string;
  country_code: string;
  country: string;
  city: string;
  administrative_area_level_2: string;
  administrative_area_level_1: string;
  postal_code: string;
  street: string;
  street_number: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  phone_number: string;
  fax_number: string;
  hotline_number: string;
  weekday_open_monday: boolean; // "true" or "false"
  weekday_open_tuesday: boolean;
  weekday_open_wednesday: boolean;
  weekday_open_thursday: boolean;
  weekday_open_friday: boolean;
  weekday_open_saturday: boolean;
  weekday_open_sunday: boolean;
  weekday_open_holiday: boolean;
  weekday_text_monday: string;
  weekday_text_tuesday: string;
  weekday_text_wednesday: string;
  weekday_text_thursday: string;
  weekday_text_friday: string;
  weekday_text_saturday: string;
  weekday_text_sunday: string;
  weekday_text_holiday: string;
  weekday_text_info: string;
  image: string;
  vehiclecount: number;
}

/* Example CuStation object:
{
    "id": "1070",
    "rental_company_id": "J4",
    "active": true,
    "name": "",
    "iata": "L1N",
    "country_code": "uk",
    "country": "Vereinigtes Königreich",
    "city": "London",
    "administrative_area_level_2": "Bedfordshire",
    "administrative_area_level_1": "England",
    "postal_code": "LU5 6HF",
    "street": "Redhill Farm, Harlington Road, Toddington",
    "street_number": "",
    "description": "Entfernung zum Flughafen Luton: 11 Meilen\r\nEntfernung zum Flughafen Heathrow: 42 Meilen\r\nEntfernung zum Flughafen Gatwick: 77 Meilen\r\nEntfernung zum Flughafen Stansted: 45 Meilen\r\n\r\nDer Vermieter bietet gegen Gebühr an der Vermietstation gesicherte Parkplätze für Ihren privaten PKW während der Wohnmobilmiete an",
    "lat": 51.9638,
    "lng": -0.5134,
    "phone_number": "0044 1525878000",
    "fax_number": "",
    "hotline_number": "0044 1525878000",
    "weekday_open_monday": true,
    "weekday_open_tuesday": true,
    "weekday_open_wednesday": true,
    "weekday_open_thursday": true,
    "weekday_open_friday": true,
    "weekday_open_saturday": true,
    "weekday_open_sunday": false,
    "weekday_open_holiday": false,
    "weekday_text_monday": "08:00 - 17:00 Uhr",
    "weekday_text_tuesday": "08:00 - 17:00 Uhr",
    "weekday_text_wednesday": "08:00 - 17:00 Uhr",
    "weekday_text_thursday": "08:00 - 17:00 Uhr",
    "weekday_text_friday": "08:00 - 17:00 Uhr",
    "weekday_text_saturday": "08:00 - 17:00 Uhr",
    "weekday_text_sunday": "geschlossen",
    "weekday_text_holiday": "geschlossen",
    "weekday_text_info": "",
    "image": "cu\/camper\/europa\/just-go\/justgo-logo-red-and-blue-RGB.cr2645x1763-463x330",
    "vehiclecount": 5
}
*/

interface CuCamper {
  id: string;
  rental_company_id: string;
  active: boolean;
  name: string;
  typsort: number;
  variant_id: string;
  variant: string;
  rating: number;
  rating_count: number;
  run_of_fleet: boolean;
  description: string;
  sleeps_adults: number;
  sleeps_children: number;
  max_adults: number;
  max_children: number;
  passengers_seats: number;
  passengers_seats_isofix: number;
  passengers_seats_child_seats: number;
  ideal_adults: number;
  ideal_children: number;
  dimension_length_min: number;
  dimension_length_max: number;
  dimension_height_min: number;
  dimension_height_max: number;
  dimension_width_min: number;
  dimension_width_max: number;
  driverslicense_de_overweight_required: boolean;
  transmission_automatic: boolean;
  awning: boolean;
  air_condition_driving_cabin: boolean;
  air_condition_living_area: boolean;
  air_condition_sleeping_area: boolean;
  cruise_control: boolean;
  passage_drivers_cabin: boolean;
  slideout: number;
  shower_wc: number;
  running_water: number;
  tank_freshwater: number;
  tank_wastewater1: number;
  tank_wastewater2: number;
  washbasin: boolean;
  shower_outdoor: boolean;
  tv: boolean;
  dvd: boolean;
  radio: number;
  power12v: boolean;
  sink: boolean;
  fridge: boolean;
  generator: boolean;
  radiator: boolean;
  navigation: boolean;
  four_wd: boolean;
  consumption: number;
  tank_fuel_min: number;
  tank_fuel_max: number;
  rear_cam: boolean;
  jacks: boolean;
  freezer: boolean;
  cool_box: boolean;
  gas_stove: boolean;
  microwave: boolean;
  microwave_oven: boolean;
  oven: boolean;
  size_bed_rear_length: number;
  size_bed_rear_width: number;
  size_bed_sofa_length: number;
  size_bed_sofa_width: number;
  size_bed_dinette_length: number;
  size_bed_dinette_width: number;
  size_bed_dinette_alt: number;
  size_bed_alcoven_length: number;
  size_bed_alcoven_width: number;
  size_bed_bunk_length: number;
  size_bed_bunk_width: number;
  size_bed_bunk_num: number;
  size_bed_roofbox_length: number;
  size_bed_roofbox_width: number;
  size_bed_tent_length: number;
  size_bed_tent_width: number;
  size_bed_alcoven_childonly: number;
  mood1: string;
  mood1_description: string;
  mood2: string;
  mood2_description: string;
  mood3: string;
  mood3_description: string;
  mood4: string;
  mood4_description: string;
  mood5: string;
  mood5_description: string;
  misc1: string;
  misc1_description: string;
  misc2: string;
  misc2_description: string;
  exterior1: string;
  exterior1_description: string;
  exterior2: string;
  exterior2_description: string;
  exterior3: string;
  exterior3_description: string;
  exterior4: string;
  exterior4_description: string;
  exterior5: string;
  exterior5_description: string;
  interior1: string;
  interior1_description: string;
  interior2: string;
  interior2_description: string;
  interior3: string;
  interior3_description: string;
  interior4: string;
  interior4_description: string;
  interior5: string;
  interior5_description: string;
  floorplan_day: string;
  floorplan_day_description: string;
  floorplan_night: string;
  floorplan_night_description: string;
  floorplan_misc1: string;
  floorplan_misc1_description: string;
  floorplan_misc2: string;
  floorplan_misc2_description: string;
  provider_id: number;
  station_id: number;
}

interface CuProvider {
  id: string;
  name: string;
  page: string;
  active: boolean;
  country: string;
  logo_image: string;
  teaser_image: string;
  teaser_image_2: string;
  seo_image_1: string;
  seo_image_2: string;
  seo_image_1_alt: string;
  seo_image_2_alt: string;
  seo_image_1_caption: string;
  seo_image_2_caption: string;
  seo_image_1_author: string;
  seo_image_2_author: string;
  rating: number;
  rating_count: number;
  description: string;
  fleet_size: string;
  models_num: number;
  stations_num: number;
  founded: number;
  modelyears: string;
  subline: string;
  url: string;
  minage: number;
  deposit: number;
}

export async function processCuCamperProvider(
  connection: mysql.Connection,
  extProvider: CuProvider,
  userId: number,
  origin: string,
  changesApplied: string[]
): Promise<number | null> {
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
  };

  let internalId = await getInternalIdByExternalIdAndPartner(connection, 'cu-camper', 'provider', extProvider.id);

  if (internalId) {
    const updateFields = Object.keys(providerData).map(key => `\`${key}\` = ?`).join(', ');
    const updateValues = Object.values(providerData);
    await connection.execute(`UPDATE providers SET ${updateFields} WHERE id = ?`, [...updateValues, internalId]);
    changesApplied.push(`Updated provider: ${extProvider.name} (ID: ${extProvider.id}, Internal ID: ${internalId})`);
  } else {
    const insertFields = Object.keys(providerData).map(key => `\`${key}\``).join(', ');
    const insertValues = Object.values(providerData).map(value => value === undefined ? null : value);
    const placeholders = Array(insertValues.length).fill('?').join(', ');
    const [result] = await connection.execute(`INSERT INTO providers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
    const newProviderId = result.insertId;
    await createPartnerMapping(connection, 'cu-camper', 'provider', newProviderId, extProvider.id);
    changesApplied.push(`Inserted new provider: ${extProvider.name} (ID: ${extProvider.id}, Internal ID: ${newProviderId})`);
    internalId = newProviderId;
  }

  // Image processing
  if (internalId) {
    const imageFields = [
      { field: 'logo_image', category: 'logo' },
      { field: 'teaser_image', category: 'teaser' },
      { field: 'teaser_image_2', category: 'teaser' },
      { field: 'seo_image_1', category: 'seo' },
      { field: 'seo_image_2', category: 'seo' },
    ];

    for (const { field, category } of imageFields) {
      const relativePath = extProvider[field as keyof CuProvider];
      if (typeof relativePath === 'string' && (relativePath.startsWith('cu/camper/') || relativePath.startsWith('allgemein/'))) {
        const imageUrl = getCuCamperImageUrl(relativePath);
        const { caption, alt_text, copyright_holder_name, width, height } = await fetchCuCamperImageMetadata(imageUrl);
        try {
          const imageId = await upsertImage(connection, imageUrl, userId, origin, caption, alt_text, copyright_holder_name, width, height);
          await linkProviderImage(connection, internalId, imageId, category);
          changesApplied.push(`Processed image for provider ${extProvider.name}: ${imageUrl} (Category: ${category}, Caption: ${caption || 'N/A'})`);
        } catch (imageError) {
          console.error(`Failed to process image ${imageUrl} for provider ${extProvider.name}:`, imageError);
          changesApplied.push(`Failed to process image ${imageUrl} for provider ${extProvider.name}: ${(imageError as Error).message}`);
        }
      }
    }
  }
  return internalId;
}

export async function processCuCamperStation(
  connection: mysql.Connection,
  cuStation: CuStation,
  providerMap: Map<string, number>,
  userId: number,
  origin: string,
  changesApplied: string[]
): Promise<number | null> {
  console.log(`Processing station: ${cuStation.name} (ID: ${cuStation.id})`);
  console.log(`Original active status from API: ${cuStation.active}`);

  const providerId = providerMap.get(cuStation.rental_company_id);

  if (providerId === undefined) {
    changesApplied.push(`Skipping station ${cuStation.id} - Provider with rental_company_id ${cuStation.rental_company_id} not found.`);
    return null;
  }

  let internalId = await getInternalIdByExternalIdAndPartner(connection, 'cu-camper', 'station', cuStation.id);

  const stationData: Omit<Station, 'id' | 'created_at' | 'updated_at'> = {
    ext_id: cuStation.id,
    provider_id: providerId,
    rental_company_id: cuStation.rental_company_id,
    active: cuStation.active, // Directly use the boolean value
    name: cuStation.name || cuStation.id,
    iata: cuStation.iata || null,
    country_code: cuStation.country_code || null,
    country: cuStation.country || null,
    city: cuStation.city || null,
    administrative_area_level_2: cuStation.administrative_area_level_2 || null,
    administrative_area_level_1: cuStation.administrative_area_level_1 || null,
    postal_code: cuStation.postal_code || null,
    street: cuStation.street || null,
    street_number: cuStation.street_number || null,
    description: cuStation.description || null,
    lat: cuStation.lat || null,
    lng: cuStation.lng || null,
    phone_number: cuStation.phone_number || null,
    fax_number: cuStation.fax_number || null,
    hotline_number: cuStation.hotline_number || null,
    weekday_open_monday: cuStation.weekday_open_monday,
    weekday_open_tuesday: cuStation.weekday_open_tuesday,
    weekday_open_wednesday: cuStation.weekday_open_wednesday,
    weekday_open_thursday: cuStation.weekday_open_thursday,
    weekday_open_friday: cuStation.weekday_open_friday,
    weekday_open_saturday: cuStation.weekday_open_saturday,
    weekday_open_sunday: cuStation.weekday_open_sunday,
    weekday_open_holiday: cuStation.weekday_open_holiday,
    weekday_text_monday: cuStation.weekday_text_monday || null,
    weekday_text_tuesday: cuStation.weekday_text_tuesday || null,
    weekday_text_wednesday: cuStation.weekday_text_wednesday || null,
    weekday_text_thursday: cuStation.weekday_text_thursday || null,
    weekday_text_friday: cuStation.weekday_text_friday || null,
    weekday_text_saturday: cuStation.weekday_text_saturday || null,
    weekday_text_sunday: cuStation.weekday_text_sunday || null,
    weekday_text_holiday: cuStation.weekday_text_holiday || null,
    weekday_text_info: cuStation.weekday_text_info || null,
    image: cuStation.image || null,
    vehiclecount: cuStation.vehiclecount || null,
  };

  console.log(`Processed stationData active status: ${stationData.active}`);

  if (internalId) {
    await updateStation(connection, internalId, stationData);
    changesApplied.push(`Updated station: ${cuStation.name || cuStation.id} (ID: ${cuStation.id}, Internal ID: ${internalId})`);
  } else {
    const newStationId = await createStation(connection, stationData);
    await createPartnerMapping(connection, 'cu-camper', 'station', newStationId, cuStation.id);
    changesApplied.push(`Created station: ${cuStation.name || cuStation.id} (ID: ${cuStation.id}, Internal ID: ${newStationId})`);
    internalId = newStationId;
  }

  // Process and link image after station creation/update
  if (internalId && typeof cuStation.image === 'string' && (cuStation.image.startsWith('cu/camper/') || cuStation.image.startsWith('allgemein/'))) {
    const processedImageUrl = getCuCamperImageUrl(cuStation.image);
    try {
      const { caption, alt_text, copyright_holder_name, width, height } = await fetchCuCamperImageMetadata(processedImageUrl);
      const imageId = await upsertImage(connection, processedImageUrl, userId, origin, caption, alt_text, copyright_holder_name, width, height);
      console.log(`Calling linkStationImage with: stationId=${internalId}, imageId=${imageId}, imageCategory='main'`);
      await linkStationImage(connection, internalId, imageId, 'main');
      changesApplied.push(`Processed image for station ${cuStation.name || cuStation.id}: ${processedImageUrl} (Category: main, Caption: ${caption || 'N/A'})`);
      await updateStation(connection, internalId, { ...stationData, image: processedImageUrl });
    } catch (imageError) {
      console.error(`Failed to process image ${processedImageUrl} for station ${cuStation.name || cuStation.id}:`, imageError);
      changesApplied.push(`Failed to process image ${processedImageUrl} for station ${cuStation.name || cuStation.id}: ${(imageError as Error).message}`);
      await updateStation(connection, internalId, { ...stationData, image: null });
    }
  }
  return internalId;
}

export async function processCuCamperCamper(
  connection: mysql.Connection,
  extCamper: CuCamper,
  providerMap: Map<string, number>,
  userId: number,
  origin: string,
  changesApplied: string[]
): Promise<number | null> {
  if (!extCamper.id) {
    console.log('Skipping camper with empty ID:', extCamper);
    changesApplied.push('Skipped camper with empty ID.');
    return null;
  }

  const providerId = providerMap.get(extCamper.rental_company_id);
  if (!providerId) {
    console.warn(`Skipping camper ${extCamper.id}: No matching provider found for rental_company_id ${extCamper.rental_company_id}`);
    changesApplied.push(`Skipped camper ${extCamper.id}: No matching provider found.`);
    return null;
  }

  const camperData = {
    ext_id: extCamper.id,
    rental_company_id: extCamper.rental_company_id,
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
    station_id: extCamper.station_id, // Assuming station_id is available in CuCamper
  };

  let internalId = await getInternalIdByExternalIdAndPartner(connection, 'cu-camper', 'camper', extCamper.id);

  if (internalId) {
    const updateFields = Object.keys(camperData).map(key => `\`${key}\` = ?`).join(', ');
    const updateValues = Object.values(camperData).map(value => value === undefined ? null : value);
    await connection.execute(`UPDATE campers SET ${updateFields} WHERE id = ?`, [...updateValues, internalId]);
    changesApplied.push(`Updated camper: ${extCamper.name} (ID: ${extCamper.id}, Internal ID: ${internalId})`);
  } else {
    const insertFields = Object.keys(camperData).map(key => `\`${key}\``).join(', ');
    const insertValues = Object.values(camperData).map(value => value === undefined ? null : value);
    const placeholders = Array(insertValues.length).fill('?').join(', ');
    const [result] = await connection.execute(`INSERT INTO campers (${insertFields}) VALUES (${placeholders})`, insertValues) as [InsertResult, FieldPacket[]];
    const newCamperId = result.insertId;
    await createPartnerMapping(connection, 'cu-camper', 'camper', newCamperId, extCamper.id);
    changesApplied.push(`Inserted new camper: ${extCamper.name} (ID: ${extCamper.id}, Internal ID: ${newCamperId})`);
    internalId = newCamperId;
  }

  // Image processing
  if (internalId) {
    const imageFields = [
      { field: 'mood1', category: 'mood' },
      { field: 'mood2', category: 'mood' },
      { field: 'mood3', category: 'mood' },
      { field: 'mood4', category: 'mood' },
      { field: 'mood5', category: 'mood' },
      { field: 'misc1', category: 'misc' },
      { field: 'misc2', category: 'misc' },
      { field: 'exterior1', category: 'exterior' },
      { field: 'exterior2', category: 'exterior' },
      { field: 'exterior3', category: 'exterior' },
      { field: 'exterior4', category: 'exterior' },
      { field: 'exterior5', category: 'exterior' },
      { field: 'interior1', category: 'interior' },
      { field: 'interior2', category: 'interior' },
      { field: 'interior3', category: 'interior' },
      { field: 'interior4', category: 'interior' },
      { field: 'interior5', category: 'interior' },
      { field: 'floorplan_day', category: 'floorplan' },
      { field: 'floorplan_night', category: 'floorplan' },
      { field: 'floorplan_misc1', category: 'floorplan' },
      { field: 'floorplan_misc2', category: 'floorplan' },
    ];

    for (const { field, category } of imageFields) {
      const relativePath = extCamper[field as keyof CuCamper];
      console.log(`Processing image field: ${field}, relativePath: ${relativePath}`);
      if (typeof relativePath === 'string' && (relativePath.startsWith('cu/camper/') || relativePath.startsWith('allgemein/'))) {
        console.log(`Image path ${relativePath} matches criteria. Proceeding with image processing.`);
        const imageUrl = getCuCamperImageUrl(relativePath);
        const { caption, alt_text, copyright_holder_name, width, height } = await fetchCuCamperImageMetadata(imageUrl);
        try {
          const imageId = await upsertImage(connection, imageUrl, userId, origin, caption, alt_text, copyright_holder_name, width, height);
          await linkCamperImage(connection, internalId, imageId, category);
          changesApplied.push(`Processed image for camper ${extCamper.name}: ${imageUrl} (Category: ${category}, Caption: ${caption || 'N/A'})`);
        } catch (imageError) {
          console.error(`Failed to process image ${imageUrl} for camper ${extCamper.name}:`, imageError);
          changesApplied.push(`Failed to process image ${imageUrl} for camper ${extCamper.name}: ${(imageError as Error).message}`);
        }
      } else {
        console.log(`Image path ${relativePath} does not match criteria (string and starts with 'cu/camper/' or 'allgemein/'). Skipping.`);
      }
    }
  }
  return internalId;
}