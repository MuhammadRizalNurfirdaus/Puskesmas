# Database Setup Guide

## Problem
MariaDB is running but requires authentication that needs to be configured manually.

## Solution Steps

### Method 1: Using mariadb-secure-installation (Recommended for first-time setup)

If you haven't run this before, run:
```bash
sudo mariadb-secure-installation
```

Follow the prompts to set a root password. Then use that password to create the database.

### Method 2: Manual Database Setup

1. **Access MariaDB as root** (you may need to enter your MariaDB root password):
   ```bash
   sudo mariadb -u root -p
   ```
   
   Or if no password is set, try without sudo:
   ```bash
   mariadb -u root
   ```

2. **Once inside MariaDB, run these commands:**
   ```sql
   CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';
   GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Verify the setup:**
   ```bash
   mariadb -u puskesmas_user -ppuskesmas123 -e "SHOW DATABASES;"
   ```

### Method 3: Reset MariaDB root password (if forgot password)

1. Stop MariaDB:
   ```bash
   sudo systemctl stop mariadb
   ```

2. Start MariaDB in safe mode:
   ```bash
   sudo mysqld_safe --skip-grant-tables --skip-networking &
   ```

3. Connect without password:
   ```bash
   mariadb -u root
   ```

4. Reset password:
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. Stop safe mode and restart normally:
   ```bash
   sudo killall mysqld
   sudo systemctl start mariadb
   ```

## After Database Setup

Once the database is created, the backend will connect automatically using the credentials in `.env`:

```env
DB_USERNAME=puskesmas_user
DB_PASSWORD=puskesmas123
DB_DATABASE=puskesmas_db
```

## Quick Test

Test database connection:
```bash
mariadb -u puskesmas_user -ppuskesmas123 puskesmas_db -e "SELECT 'Connection successful!' as Status;"
```

If this works, you're ready to run the backend!

## Start the Application

```bash
# In the backend directory
cd backend
npm run dev

# In another terminal, start the frontend
cd frontend
npm run dev
```

The application should now work correctly!
