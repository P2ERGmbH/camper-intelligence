import mysql from 'mysql2/promise';
import { Station } from '@/types/station';

export async function getStationFromDb(connection: mysql.Connection, id: string): Promise<Station | null> {
  const [rows] = await connection.execute('SELECT * FROM stations WHERE id = ?', [id]);
  const stations = rows as Station[];
  return stations.length > 0 ? stations[0] : null;
}

export async function updateStationInDb(connection: mysql.Connection, id: string, stationData: Partial<Station>): Promise<boolean> {
  const [result] = await connection.execute(
    `UPDATE stations SET 
      name = ?, address = ?, phone_number = ?, email = ?, payment_options = ?, opening_hours = ?,
      distance_motorway_km = ?, distance_airport_km = ?, distance_train_station_km = ?,
      distance_bus_stop_km = ?, parking_info = ?, shopping_info = ?, fuel_station_info = ?,
      guest_toilet = ?, lounge_area = ?, greywater_disposal_info = ?, pickup_hours = ?, return_hours = ?
    WHERE id = ?`,
    [
      stationData.name || null, stationData.address || null, stationData.phone_number || null, stationData.email || null, stationData.payment_options || null, stationData.opening_hours || null,
      stationData.distance_motorway_km || null, stationData.distance_airport_km || null, stationData.distance_train_station_km || null,
      stationData.distance_bus_stop_km || null, stationData.parking_info || null, stationData.shopping_info || null, stationData.fuel_station_info || null,
      stationData.guest_toilet || null, stationData.lounge_area || null, stationData.greywater_disposal_info || null, stationData.pickup_hours || null, stationData.return_hours || null,
      id
    ]
  );
  return (result as { affectedRows: number }).affectedRows > 0;
}
