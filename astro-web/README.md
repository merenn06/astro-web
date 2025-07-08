# Astroloji App

A Next.js 14 starter with Tailwind CSS, shadcn/ui, Prisma (SQLite by default), NextAuth (email), and a dark/light toggle.

## Quick Start

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Set up environment:**
   - Copy `.env` and set your `DATABASE_URL` (default is SQLite, for Postgres use Railway or similar)
   - Set `NEXTAUTH_SECRET` to a random string
   - For email auth, set `EMAIL_SERVER` and `EMAIL_FROM` in `.env`

3. **Prisma setup:**
   ```sh
   npx prisma migrate dev --name init
   ```

4. **Run the app:**
   ```sh
   npm run dev
   ```

5. **Open:**
   http://localhost:3000

## Features
- Next.js 14 (app dir, TypeScript, ESM)
- Tailwind CSS (dark mode, typography)
- shadcn/ui ready
- Prisma ORM (SQLite by default, easy to switch to Postgres)
- NextAuth (email, Prisma adapter)
- Dark/light mode toggle

## Structure
- All code in `src/app` (monorepo-friendly, but single-app)
- AuthProvider in `src/app/providers.tsx`
- NextAuth route in `src/app/api/auth/[...nextauth]/route.ts`

---

MIT License
