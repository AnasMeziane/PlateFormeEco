# Backend Setup (Laravel)

## Prérequis
- PHP 8.2+
- Composer
- MySQL (XAMPP, Laragon, ou autre)

## Étapes

### 1. Créer la base de données
Ouvrez phpMyAdmin (http://localhost/phpmyadmin) et créez une base nommée :
```
ecommerce_db
```

### 2. Configurer le fichier .env
Ouvrez `backend/.env` et vérifiez ces lignes :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=          ← mettez votre mot de passe MySQL ici
```

### 3. Lancer les commandes
```bash
cd backend
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve
```

### 4. Vérification
Le serveur backend tourne sur : http://localhost:8000/api

### Identifiants Admin
- Email : admin@ecommerce.com
- Mot de passe : password
