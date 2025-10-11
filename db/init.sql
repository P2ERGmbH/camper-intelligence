-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'provider') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the providers table to hold provider-specific information
CREATE TABLE IF NOT EXISTS providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255),
    address TEXT,
    tax_id VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create a linking table for the many-to-many relationship between users and providers
CREATE TABLE IF NOT EXISTS provider_users (
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    PRIMARY KEY (user_id, provider_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Create the stations table for pickup locations
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(50),
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
    guest_toilet BOOLEAN,
    lounge_area BOOLEAN,
    greywater_disposal_info TEXT,
    pickup_hours JSON,
    return_hours JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- Create the campers table
CREATE TABLE IF NOT EXISTS campers (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    mood2 VARCHAR(255),
    mood3 VARCHAR(255),
    mood4 VARCHAR(255),
    mood5 VARCHAR(255),
    misc1 VARCHAR(255),
    misc2 VARCHAR(255),
    exterior1 VARCHAR(255),
    exterior2 VARCHAR(255),
    exterior3 VARCHAR(255),
    exterior4 VARCHAR(255),
    exterior5 VARCHAR(255),
    interior1 VARCHAR(255),
    interior2 VARCHAR(255),
    interior3 VARCHAR(255),
    interior4 VARCHAR(255),
    interior5 VARCHAR(255),
    floorplan_day VARCHAR(255),
    floorplan_night VARCHAR(255),
    floorplan_misc1 VARCHAR(255),
    floorplan_misc2 VARCHAR(255),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create a linking table for camper images
CREATE TABLE IF NOT EXISTS camper_images (
    camper_id INT NOT NULL,
    image_id INT NOT NULL,
    image_category VARCHAR(255),
    PRIMARY KEY (camper_id, image_id),
    FOREIGN KEY (camper_id) REFERENCES campers(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Create a linking table for station images
CREATE TABLE IF NOT EXISTS station_images (
    station_id INT NOT NULL,
    image_id INT NOT NULL,
    PRIMARY KEY (station_id, image_id),
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Create a linking table for addon images
CREATE TABLE IF NOT EXISTS addon_images (
    addon_id INT NOT NULL,
    image_id INT NOT NULL,
    PRIMARY KEY (addon_id, image_id),
    FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);