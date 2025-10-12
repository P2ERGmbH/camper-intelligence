import mysql from 'mysql2/promise';
import { Station } from '@/types/station';

export async function getStationByExtId(connection: mysql.Connection, extId: string): Promise<Station | null> {
  const [rows] = await connection.execute('SELECT * FROM stations WHERE ext_id = ?', [extId]);
  const stations = rows as Station[];
  return stations.length > 0 ? stations[0] : null;
}

export async function createStation(connection: mysql.Connection, station: Omit<Station, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const [result] = await connection.execute(
    `INSERT INTO stations (
      ext_id, provider_id, rental_company_id, active, name, iata, country_code, country, city,
      administrative_area_level_2, administrative_area_level_1, postal_code, street, street_number,
      description, lat, lng, phone_number, fax_number, hotline_number, weekday_open_monday,
      weekday_open_tuesday, weekday_open_wednesday, weekday_open_thursday, weekday_open_friday,
      weekday_open_saturday, weekday_open_sunday, weekday_open_holiday, weekday_text_monday,
      weekday_text_tuesday, weekday_text_wednesday, weekday_text_thursday, weekday_text_friday,
      weekday_text_saturday, weekday_text_sunday, weekday_text_holiday, weekday_text_info, image, vehiclecount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      station.ext_id, station.provider_id, station.rental_company_id, station.active, station.name, station.iata, station.country_code, station.country, station.city,
      station.administrative_area_level_2, station.administrative_area_level_1, station.postal_code, station.street, station.street_number,
      station.description, station.lat, station.lng, station.phone_number, station.fax_number, station.hotline_number, station.weekday_open_monday,
      station.weekday_open_tuesday, station.weekday_open_wednesday, station.weekday_open_thursday, station.weekday_open_friday,
      station.weekday_open_saturday, station.weekday_open_sunday, station.weekday_open_holiday, station.weekday_text_monday,
      station.weekday_text_tuesday, station.weekday_text_wednesday, station.weekday_text_thursday, station.weekday_text_friday,
      station.weekday_text_saturday, station.weekday_text_sunday, station.weekday_text_holiday, station.weekday_text_info, station.image, station.vehiclecount
    ]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function updateStation(connection: mysql.Connection, id: number, station: Omit<Station, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  await connection.execute(
    `UPDATE stations SET
      ext_id = ?, provider_id = ?, rental_company_id = ?, active = ?, name = ?, iata = ?, country_code = ?, country = ?, city = ?,
      administrative_area_level_2 = ?, administrative_area_level_1 = ?, postal_code = ?, street = ?, street_number = ?,
      description = ?, lat = ?, lng = ?, phone_number = ?, fax_number = ?, hotline_number = ?, weekday_open_monday = ?,
      weekday_open_tuesday = ?, weekday_open_wednesday = ?, weekday_open_thursday = ?, weekday_open_friday = ?,
      weekday_open_saturday = ?, weekday_open_sunday = ?, weekday_open_holiday = ?, weekday_text_monday = ?,
      weekday_text_tuesday = ?, weekday_text_wednesday = ?, weekday_text_thursday = ?, weekday_text_friday = ?,
      weekday_text_saturday = ?, weekday_text_sunday = ?, weekday_text_holiday = ?, weekday_text_info = ?, image = ?, vehiclecount = ?
    WHERE id = ?`,
    [
      station.ext_id, station.provider_id, station.rental_company_id, station.active, station.name, station.iata, station.country_code, station.country, station.city,
      station.administrative_area_level_2, station.administrative_area_level_1, station.postal_code, station.street, station.street_number,
      station.description, station.lat, station.lng, station.phone_number, station.fax_number, station.hotline_number, station.weekday_open_monday,
      station.weekday_open_tuesday, station.weekday_open_wednesday, station.weekday_open_thursday, station.weekday_open_friday,
      station.weekday_open_saturday, station.weekday_open_sunday, station.weekday_open_holiday, station.weekday_text_monday,
      station.weekday_text_tuesday, station.weekday_text_wednesday, station.weekday_text_thursday, station.weekday_text_friday,
      station.weekday_text_saturday, station.weekday_text_sunday, station.weekday_text_holiday, station.weekday_text_info, station.image, station.vehiclecount,
      id
    ]
  );
}

export async function getAllStations(connection: mysql.Connection): Promise<Station[]> {
  const [rows] = await connection.execute('SELECT * FROM stations');
  return rows as Station[];
}

export async function getStationById(connection: mysql.Connection, id: number): Promise<Station | null> {
  const [rows] = await connection.execute('SELECT * FROM stations WHERE id = ?', [id]);
  const stations = rows as Station[];
  return stations.length > 0 ? stations[0] : null;
}

export async function getStationsByProviderId(connection: mysql.Connection, providerId: number): Promise<Station[]> {
  const [rows] = await connection.execute('SELECT id, name, address FROM stations WHERE provider_id = ?', [providerId]);
  return rows as Station[];
}