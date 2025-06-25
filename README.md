<<<<<<< HEAD
📘 README.md — Bluestock IPO Web App
🚀 Overview
This is a full-stack IPO web application built with Next.js, PostgreSQL, Prisma, and Tailwind CSS.
It includes a public IPO listing portal and a secure admin panel to manage IPO entries and upload RHP/DRHP documents.

🧑‍💻 Tech Stack
Layer	Technology
Frontend	Next.js + Tailwind CSS
Backend	Next.js API Routes
Database	PostgreSQL via Prisma ORM
File Upload	Formidable (RHP/DRHP PDFs)
Auth	Basic client-side (admin)
Deployment	Vercel + Railway (PostgreSQL)

📂 Project Structure
pgsql
Copy
Edit
pages/
├── index.tsx             → IPO listing (public)
├── ipo/[id].tsx          → IPO detail page
├── admin/                → Admin login, dashboard, create form
├── api/ipos/             → REST API (GET, POST, DELETE)
├── api/upload.ts         → File upload handler

prisma/
├── schema.prisma         → DB schema
├── seed.ts               → Sample data seeder

lib/
├── prisma.ts             → Prisma client
├── api.ts                → API fetch helpers (frontend)
├── auth.ts               → Admin auth helper

public/docs/              → Uploaded RHP/DRHP PDFs
.env.example              → DB config example
🛠️ Setup Instructions
Install dependencies

bash
Copy
Edit
npm install
Set up environment variables
Create a .env file with your PostgreSQL connection:

env
Copy
Edit
DATABASE_URL=postgresql://username:password@host:port/database
Run Prisma DB migration

bash
Copy
Edit
npx prisma migrate dev --name init
Seed initial data (Tata & Ola IPOs)

bash
Copy
Edit
npx prisma db seed
Start the development server

bash
Copy
Edit
npm run dev
🔐 Admin Login (Hardcoded)
Username	Password
admin	admin

📤 File Upload (RHP/DRHP)
RHP & DRHP PDFs are uploaded via the admin panel.

Stored in public/docs/

Downloadable from public detail page

🌐 Deployment (Optional)
1. Deploy to Vercel
Connect GitHub repo

Add DATABASE_URL in Vercel environment variables

2. DB Hosting via Railway
Use Railway's PostgreSQL instance

Paste the Railway connection string into .env or Vercel settings

✅ Features
Public IPO listing page

IPO detail view with RHP/DRHP downloads

Admin login system

Admin dashboard with add/delete IPOs

File upload and storage

Responsive Tailwind UI

Full database integration via Prisma
=======
# Bluestock IPO Web App

## Tech Stack
- Next.js (TypeScript)
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Setup Instructions
1. `npm install`
2. `cp .env.example .env`
3. Edit `.env` with your DB credentials
4. `npx prisma migrate dev --name init`
5. `npm run dev`

Visit `http://localhost:3000`
>>>>>>> 13afdbb2f8984d86bb8e371f0ead079c79d33354
