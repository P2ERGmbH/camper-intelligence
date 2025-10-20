ALTER TABLE stations
ADD COLUMN fuel_station_info_available BOOLEAN,
ADD COLUMN parking_info_available BOOLEAN,
ADD COLUMN shopping_info_available BOOLEAN,
ADD COLUMN lounge_area_info TEXT,
ADD COLUMN guest_toilet_info TEXT,
ADD COLUMN image_category TEXT,
ADD COLUMN image_author TEXT,
ADD COLUMN image_copyright TEXT,
ADD COLUMN image_alt_text TEXT,
ADD COLUMN image_description TEXT,
ADD COLUMN address_description TEXT,
ADD COLUMN directions_description TEXT;