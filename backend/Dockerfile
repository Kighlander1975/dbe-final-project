FROM php:8.2-fpm

# Installiere System-Abhängigkeiten
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    jq \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installiere PHP Extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installiere Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Setze Arbeitsverzeichnis
WORKDIR /var/www/html

# ✨ NEU: Kopiere nur composer.json und composer.lock zuerst (für besseres Caching)
COPY composer.json composer.lock ./

# ✨ NEU: Installiere PHP-Dependencies (wird nur neu gebaut wenn composer.json sich ändert)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction \
    && composer clear-cache

# ✨ NEU: Kopiere Application Code
COPY . .

# ✨ NEU: Finalisiere Composer Autoloader
RUN composer dump-autoload --optimize --no-dev

# Kopiere Docker-Konfigurationen (überschreibt falls nötig)
COPY ./docker/nginx.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Mache Entrypoint ausführbar
RUN chmod +x /usr/local/bin/entrypoint.sh

# ✨ NEU: Setze Berechtigungen für Laravel
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exponiere Port 80
EXPOSE 80

# Verwende Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
