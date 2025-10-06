# --------------------------
# Base image with PHP 8.3 and FPM
# --------------------------
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# --------------------------
# Install system dependencies
# --------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    default-mysql-client \
    build-essential \
    python3 \
    nginx \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --------------------------
# Install Node.js & npm
# --------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# --------------------------
# Install Composer
# --------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --------------------------
# Copy dependency files first for caching
# --------------------------
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# --------------------------
# Copy app source code
# --------------------------
COPY . .

# --------------------------
# Build frontend assets
# --------------------------
RUN npm run build

# --------------------------
# Configure Nginx
# --------------------------
RUN rm /etc/nginx/sites-enabled/default
COPY ./nginx/default.conf /etc/nginx/conf.d/

# --------------------------
# Set permissions
# --------------------------
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# --------------------------
# Expose port and start services
# --------------------------
EXPOSE 80

# Use Supervisor to run PHP-FPM and Nginx together
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
