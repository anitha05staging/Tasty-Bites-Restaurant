# Tasty Bites Restaurant

A modern restaurant management system with a public website and an admin dashboard.

## Tech Stack

- **Frontend:** React + Vite
- **Admin Dashboard:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Local) / Neon (Production)
- **Deployment:** Vercel

## Project Structure

- `/frontend`: Public-facing website.
- `/admin`: Management dashboard for staff.
- `/backend`: Express API and database models.

## Local Setup

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm run install:all
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the `backend` directory based on the provided configuration.
4. **Seed the database:**
   ```bash
   npm run seed
   ```
5. **Run the development servers:**
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:5173`
   - Admin dashboard: `http://localhost:5173/admin`
   - Backend API: `http://localhost:5000`

## Deployment

### Backend
The backend is designed to be deployed on Vercel or any Node.js host. Connect it to a Neon PostgreSQL instance.

### Frontend & Admin
Both frontend and admin are Vite projects. They can be deployed on Vercel. Ensure the `VITE_API_URL` (if used) points to your deployed backend.

## License
MIT
