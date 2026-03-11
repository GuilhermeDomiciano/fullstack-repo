FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    git \
    sqlite \
    sqlite-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite pdo_mysql bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first for layer caching
COPY composer.json composer.lock* ./

RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

RUN composer dump-autoload --optimize

# Create sqlite database and storage directories
RUN mkdir -p /var/www/database \
    && touch /var/www/database/database.sqlite \
    && mkdir -p /var/www/storage/framework/cache/data \
    && mkdir -p /var/www/storage/framework/sessions \
    && mkdir -p /var/www/storage/framework/views \
    && mkdir -p /var/www/storage/logs \
    && mkdir -p /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Copy env file
RUN cp .env.example .env

# Generate application key
RUN php artisan key:generate

# Run migrations
RUN php artisan migrate --force

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
