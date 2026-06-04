CREATE TABLE IF NOT EXISTS traffic_metrics (
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    vehicle_type VARCHAR(100) UNIQUE NOT NULL,
    traffic_vol INTEGER NOT NULL,
    rec_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_traffic_country ON traffic_metrics (country_code);

CREATE INDEX idx_traffic_vehicle ON traffic_metrics (vehicle_type);

CREATE INDEX idx_traffic_date ON traffic_metrics (rec_time);