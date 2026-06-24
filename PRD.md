# AI Coding Prompt: IELTS Prep App (Production-Grade PWA)

## Project Overview

Develop a production-grade Progressive Web App (PWA) named "IELTS Prep App" to serve as a daily reminder and study planner for IELTS candidates. The app will allow users to manually plan their 1, 2, and 3-month study roadmaps, take notes, and upload PDF/DOC formatted roadmaps for reference. The application must be mobile-first, highly performant, secure, and deployable as a PWA for a native-like experience on mobile devices.

## Target Audience

IELTS candidates requiring a structured approach to their preparation, including daily reminders, planning, and note-taking capabilities.

## Core Features

1.  **User Authentication**: Secure user registration and login (email/password, Google OAuth).
2.  **Study Plan Management**: Users can create, view, edit, and delete 1, 2, or 3-month study plans.
3.  **Daily Reminders**: Users can set, view, edit, and delete daily reminders associated with their study plans.
4.  **Note-Taking**: Users can create, view, edit, and delete free-form notes.
5.  **Roadmap Upload**: Users can upload PDF and DOC files containing their study roadmaps for storage and viewing.
6.  **PWA Capabilities**: Offline access, home screen installation, and push notifications for reminders.

## Technology Stack

*   **Frontend**: React (with Vite), TypeScript, TailwindCSS
*   **Backend/Database/Auth/Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
*   **Hosting/CI/CD**: Vercel
*   **Notifications**: Web Push API

## System Architecture

Refer to the `system_architecture.md` document for a detailed breakdown, including the Mermaid diagram, component descriptions, and data models. Key aspects include:

*   Client-server architecture with PWA frontend interacting with Supabase BaaS.
*   Vercel for hosting and continuous deployment.
*   Service Worker for PWA features.
*   Supabase for PostgreSQL database, authentication, and file storage.

## Detailed Implementation Requirements

### 1. Project Setup and Initialization

*   Initialize a new React project using Vite with TypeScript and TailwindCSS.
*   Configure `manifest.json` for PWA, including app name, short name, start URL, display mode (`standalone`), theme colors, and icons (192x192, 512x512).
*   Implement `service-worker.js` for caching static assets (`index.html`, `manifest.json`, icons, main JS/CSS bundles) and handling push notifications.
*   Register the service worker in `index.html`.
*   Set up Vercel deployment configuration (if applicable, for local testing, otherwise assume Vercel will be connected to a Git repo).

### 2. User Interface (UI) / User Experience (UX)

*   **Responsive Design**: Ensure the app is fully responsive and optimized for mobile devices using TailwindCSS.
*   **Intuitive Navigation**: Clear and easy-to-use navigation for study plans, notes, reminders, and uploaded files.
*   **Forms**: User-friendly forms for creating/editing plans, notes, and reminders with appropriate validation.
*   **File Upload Interface**: A simple interface for selecting and uploading PDF/DOC files.
*   **Loading States**: Implement loading indicators for asynchronous operations (e.g., data fetching, file uploads).
*   **Error Messages**: Provide clear and actionable error messages to the user.

### 3. Frontend Development (React, TypeScript, TailwindCSS)

*   **Component-Based Structure**: Organize the application into reusable React components.
*   **State Management**: Use React Context API or a lightweight library (e.g., Zustand, Jotai) for global state management.
*   **Routing**: Implement client-side routing using React Router.
*   **Supabase Client Integration**: Initialize and configure the Supabase client (`@supabase/supabase-js`) for interacting with the backend.
*   **Authentication Flows**: Implement login, registration, and logout functionalities. Handle session management.
*   **Data Display**: Render study plans, notes, and reminders from Supabase.
*   **Form Handling**: Manage form inputs and submissions for creating/updating data.
*   **File Upload**: Implement logic to select files, upload them to Supabase Storage, and store file metadata in the `uploaded_roadmaps` table.
*   **Push Notifications**: Implement client-side logic to request notification permission and register for push notifications via the service worker. Display notifications for scheduled reminders.

### 4. Backend Development (Supabase)

*   **Database Schema**: Create the following tables with the specified columns and constraints. Ensure all `id` columns are UUIDs and `created_at`/`updated_at` columns have appropriate defaults.
    *   `users` (linked to `auth.users`)
    *   `study_plans`
    *   `notes`
    *   `reminders`
    *   `uploaded_roadmaps`
*   **Row Level Security (RLS)**: Implement strict RLS policies for all tables to ensure users can only access and modify their own data. For `uploaded_roadmaps`, ensure RLS also restricts access to files in Supabase Storage based on `user_id`.
*   **Authentication**: Leverage Supabase Auth for all user authentication needs. Configure Google OAuth as an option.
*   **Storage**: Set up a dedicated Supabase Storage bucket for `uploaded_roadmaps` with appropriate security policies.
*   **API Keys**: Provide instructions for securely managing Supabase API keys (e.g., via Vercel environment variables).

### 5. PWA and Offline Support

*   **Service Worker**: The `service-worker.js` must implement:
    *   **Caching Strategy**: Cache-first strategy for static assets (`index.html`, `manifest.json`, icons, main JS/CSS bundles).
    *   **Fetch Interception**: Intercept network requests to serve cached assets when offline.
    *   **Push Event Handling**: Listen for `push` events and display notifications using `self.registration.showNotification()`.
*   **Manifest**: Ensure `manifest.json` is correctly linked in `index.html`.

### 6. Security

*   **RLS**: As detailed above, critical for data isolation.
*   **Authentication**: Use Supabase Auth best practices.
*   **API Key Management**: Emphasize environment variables for sensitive keys.
*   **Input Validation**: Implement both client-side and server-side (Supabase policies/functions) validation.
*   **CORS**: Correctly configure Supabase CORS settings.
*   **HTTPS**: Ensure all communication is over HTTPS.
*   **PWA Security**: Adhere to PWA security best practices.

### 7. Performance and Scalability

*   **PWA Caching**: Optimize service worker caching.
*   **CDN**: Leverage Vercel's CDN.
*   **Database Indexing**: Suggest appropriate indexes for frequently queried columns.
*   **Efficient Queries**: Write optimized Supabase queries.

### 8. Error Handling and Logging

*   Implement robust error handling across the frontend and integrate with Supabase error responses.
*   Provide user-friendly error messages.

## Deliverables

*   Complete, production-ready source code for the IELTS Prep PWA.
*   Clear instructions for setting up Supabase (database, RLS, storage buckets, auth providers).
*   Instructions for deploying to Vercel.
*   A `README.md` file detailing project setup, running locally, deployment, and key architectural decisions.

## Constraints and Assumptions

*   The app will be a PWA, not a native iOS/Android app store application.
*   PDF/DOC uploads are for storage and viewing only; no automated content extraction is required in this initial build.
*   Focus on the core features outlined; advanced features (e.g., AI parsing, analytics) are out of scope for this prompt.
*   The solution should primarily use free tiers of the specified services.

## Example Code Snippets (for guidance, not exhaustive)

### `manifest.json`

```json
{
  "name": "IELTS Prep Tracker",
  "short_name": "IELTS",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### `service-worker.js` (basic structure)

```javascript
const CACHE_NAME = 'ielts-prep-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets like CSS, JS bundles here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'IELTS Reminder';
  const options = {
    body: data.body || 'Time to study!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
```

### Supabase Client Initialization (React component/hook)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example usage for auth
// async function signInWithGoogle() {
//   const { user, session, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//   });
// }

// Example usage for data fetch
// async function getStudyPlans(userId: string) {
//   const { data, error } = await supabase
//     .from('study_plans')
//     .select('*')
//     .eq('user_id', userId);
//   if (error) console.error('Error fetching study plans:', error);
//   return data;
// }
```

This prompt provides a comprehensive guide for an AI coding assistant to generate the IELTS Prep App, ensuring all technical, functional, and non-functional requirements are met for a production-grade PWA. The `system_architecture.md` document should be provided alongside this prompt for full context.
