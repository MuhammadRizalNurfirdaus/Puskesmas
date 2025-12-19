-- Puskesmas Database Setup Script
-- Run this script as MariaDB root user
-- Usage: sudo mariadb < backend/setup-database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS puskesmas_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Show results
SELECT 'Database created successfully!' as Status;
SHOW DATABASES LIKE 'puskesmas_db';
SELECT User, Host FROM mysql.user WHERE User = 'puskesmas_user';

-- Use the database
USE puskesmas_db;

-- Show that database is ready
SELECT 'Database is ready for use!' as Status;
