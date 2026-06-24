# IELTS Prep App (Production-Grade PWA)

A Progressive Web App designed as a daily reminder and study planner for IELTS candidates.

## Features

- **User Authentication**: Secure email/password login using Supabase Auth.
- **Study Plans**: Create and manage 1, 2, or 3-month study roadmaps.
- **Notes**: Take and store free-form notes during your study sessions.
- **Reminders**: Set daily reminders and receive local/push notifications.
- **Roadmap Uploads**: Store and download your PDF/DOC roadmaps securely.
- **PWA Capabilities**: Installable on home screens, offline caching for static assets.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Backend (BaaS)**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM

## Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Create a `.env` file at the root of the project with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   Run the SQL script provided in `supabase_schema.sql` in your Supabase SQL Editor. This will set up all the necessary tables, storage buckets, and Row Level Security (RLS) policies.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. In the Vercel dashboard, add the Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. Vercel will automatically detect the Vite framework and build the project using `npm run build`.

## Architecture Details

This application follows a standard Client-Server architecture heavily relying on BaaS (Backend as a Service). 
- **Security**: Strict Row Level Security (RLS) is enforced at the database level so users can only access their own data. Storage buckets are also secured by RLS.
- **PWA**: The application registers a Service Worker (`service-worker.js`) to cache static assets using a cache-first strategy. A Web App Manifest (`manifest.json`) provides the native-like installation capabilities.
