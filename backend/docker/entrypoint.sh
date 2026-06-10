#!/bin/sh
set -e

if [ ! -f .env ]; then
  cp .env.example .env
fi

mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R ug+rw storage bootstrap/cache || true

if [ "${DB_CONNECTION:-}" = "mysql" ]; then
  echo "Waiting for database at ${DB_HOST:-mysql}:${DB_PORT:-3306}..."
  attempts=0

  until php -r '$host=getenv("DB_HOST") ?: "mysql"; $port=getenv("DB_PORT") ?: "3306"; $db=getenv("DB_DATABASE") ?: ""; $user=getenv("DB_USERNAME") ?: "root"; $pass=getenv("DB_PASSWORD") ?: ""; try { new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass); exit(0); } catch (Throwable $e) { fwrite(STDERR, $e->getMessage() . PHP_EOL); exit(1); }'; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 60 ]; then
      echo "Database did not become available in time." >&2
      exit 1
    fi
    sleep 2
  done
fi

if [ -z "${APP_KEY:-}" ]; then
  php artisan key:generate --force
fi

php artisan storage:link || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force
fi

if [ "${RUN_SEEDERS:-true}" = "true" ]; then
  php artisan db:seed --force
fi

exec "$@"
