-- SQL Schema généré par SQL Schema Designer
-- Date de génération: 12/05/2025 10:51:41

-- Table: users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR,
    hashed_password VARCHAR,
    fname VARCHAR,
    lname VARCHAR,
    phone INTEGER,
    role INTEGER
);

-- Table: reservations
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    number_of_people INTEGER,
    date DATE,
    time TIME,
    status INTEGER
);

-- Table: tables
CREATE TABLE tables (
    id INTEGER PRIMARY KEY,
    seats INTEGER
);

-- Table: menu_items
CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    price INTEGER,
    category INTEGER
);

-- Table: reservation_tables
CREATE TABLE reservation_tables (
    reservation_id INTEGER,
    table_id INTEGER
);

-- Table: opening_slots
CREATE TABLE opening_slots (
    id INTEGER PRIMARY KEY,
    date_time DATETIME,
    duration INTEGER,
    available BOOLEAN,
    comment VARCHAR
);

-- Clé étrangère: reservations.user_id -> users.id
ALTER TABLE reservations
    ADD CONSTRAINT fk_reservations_user_id
    FOREIGN KEY (user_id)
    REFERENCES users (id);

-- Clé étrangère: reservation_tables.reservation_id -> reservations.id
ALTER TABLE reservation_tables
    ADD CONSTRAINT fk_reservation_tables_reservation_id
    FOREIGN KEY (reservation_id)
    REFERENCES reservations (id);

-- Clé étrangère: reservation_tables.table_id -> tables.id
ALTER TABLE reservation_tables
    ADD CONSTRAINT fk_reservation_tables_table_id
    FOREIGN KEY (table_id)
    REFERENCES tables (id);