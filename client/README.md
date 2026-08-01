# 🩸 LifelineXK — Frontend

**LifelineXK — Connecting Heroes. Saving Lives.**

The premium React frontend for the LifelineXK Blood Donor Management System.

## Tech Stack
- React 19 + Vite 8
- Tailwind CSS v4
- React Router 7
- Axios (JWT interceptors)
- Framer Motion (animations)
- Lucide React (icons)
- React Hot Toast (notifications)
- Firebase Storage (avatar uploads)

## Getting Started

```bash
npm install
cp .env.example .env   # set VITE_API_URL; optionally VITE_FIREBASE_*
npm run dev            # http://localhost:5173
```

## Production Build

```bash
npm run build          # outputs to dist/
npm run preview        # preview the production build
```

## Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> Firebase values are optional — the app runs fine without them. Avatar uploads
> require a configured Firebase Storage bucket.

## Project Structure

```
src/
├─ api.js               # Axios instance + auth interceptor
├─ firebase.js          # Firebase Storage helper (fail-safe)
├─ App.jsx              # Lazy-loaded routes
├─ main.jsx             # Providers + Toaster
├─ animations/          # Framer Motion variants
├─ components/
│  ├─ ui/               # Reusable UI kit (Button, Card, Input…)
│  └─ *.jsx             # Feature components (Navbar, DonorCard…)
├─ constants/           # Blood groups, Indian states
├─ context/             # AuthContext, NotificationContext
├─ hooks/               # useDebounce
└─ pages/               # All page routes
```

## Deploy

See the root `README.md` for full Firebase Hosting instructions.

```bash
npm i -g firebase-tools
firebase login
firebase deploy
```

