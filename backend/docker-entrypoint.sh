#!/bin/sh
set -e

# Copy .env if it does not exist
if [ ! -f /var/www/.env ]; then
    cp /var/www/.env.example /var/www/.env
fi

# Generate app key if not set
if grep -q "^APP_KEY=$" /var/www/.env; then
    php artisan key:generate --force
fi

# Ensure the SQLite database file exists on the volume-mounted path
mkdir -p /var/www/database
if [ ! -f /var/www/database/database.sqlite ]; then
    touch /var/www/database/database.sqlite
fi

# Run migrations
php artisan migrate --force

exec "$@"
