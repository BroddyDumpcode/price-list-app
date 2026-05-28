
CREATE DATABASE warung_db;

USE warung_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(255)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price BIGINT
);

INSERT INTO users(username, password)
VALUES(
  'admin',
  '$2b$10$4N0T0B4F7LhB4lP1Pq8B8uKXKfVxL7kJ9t8M6QyGm8W6QxA4oK2ZK'
);
