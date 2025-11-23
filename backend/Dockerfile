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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installiere PHP Extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installiere Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Setze Arbeitsverzeichnis
WORKDIR /var/www/html

# Kopiere Docker-Konfigurationen
COPY ./docker/nginx.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Mache Entrypoint ausführbar
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exponiere Port 80
EXPOSE 80

# Verwende Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
