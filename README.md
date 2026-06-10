# E-Commerce Platform (Laravel + React)

## Structure
```
/backend   → Laravel API (PHP)
/frontend  → React + Tailwind CSS (Vite)
```

## Setup

### Docker Compose
```bash
docker compose up --build
```

This starts MySQL, the Laravel API, and the React frontend.

- Frontend: http://localhost:5173
- API through frontend proxy: http://localhost:5173/api
- API direct: http://localhost:8000/api
- Admin: http://localhost:5173/admin/login
  - Email: `admin@ecommerce.com`
  - Password: `password`

The backend runs migrations and seeders automatically on container startup. For Coolify, point the public route at the `frontend` service on port `80`; the frontend proxies `/api` and `/storage` to the Laravel container over the Docker network.

### 1. Base de données
Créez une base MySQL nommée `ecommerce_db`.

### 2. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env   # (puis configurez DB_DATABASE, DB_USERNAME, DB_PASSWORD)
php artisan key:generate
php artisan storage:link
php artisan migrate
php artisan db:seed
php artisan serve
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 4. Accès
- **Frontend Client** : http://localhost:5173
- **Dashboard Admin** : http://localhost:5173/admin/login
  - Email: `admin@ecommerce.com`
  - Mot de passe: `password`
- **API Backend** : http://localhost:8000/api

## Features
- **Client** : Home, Shop, Product Detail, About, Contact, FAQ, WhatsApp Order
- **Admin** : Dashboard stats, CRUD Catégories/Produits, Gestion Commandes WhatsApp, Clients, Pages CMS
- **Auth** : Laravel Sanctum (token-based)
- **Images** : Multi-upload via Laravel Storage
- **WhatsApp** : Formulaire de commande avec redirection WhatsApp pré-rempli
