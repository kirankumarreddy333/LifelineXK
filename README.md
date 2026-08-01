# 🩸 LifelineXK — Connecting Heroes. Saving Lives.

A premium, full-stack **MERN** Blood Donor Management System. Built with React + Vite + Tailwind CSS on the frontend, and Node.js + Express + MongoDB on the backend.

---

## ✨ Features

### Authentication & Users
- JWT-based registration / login
- Role-based access (User / Admin)
- Profile management with Firebase Storage avatar uploads
- Verified donor badges & pending approval flow

### Donor Management
- Find donors with live search + filters (State, District, City, Blood Group, Availability)
- Become a donor (multi-field form)
- Admin approval workflow for public visibility

### Requests & Emergencies
- Blood request creation (normal / urgent / emergency)
- Dedicated **Emergency Request Board**
- Nearby donor suggestions
- Notifications for approvals, requests & rewards

### Rewards & Gamification
- Reward points for every donation
- Achievement badges (First Donation, Lifesaver, Champion, Hero, Legend…)
- Donor leaderboard
- Donation history
- Donation eligibility timer (56-day cooldown)

### Hospital Directory
- Curated hospital list with blood-bank availability
- Verified hospital badges

### Admin Dashboard
- Statistics (users, donors, verified donors, open requests)
- Charts (donation trend, request status donut, blood-group distribution)
- Manage users (delete, search)
- Approve donors
- Broadcast notifications to all donors

### UI/UX
- Premium black & white theme (Apple / Linear / Notion inspired)
- Inter + Space Grotesk typography
- Framer Motion animations (fade, slide, scale, stagger)
- Lucide React icons
- React Hot Toast notifications
- Loading skeletons, empty states, error states
- Fully responsive (mobile → desktop)
- SEO meta + Open Graph + favicon
- Lazy-loaded routes & code splitting

---

## 🗂 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite 8, Tailwind CSS v4, React Router 7, Axios, Framer Motion, Lucide React, React Hot Toast, Firebase Storage |
| Backend    | Node.js, Express 5, MongoDB (Mongoose 9), JWT, bcryptjs, express-validator |
| Deploy     | Firebase Hosting (frontend), Render / Railway / any Node host (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
cp .env.example .env    # then edit values (MONGO_URI, JWT_SECRET)
npm install
npm run seed            # seed achievements + hospitals
npm run dev             # http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env    # set VITE_API_URL, optionally VITE_FIREBASE_*
npm install
npm run dev             # http://localhost:5173
```

### 3. Production build

```bash
cd client && npm run build   # outputs to client/dist
```

---

## 🔥 Firebase Setup (Storage + Hosting)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add a **Web App** and copy the config into `client/.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Enable **Storage** and set rules to allow authenticated uploads to `avatars/`.
4. Install Firebase CLI: `npm i -g firebase-tools`
5. `firebase login` then `firebase deploy` — the root `firebase.json` is pre-configured with SPA rewrites + cache headers.

> Avatar uploads gracefully fall back (no crash) until Firebase is configured.

---

## 🌐 Deploying the Backend

- Push the `server/` folder to **Render**, **Railway**, or **Vercel** (Node service).
- Set env vars: `MONGO_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL`.
- Update `client/.env` → `VITE_API_URL` to the deployed backend URL.
- Rebuild & redeploy the frontend.

---

## 📁 Project Structure

```
blood-donor-management-system/
├─ client/                  # React + Vite frontend
│  ├─ public/
│  └─ src/
│     ├─ api.js             # Axios instance + JWT interceptor
│     ├─ firebase.js        # Firebase Storage helper (fail-safe)
│     ├─ animations/        # Framer Motion variants
│     ├─ components/
│     │  ├─ ui/             # Reusable UI kit
│     │  └─ *.jsx           # Feature components (Navbar, DonorCard…)
│     ├─ constants/
│     ├─ context/           # Auth + Notification context
│     ├─ hooks/             # useDebounce
│     └─ pages/             # All routes
├─ server/                  # Express + MongoDB backend
│  ├─ config/               # DB connection
│  ├─ controllers/          # Business logic
│  ├─ data/                 # Seed data (achievements, hospitals, compatibility)
│  ├─ middleware/           # Auth, error handler, upload
│  ├─ models/               # Mongoose schemas
│  ├─ routes/               # API routes
│  ├─ utils/                # Token, validators, async handler, seed
│  └─ server.js             # App entry
├─ firebase.json            # Firebase Hosting config
└─ .firebaserc
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current profile |
| PUT  | `/api/auth/profile` | Update profile |
| POST | `/api/auth/become-donor` | Register as donor |
| GET  | `/api/donors` | List / filter donors |
| GET  | `/api/donors/search/:key` | Search donors |
| GET/POST | `/api/requests` | List / create blood requests |
| GET/POST | `/api/emergency` | Emergency requests |
| GET  | `/api/hospitals` | Hospital directory |
| GET  | `/api/notifications` | User notifications |
| GET  | `/api/rewards/*` | History, achievements, leaderboard |
| GET  | `/api/admin/*` | Admin stats, charts, user/donor management |

---

## 🧪 Test Credentials (local dev)

After running `npm run seed`, an admin user is **not** created automatically. To create one:

```bash
cd server && node -e "
const mongoose=require('mongoose');const User=require('./models/User');
(async()=>{await mongoose.connect(process.env.MONGO_URI);
await User.updateOne({email:'your@email.com'},{role:'admin'});
console.log('Promoted to admin');process.exit(0);})()"
```

---

## 📄 License

ISC — Free to use for saving lives. 🩸

