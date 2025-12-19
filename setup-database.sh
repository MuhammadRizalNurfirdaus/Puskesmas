#!/bin/bash

echo "🔧 Setting up Puskesmas Database..."
echo ""
echo "This script will create the database and user for the Puskesmas system."
echo ""

# Check if MariaDB/MySQL is running
if ! sudo systemctl is-active --quiet mariadb && ! sudo systemctl is-active --quiet mysql; then
    echo "❌ MariaDB/MySQL is not running. Starting it..."
    sudo systemctl start mariadb || sudo systemctl start mysql
fi

echo "📝 Creating database and user..."
sudo mariadb << 'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with password
CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';

-- Grant privileges
GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show created database
SHOW DATABASES LIKE 'puskesmas_db';

-- Show user
SELECT User, Host FROM mysql.user WHERE User = 'puskesmas_user';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📋 Database credentials:"
    echo "   Database: puskesmas_db"
    echo "   Username: puskesmas_user"
    echo "   Password: puskesmas123"
    echo "   Host: localhost"
    echo "   Port: 3306"
    echo ""
    echo "💡 Update your backend/.env file with these credentials:"
    echo "   DB_USERNAME=puskesmas_user"
    echo "   DB_PASSWORD=puskesmas123"
    echo "   DB_DATABASE=puskesmas_db"
    echo ""
    echo "🚀 Now you can start the backend server with: npm run dev"
else
    echo ""
    echo "❌ Failed to setup database. Please run the following commands manually:"
    echo ""
    echo "sudo mariadb"
    echo "CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';"
    echo "GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';"
    echo "FLUSH PRIVILEGES;"
    echo "EXIT;"
fi
