# School Management System (EduMS) — MERN

Role-based school management app with a React frontend and Express + MongoDB API.

## Stack

- **Frontend:** React 19, Vite, Redux Toolkit, React Router, Tailwind, Framer Motion, Axios
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- **Auth:** email/password → JWT → role + permission checks

## Quick start

### 1. API

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:5001`

If local MongoDB is not running, the server automatically falls back to an **in-memory MongoDB** and seeds demo data.

Optional real MongoDB:

```bash
# docker compose up -d   # if Docker is available
# or install MongoDB and use mongodb://127.0.0.1:27017/edums
```

### 2. Frontend

```bash
npm install
npm run dev
```

App: `http://localhost:3000`  
Env: `VITE_API_URL=http://localhost:5001/api` (see `.env`)

## Demo logins

Password for all accounts: **`demo123`**

| Email | Role |
|---|---|
| student@school.com | Student |
| teacher@school.com | Teacher |
| principal@school.com | Principal |
| admin@school.com | Admin |

## API contract

Full request/response shapes: [docs/API_CONTRACT.md](docs/API_CONTRACT.md)

## What is dynamic now

- Real login with hashed passwords + JWT
- Role-protected routes on the frontend and backend
- Admin CRUD for students, teachers, fees, exams, timetable, profiles
- Teacher knowledge-check CRUD + class attach
- Student attempts scored **on the server** (answer keys not sent to students)
- Dashboards, notifications, and student timetable loaded from APIs
- Motion polish on login, layout transitions, and cards

## Project layout

```
src/                 # React app
server/src/          # Express API
docs/API_CONTRACT.md # API contract
```
