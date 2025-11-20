#!/bin/bash
set -e

echo "🚀 Starting Laravel Backend Setup..."

# Prüfe ob Laravel installiert ist
if [ ! -f "artisan" ]; then
    echo "📦 Laravel nicht gefunden. Installiere Laravel..."
    composer create-project laravel/laravel tmp
    mv tmp/* tmp/.* . 2>/dev/null || true
    rm -rf tmp
    echo "✅ Laravel installiert!"
else
    echo "✅ Laravel bereits vorhanden"
fi

# Installiere/Update Composer Dependencies
echo "📦 Installiere Composer Dependencies..."
composer install --no-interaction --optimize-autoloader

# Prüfe ob .env existiert
if [ ! -f ".env" ]; then
    echo "⚙️  Erstelle .env Datei..."
    cp .env.example .env
fi

# Generiere App Key falls nicht vorhanden
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generiere Application Key..."
    php artisan key:generate
fi

# Warte auf Datenbank
echo "⏳ Warte auf Datenbank..."
until php artisan migrate:status 2>/dev/null; do
    echo "   Datenbank noch nicht bereit, warte 2 Sekunden..."
    sleep 2
done

# Führe Migrationen aus
echo "🗄️  Führe Migrationen aus..."
php artisan migrate --force

# Setze Berechtigungen
echo "🔒 Setze Berechtigungen..."
chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Cache leeren
echo "🧹 Leere Cache..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "✨ Setup abgeschlossen! Starte Services..."

# Starte Supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf