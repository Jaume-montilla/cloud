FROM php:8.2-apache

RUN docker-php-ext-install ftp

WORKDIR /var/www/html

COPY . /var/www/html

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2ensite 000-default.conf

RUN a2enmod rewrite

EXPOSE 8000

CMD ["apache2-foreground"]
