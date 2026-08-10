# Mediabuy Lab - Telegram Bot & Mini App

Monorepo with:
- `backend/` FastAPI + Aiogram + PostgreSQL + SQLAlchemy + Alembic + OxaPay integration
- `frontend/` React (Vite) + Tailwind + Telegram Mini App SDK

## Implemented Modules

- Telegram Mini App auth via `initData` validation
- User auto upsert (`telegram_id`, `username`, `first_name`, `last_name`)
- Catalog with categories/products and visibility toggles
- Cart and order creation
- OxaPay invoice generation + webhook payment processing
- Loyalty system: 10% discount on second order
- Service requests: launch ads and training quiz
- Admin API for categories/products/requests
- Aiogram bot with `/start`, Mini App open button and contact menu
- Bottom navigation with centered cart button and badge

## Backend Run

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000
```

Bot:

```bash
cd backend
source .venv/bin/activate
python -m bot.main
```

## Frontend Run

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Admin Access Criteria

Access to admin API and admin page is granted only when one of the conditions is true:

1. Telegram WebApp user has `telegram_id` included in `ADMIN_IDS`.
2. User logs in via Web Admin credentials (`WEB_ADMIN_LOGIN` + `WEB_ADMIN_PASSWORD_HASH`) and receives a signed bearer token.

If neither condition is met, admin endpoints return `403` and admin UI shows login form.

## Web Admin Login/Password (Hashed)

Password is not stored in plain text. Use PBKDF2 hash in `WEB_ADMIN_PASSWORD_HASH`.

Example hash generation:

```bash
python3 - <<'PY'
import hashlib
password = 'your-strong-password'
salt = 'your-unique-salt'
print(hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 200000).hex())
PY
```

Put result to `.env`:

- `WEB_ADMIN_LOGIN`
- `WEB_ADMIN_PASSWORD_SALT`
- `WEB_ADMIN_PASSWORD_HASH`
- `ADMIN_WEB_TOKEN_SECRET`

Development default (change immediately in production):

- login: `admin`
- password: `admin123`

## Docker Deployment

Project includes Docker setup:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `docker-compose.yml`

Run on server:

```bash
docker compose build
docker compose up -d
```

Services:

1. `postgres` (database)
2. `backend` (FastAPI + migrations)
3. `bot` (Aiogram polling)
4. `frontend` (Nginx + built SPA)
