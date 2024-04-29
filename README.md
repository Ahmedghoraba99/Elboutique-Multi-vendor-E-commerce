# Elboutique-Multi-vendor-E-commerce

<!-- sql code -->

### Database connection

#### First open mysql

create this user using the root DB user to start working on the database, it's heavily advised to change the credentials:

```sql
CREATE USER 'elboutique'@'localhost' IDENTIFIED BY 'elboutique123456elboutique';
GRANT ALL PRIVILEGES ON elboutique.* TO 'elboutique'@'localhost';
FLUSH PRIVILEGES;
exit
```

#### Then open the terminal

enter your password

```sql

mysql -u elboutique -p

CREATE DATABASE elboutique;
-- insure the database works
USE elboutique;
```

#### Install the necesasry dependencies

```bash
composer install
php artisan key:generate
# php artisan migrate
# php artisan db:seed
php artisan serve
```
