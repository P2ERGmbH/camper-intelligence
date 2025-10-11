export interface Station {
  id: number;
  provider_id: number;
  name: string;
  address: string;
  phone_number?: string | null;
  email?: string | null;
  payment_options?: string | null;
  opening_hours?: string | null;
  distance_motorway_km?: number | null;
  distance_airport_km?: number | null;
  distance_train_station_km?: number | null;
  distance_bus_stop_km?: number | null;
  parking_info?: string | null;
  shopping_info?: string | null;
  fuel_station_info?: string | null;
  guest_toilet?: boolean | null;
  lounge_area?: boolean | null;
  greywater_disposal_info?: string | null;
  pickup_hours?: string | null;
  return_hours?: string | null;
  created_at: string;
  updated_at: string;
}
