CREATE DATABASE IF NOT EXISTS yaseenshop_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yaseenshop_db;

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(80) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (id, name, price, category, rating, description) VALUES
(1, 'Wireless Headphones', 4999, 'Electronics', 4.8, 'Wireless headphones with clear sound'),
(2, 'Smart Watch', 6999, 'Electronics', 4.7, 'Modern smartwatch'),
(3, 'Running Shoes', 5499, 'Fashion', 4.6, 'Comfortable running shoes'),
(4, 'Premium Backpack', 3499, 'Fashion', 4.8, 'Backpack for school and travel')
ON DUPLICATE KEY UPDATE
name=VALUES(name),
price=VALUES(price),
category=VALUES(category),
rating=VALUES(rating),
description=VALUES(description);
