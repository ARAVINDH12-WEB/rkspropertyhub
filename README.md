# RKS Realty — Fullstack Platform

A production-grade, title-verified real estate platform with a React 19 + TypeScript frontend and a Node.js + Express + TypeScript + Prisma backend.

---

## 🚀 Quick Start

### 1. Run Everything Concurrently (Frontend + Backend)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

### 2. Seed the Database
```bash
npm run seed
```

---

## 🛠 Tech Stack Architecture

### **Frontend** (`/`)
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide Icons
- **API Client**: Service layer communicating with Express backend (`/src/services/api.ts`)

### **Backend** (`/backend`)
- **Runtime**: Node.js, Express, TypeScript (`backend/src/index.ts`)
- **Database & ORM**: SQLite (Development) / PostgreSQL compatible via Prisma ORM
- **Security & Middleware**: Helmet, CORS, Morgan logging, Zod validation, JWT Auth, Bcrypt password hashing

---

## 📡 API Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | User login & returns JWT token | Public |
| `GET` | `/me` | Get current logged-in user profile | Authenticated |

### 🏡 Properties (`/api/v1/properties`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List all properties (with filtering by type, city, price range, verification status) | Public |
| `GET` | `/:slug` | Get single property by slug | Public |
| `POST` | `/` | Create new property listing | Agent / Admin |
| `PUT` | `/:id` | Update property listing | Agent / Admin |
| `DELETE` | `/:id` | Delete property listing | Admin |

### 📅 Site Visits (`/api/v1/site-visits`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Book a free site visit appointment | Public / Buyer |
| `GET` | `/` | Get site visit bookings | Authenticated |
| `PATCH` | `/:id/status` | Update visit status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) | Agent / Admin |

### 📞 Leads & Legal Inquiries (`/api/v1/leads`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Submit inquiry or request title legal report | Public |
| `GET` | `/` | View all leads | Agent / Admin |

---

## 🔑 Demo Login Credentials (Seeded)
- **Admin**: `admin@rksrealty.com` / `password123`
- **Agent**: `rajesh.agent@rksrealty.com` / `password123`
- **Buyer**: `ananya@example.com` / `password123`
