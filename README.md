# Computer Shop

A full-stack e-commerce application with a customer storefront and a secure owner/admin dashboard. The backend is Express + TypeScript + MySQL, and the frontend is Next.js with a responsive admin interface.

## Architecture

- Customer storefront: Next.js app with product listing, filtering, sorting, pagination, detail pages, and order links
- Admin dashboard: authenticated Next.js admin area protected by JWT-based auth
- Backend API: Express REST API with validation, auth middleware, and CRUD operations
- Database: MySQL for users, categories, products, and product images metadata
- File storage: uploaded product images are stored on the local filesystem and exposed via HTTP URLs; only the URL/path metadata is saved in PostgreSQL

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, MySQL, JWT, bcryptjs, Multer
- Database: MySQL
- Image handling: multer + local filesystem

## Folder Structure

```text
Computer/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validation/
│   │   ├── server.ts
│   │   └── ...
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── uploads/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
└── README.md
```

## MySQL Setup

1. Install MySQL/MySQL Workbench and create a database named `computer_shop`.
2. Set the backend environment variables.
3. Run the migration.
4. Run the seed script.
5. Run the create-admin script to create the initial owner/admin account.

Example connection string:

```env
DATABASE_URL=mysql://root:your_mysql_password@localhost:3306/computer_shop
```

## Environment Variables

### Backend

Create a `.env` file in `backend/` using `.env.example` as the template:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL=mysql://root:your_mysql_password@localhost:3306/computer_shop
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
OWNER_NAME=Your Shop Owner
OWNER_PHONE=+1-555-123-4567
OWNER_EMAIL=owner@example.com
OWNER_WHATSAPP=+15551234567
SHOP_NAME=Your Computer Shop
SHOP_ADDRESS=123 Tech Street, City, ST 12345
UPLOAD_DIR=uploads
MAX_IMAGE_SIZE_MB=5
BASE_URL=http://localhost:5000
LOW_STOCK_THRESHOLD=5
OUT_OF_STOCK_THRESHOLD=0
INITIAL_ADMIN_NAME=Shop Owner
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=replace_with_secure_admin_password
```

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_OWNER_NAME=Your Shop Owner
NEXT_PUBLIC_OWNER_PHONE=+1-555-123-4567
NEXT_PUBLIC_OWNER_EMAIL=owner@example.com
NEXT_PUBLIC_OWNER_WHATSAPP=+15551234567
NEXT_PUBLIC_SHOP_NAME=Your Computer Shop
NEXT_PUBLIC_SHOP_ADDRESS=123 Tech Street, City, ST 12345
```

## Migration

```bash
cd backend
npm run migrate
```

This runs the SQL in `backend/database/schema.sql`.

## Seed

```bash
cd backend
npm run seed
```

This loads the sample product and category data from `backend/database/seed.sql`.

## Admin Creation

```bash
cd backend
npm run create-admin
```

This creates the first owner/admin account from the environment variables.

## Backend Commands

```bash
cd backend
npm install
npm run dev
npm run build
npm run migrate
npm run seed
npm run create-admin
```

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
```

## API Endpoints

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me` (authenticated)

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/slug/:slug`
- `GET /api/products/stats` (admin only)
- `POST /api/products` (admin only)
- `PUT /api/products/:id` (admin only)
- `DELETE /api/products/:id` (admin only)

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories` (admin only)
- `PUT /api/categories/:id` (admin only)
- `DELETE /api/categories/:id` (admin only)

## Authentication

- Admin login uses the backend authentication endpoint.
- JWT is returned after successful login.
- JWT is stored in browser localStorage for admin access.
- Protected admin routes redirect unauthenticated users to `/admin/login`.
- Backend middleware restricts create/update/delete operations to owner/admin roles.

## Image Storage

- Product images are uploaded to the server filesystem under `backend/uploads/products`.
- MySQL stores only image URLs/metadata, not binary image content.
- Images are served by Express from `/uploads`.
- Upload validation allows JPEG, PNG, WebP, and GIF; file size is limited by `MAX_IMAGE_SIZE_MB`.

## Development Setup

1. Start MySQL.
2. Copy `backend/.env.example` to `backend/.env` and fill in the values.
3. Copy `frontend/.env.local.example` if present or create `frontend/.env.local`.
4. Start backend:

```bash
cd backend
npm install
npm run dev
```

5. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

6. Open the site at `http://localhost:3000`.

## Production Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

The build output is production-ready for deployment when the environment variables and MySQL configuration are set correctly in the target environment.
