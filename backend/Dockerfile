FROM php:8.3-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    git \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    unzip \
  && docker-php-ext-install \
    intl \
    mbstring \
    pdo_mysql \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .

RUN composer dump-autoload --optimize \
  && chmod +x docker/entrypoint.sh \
  && mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public", "docker/server.php"]
