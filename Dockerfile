# --------------------------
# Base image with PHP 8.3
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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --------------------------
# Install Node.js & npm (latest stable)
# --------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# --------------------------
# Install Composer
# --------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --------------------------
# Copy only dependency files first for caching
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
# Expose port and start server
# --------------------------
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
