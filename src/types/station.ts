export interface Station {
  id: number;
  ext_id?: string | null; // External ID from CU Camper API
  provider_id: number;
  rental_company_id?: string | null; // External ID from CU Camper API for the rental company
  active?: boolean | null;
  name?: string | null;
  iata?: string | null;
  country_code?: string | null;
  country?: string | null;
  city?: string | null;
  administrative_area_level_2?: string | null;
  administrative_area_level_1?: string | null;
  postal_code?: string | null;
  street?: string | null;
  street_number?: string | null;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  phone_number?: string | null;
  fax_number?: string | null;
  hotline_number?: string | null;
  weekday_open_monday?: boolean | null;
  weekday_open_tuesday?: boolean | null;
  weekday_open_wednesday?: boolean | null;
  weekday_open_thursday?: boolean | null;
  weekday_open_friday?: boolean | null;
  weekday_open_saturday?: boolean | null;
  weekday_open_sunday?: boolean | null;
  weekday_open_holiday?: boolean | null;
  weekday_text_monday?: string | null;
  weekday_text_tuesday?: string | null;
  weekday_text_wednesday?: string | null;
  weekday_text_thursday?: string | null;
  weekday_text_friday?: string | null;
  weekday_text_saturday?: string | null;
  weekday_text_sunday?: string | null;
  weekday_text_holiday?: string | null;
  weekday_text_info?: string | null;
  image?: string | null;
  vehiclecount?: number | null;
  created_at: string;
  updated_at: string;
}