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
    date_time TIMESTAMP,
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



-- SEED DATA -- 

-- Insertion des utilisateurs
INSERT INTO users (id, email, hashed_password, fname, lname, phone, role) VALUES
(1, 'admin@example.com', '$2b$10$QmZkbnZLZTeXUqz9/jATFez1i6zZoKwR65u/3Zj5V7RE71nJ9Mf3y', 'Alice', 'Admin', 0634567890, 1),
(2, 'user@example.com', '$2b$10$QmZkbnZLZTeXUqz9/jATFez1i6zZoKwR65u/3Zj5V7RE71nJ9Mf3y', 'Bob', 'Client', 0734563298, 0);

-- Insertion des tables
INSERT INTO tables (id, seats) VALUES
(1, 2),
(2, 4),
(3, 6);

-- Insertion d'éléments du menu
INSERT INTO menu_items (id, name, description, price, category) VALUES
(1, 'Pizza Margherita', 'Tomate, mozzarella, basilic', 1200, 1),
(2, 'Salade César', 'Poulet grillé, laitue, parmesan, croûtons', 900, 2),
(3, 'Tiramisu', 'Dessert italien classique', 700, 3);

-- Insertion de créneaux d'ouverture
INSERT INTO opening_slots (id, date_time, duration, available, comment) VALUES
(1, '2025-05-12 12:00:00', 90, TRUE, 'Déjeuner'),
(2, '2025-05-12 19:00:00', 120, TRUE, 'Dîner');

-- Insertion de réservations
INSERT INTO reservations (id, user_id, number_of_people, date, time, status) VALUES
(1, 2, 4, '2025-05-13', '19:00:00', 1),
(2, 2, 2, '2025-05-14', '12:30:00', 0);

-- Lien entre réservation et tables
INSERT INTO reservation_tables (reservation_id, table_id) VALUES
(1, 2),
(2, 1);