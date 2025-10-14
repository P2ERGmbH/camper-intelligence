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