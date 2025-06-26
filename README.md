# 🚀 Bluestock IPO Web App

A full-stack IPO listing and management web app built with **Next.js**, **PostgreSQL**, **Prisma**, and **Tailwind CSS**.  
It features a public IPO listing portal, a secure admin panel, and RHP/DRHP file upload capability.

---

## 🧰 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js, Tailwind CSS               |
| Backend    | Next.js API Routes                  |
| Database   | PostgreSQL via Prisma ORM           |
| Uploads    | Formidable (PDF File Upload)        |
| Auth       | Simple client-side (admin-only)     |
| Deployment | Vercel (Frontend) + Railway (DB)    |

---

## 📁 Folder Structure

```
pages/
├── index.tsx             → IPO listing (public)
├── ipo/[id].tsx          → IPO detail page
├── admin/                → Admin login, dashboard, create form
├── api/ipos/             → REST API (GET, POST, DELETE)
├── api/upload.ts         → File upload handler

prisma/
├── schema.prisma         → DB schema
├── seed.ts               → Seed script

lib/
├── prisma.ts             → Prisma client
├── api.ts, auth.ts       → Helpers

public/docs/              → Uploaded PDFs
.env.example              → Environment variable sample
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yashuppal-15/Bluestock-IPO-Final.git
cd Bluestock-IPO-Final
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file using the provided template:

```bash
cp .env.example .env
```

Then paste your PostgreSQL database URL:

```
DATABASE_URL=postgresql://user:pass@host:port/db
```

---

### 4. Initialize the Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Then open [http://localhost:5555](http://localhost:5555) to inspect your database via Prisma Studio.

---

### 5. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Panel Login

| Username | Password |
|----------|----------|
| admin    | admin    |

---

## 🎯 Features

- 📌 IPO listings with details and performance
- 🔍 Searchable public pages
- 🧑‍💼 Admin dashboard to add/delete IPOs
- 📎 Upload RHP/DRHP PDFs
- 💾 PostgreSQL backend
- ⚡ Fully styled with Tailwind CSS
- 🧩 Easy to deploy to Vercel

---

## 🌐 Deployment Instructions

### 1. Deploy to Vercel

- Push your code to GitHub
- Visit [https://vercel.com](https://vercel.com)
- Import GitHub repo
- Set environment variable `DATABASE_URL` in Vercel dashboard
- Deploy

### 2. Use Railway for DB (Optional)

- Visit [https://railway.app](https://railway.app)
- Create a PostgreSQL project
- Copy the connection URL and paste it into `.env`

---

## 🧠 Notes & Tips

- Ensure `node_modules/` is ignored via `.gitignore`
- Always seed database after migrations
- PDFs are stored in `public/docs/`
- Admin login is stored in `localStorage` (no real auth backend)

---

## 📜 License

This project is for learning/demo purposes only.

---

> Built with ❤️ for IPO exploration and admin management.
