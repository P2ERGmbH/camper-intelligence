-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'provider', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the partner_mappings table
CREATE TABLE IF NOT EXISTS partner_mappings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_name VARCHAR(255) NOT NULL, -- e.g., 'cu-camper', 'jucy'
    entity_type ENUM('camper', 'provider', 'station') NOT NULL,
    internal_id INT NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (partner_name, entity_type, external_id)
);

-- Create the providers table to hold provider-specific information
CREATE TABLE IF NOT EXISTS providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ext_id VARCHAR(255) UNIQUE, -- External ID from CU Camper API
    company_name VARCHAR(255),
    address TEXT,
    email VARCHAR(255),
    page_url VARCHAR(2048),
    is_active BOOLEAN,
    country_code VARCHAR(10),
    logo_image_url VARCHAR(2048),
    teaser_image_url VARCHAR(2048),
    teaser_image_2_url VARCHAR(2048),
    seo_image_1_url VARCHAR(2048),
    seo_image_2_url VARCHAR(2048),
    seo_image_1_alt VARCHAR(255),
    seo_image_2_alt VARCHAR(255),
    seo_image_1_caption TEXT,
    seo_image_2_caption TEXT,
    seo_image_1_author VARCHAR(255),
    seo_image_2_author VARCHAR(255),
    rating DECIMAL(10, 2),
    rating_count INT,
    description TEXT,
    fleet_size VARCHAR(255),
    models_count INT,
    stations_count INT,
    founded_year INT,
    model_years VARCHAR(255),
    subline VARCHAR(255),
    external_url_slug VARCHAR(255),
    min_driver_age INT,
    deposit_amount DECIMAL(10, 2),
    tax_id VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create a linking table for the many-to-many relationship between users and providers
CREATE TABLE IF NOT EXISTS provider_users (
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    role ENUM('admin', 'owner', 'viewer', 'editor') NOT NULL DEFAULT 'viewer',
    PRIMARY KEY (user_id, provider_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Create the stations table for pickup locations
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ext_id VARCHAR(255) UNIQUE, -- External ID from CU Camper API
    provider_id INT NOT NULL,
    rental_company_id VARCHAR(255), -- External ID from CU Camper API for the rental company
    active BOOLEAN,
    name VARCHAR(255) NOT NULL,
    iata VARCHAR(10),
    country_code VARCHAR(10),
    country VARCHAR(255),
    city VARCHAR(255),
    administrative_area_level_2 VARCHAR(255),
    administrative_area_level_1 VARCHAR(255),
    postal_code VARCHAR(20),
    street VARCHAR(255),
    street_number VARCHAR(50),
    address TEXT,
    description TEXT,
    lat DECIMAL(10, 6),
    lng DECIMAL(10, 6),
    phone_number VARCHAR(50),
    fax_number VARCHAR(50),
    hotline_number VARCHAR(50),
    weekday_open_monday BOOLEAN,
    weekday_open_tuesday BOOLEAN,
    weekday_open_wednesday BOOLEAN,
    weekday_open_thursday BOOLEAN,
    weekday_open_friday BOOLEAN,
    weekday_open_saturday BOOLEAN,
    weekday_open_sunday BOOLEAN,
    weekday_open_holiday BOOLEAN,
    weekday_text_monday VARCHAR(255),
    weekday_text_tuesday VARCHAR(255),
    weekday_text_wednesday VARCHAR(255),
    weekday_text_thursday VARCHAR(255),
    weekday_text_friday VARCHAR(255),
    weekday_text_saturday VARCHAR(255),
    weekday_text_sunday VARCHAR(255),
    weekday_text_holiday VARCHAR(255),
    weekday_text_info TEXT,
    image VARCHAR(2048),
    vehiclecount INT,
    email VARCHAR(255),
    payment_options VARCHAR(255),
    opening_hours TEXT,
    distance_motorway_km FLOAT,
    distance_airport_km FLOAT,
    distance_train_station_km FLOAT,
    distance_bus_stop_km FLOAT,
    parking_info TEXT,
    shopping_info TEXT,
    fuel_station_info TEXT,
    fuel_station_info_available BOOLEAN,
    parking_info_available BOOLEAN,
    shopping_info_available BOOLEAN,
    guest_toilet BOOLEAN,
    lounge_area BOOLEAN,
    lounge_area_info TEXT,
    guest_toilet_info TEXT,
    greywater_disposal_info TEXT,
    address_description TEXT,
    directions_description TEXT,
    pickup_hours JSON,
    return_hours JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- Create the campers table
CREATE TABLE IF NOT EXISTS campers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ext_id VARCHAR(255) UNIQUE, -- External ID from CU Camper API
    rental_company_id VARCHAR(255),
    active BOOLEAN,
    name VARCHAR(255),
    typsort INT,
    variant_id VARCHAR(255),
    variant VARCHAR(255),
    rating DECIMAL(10, 2),
    rating_count INT,
    run_of_fleet BOOLEAN,
    description TEXT,
    sleeps_adults INT,
    sleeps_children INT,
    max_adults INT,
    max_children INT,
    passengers_seats INT,
    passengers_seats_isofix INT,
    passengers_seats_child_seats INT,
    ideal_adults INT,
    ideal_children INT,
    dimension_length_min FLOAT,
    dimension_length_max FLOAT,
    dimension_height_min FLOAT,
    dimension_height_max FLOAT,
    dimension_width_min FLOAT,
    dimension_width_max FLOAT,
    driverslicense_de_overweight_required BOOLEAN,
    transmission_automatic BOOLEAN,
    awning BOOLEAN,
    air_condition_driving_cabin BOOLEAN,
    air_condition_living_area BOOLEAN,
    air_condition_sleeping_area BOOLEAN,
    cruise_control BOOLEAN,
    passage_drivers_cabin BOOLEAN,
    slideout INT,
    shower_wc INT,
    running_water INT,
    tank_freshwater INT,
    tank_wastewater1 INT,
    tank_wastewater2 INT,
    washbasin BOOLEAN,
    shower_outdoor BOOLEAN,
    tv BOOLEAN,
    dvd BOOLEAN,
    radio INT,
    power12v BOOLEAN,
    sink BOOLEAN,
    fridge BOOLEAN,
    generator BOOLEAN,
    radiator BOOLEAN,
    navigation BOOLEAN,
    four_wd BOOLEAN,
    consumption INT,
    tank_fuel_min INT,
    tank_fuel_max INT,
    rear_cam BOOLEAN,
    jacks BOOLEAN,
    freezer BOOLEAN,
    cool_box BOOLEAN,
    gas_stove BOOLEAN,
    microwave BOOLEAN,
    microwave_oven BOOLEAN,
    oven BOOLEAN,
    size_bed_rear_length INT,
    size_bed_rear_width INT,
    size_bed_sofa_length INT,
    size_bed_sofa_width INT,
    size_bed_dinette_length INT,
    size_bed_dinette_width INT,
    size_bed_dinette_alt INT,
    size_bed_alcoven_length INT,
    size_bed_alcoven_width INT,
    size_bed_bunk_length INT,
    size_bed_bunk_width INT,
    size_bed_bunk_num INT,
    size_bed_roofbox_length INT,
    size_bed_roofbox_width INT,
    size_bed_tent_length INT,
    size_bed_tent_width INT,
    size_bed_alcoven_childonly INT,
    mood1 VARCHAR(255),
    mood1_description TEXT,
    mood2 VARCHAR(255),
    mood2_description TEXT,
    mood3 VARCHAR(255),
    mood3_description TEXT,
    mood4 VARCHAR(255),
    mood4_description TEXT,
    mood5 VARCHAR(255),
    mood5_description TEXT,
    misc1 VARCHAR(255),
    misc1_description TEXT,
    misc2 VARCHAR(255),
    misc2_description TEXT,
    exterior1 VARCHAR(255),
    exterior1_description TEXT,
    exterior2 VARCHAR(255),
    exterior2_description TEXT,
    exterior3 VARCHAR(255),
    exterior3_description TEXT,
    exterior4 VARCHAR(255),
    exterior4_description TEXT,
    exterior5 VARCHAR(255),
    exterior5_description TEXT,
    interior1 VARCHAR(255),
    interior1_description TEXT,
    interior2 VARCHAR(255),
    interior2_description TEXT,
    interior3 VARCHAR(255),
    interior3_description TEXT,
    interior4 VARCHAR(255),
    interior4_description TEXT,
    interior5 VARCHAR(255),
    interior5_description TEXT,
    floorplan_day VARCHAR(255),
    floorplan_day_description TEXT,
    floorplan_night VARCHAR(255),
    floorplan_night_description TEXT,
    floorplan_misc1 VARCHAR(255),
    floorplan_misc1_description TEXT,
    floorplan_misc2 VARCHAR(255),
    floorplan_misc2_description TEXT,
    provider_id INT,
    station_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (station_id) REFERENCES stations(id)
);

-- Create the addons table
CREATE TABLE IF NOT EXISTS addons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10, 2),
    max_quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create a linking table for the many-to-many relationship between campers and addons
CREATE TABLE IF NOT EXISTS camper_addons (
    camper_id INT NOT NULL,
    addon_id INT NOT NULL,
    PRIMARY KEY (camper_id, addon_id),
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
);

-- Create the images table
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    caption VARCHAR(255),
    alt_text VARCHAR(255),
    copyright_holder_name VARCHAR(255),
    copyright_holder_link VARCHAR(2048),
    width INT,
    height INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create a linking table for camper images
CREATE TABLE IF NOT EXISTS camper_images (
    camper_id INT NOT NULL,
    image_id INT NOT NULL,
    category VARCHAR(255),
    PRIMARY KEY (camper_id, image_id, category),
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Create a linking table for station images
CREATE TABLE IF NOT EXISTS station_images (
    station_id INT NOT NULL,
    image_id INT NOT NULL,
    category VARCHAR(255),
    PRIMARY KEY (station_id, image_id, category),
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Create a linking table for provider images
CREATE TABLE IF NOT EXISTS provider_images (
    provider_id INT NOT NULL,
    image_id    INT NOT NULL,
    category    VARCHAR(255),
    PRIMARY KEY (provider_id, image_id, category),
    FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
);

-- Create a linking table for addon images
CREATE TABLE IF NOT EXISTS addon_images (
    addon_id INT NOT NULL,
    image_id INT NOT NULL,
    PRIMARY KEY (addon_id, image_id),
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);