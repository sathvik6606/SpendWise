<div align="center">
  <h1>💰 SpendWise</h1>
  <p><strong>A modern, full-stack personal finance tracker built with the MERN stack.</strong></p>
  <p>Track expenses, set budgets, manage savings goals, and gain AI-like insights — all in one place.</p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🌟 Overview

**SpendWise** is a production-ready personal finance management application that helps users take control of their money. It features a dark/light mode, real-time currency switching, data visualizations, recurring bills management, and a command-palette-style global search — all built on a secure JWT-authenticated REST API backed by MongoDB Atlas.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Real-time financial summary with income, expenses, savings KPIs and charts |
| 💳 **Transactions** | Full CRUD with filtering, CSV export/import, and a detail slide-over panel |
| 📁 **Budgets** | Category-based monthly budgets with visual progress indicators and alerts |
| 🎯 **Goals** | Savings goal tracker with deadline, progress bar, and fund contributions |
| 🧾 **Bills** | Recurring bill management with due dates and paid/upcoming status |
| 📈 **Analytics** | Income vs expense line charts, category donut charts, and ranked spend lists |
| 💡 **Insights** | AI-style textual financial insights derived from transaction data |
| 📅 **Calendar** | Date picker showing financial events across transactions, goals, and bills |
| 🔔 **Notifications** | In-app notification centre with mark-as-read and delete actions |
| 🔍 **Command Palette** | `⌘K` global search across transactions, budgets, and goals |
| 🌍 **Currency Switching** | Real-time currency change persisted to the user profile |
| 🌙 **Dark / Light Mode** | System-aware theme with manual override |
| 🔐 **Authentication** | Secure JWT-based registration and login |
| 🗂️ **Profile Settings** | Update name, email, password, currency, and timezone |

---

## 📸 Screenshots

> Add screenshots of the application here after deployment.

| Dashboard | Transactions | Analytics |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Goals | Budgets | Notifications |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — build tool and dev server
- **Tailwind CSS 4** — utility-first styling
- **Recharts** — data visualization
- **React Router DOM 7** — client-side routing
- **Axios** — HTTP client
- **React Hook Form** — form management
- **React Hot Toast** — notifications
- **Lucide React** — icon library

### Backend
- **Node.js + Express 5** — REST API server
- **Mongoose 9** — MongoDB ODM
- **JSON Web Token (JWT)** — stateless authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variable management
- **CORS** — cross-origin resource sharing

### Infrastructure
- **MongoDB Atlas** — cloud database
- **Vercel** — frontend hosting
- **Render** — backend hosting

---

## 📁 Project Structure

```
trackerexpense/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route handler logic
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── scripts/
│   │   └── seedDemoData.js     # Demo data seeder
│   ├── utils/
│   │   └── generateToken.js    # JWT generator
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # App entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Navbar, NotificationCenter
│   │   │   ├── routing/        # ProtectedRoute
│   │   │   ├── transactions/   # TransactionForm
│   │   │   ├── budgets/        # BudgetForm
│   │   │   ├── goals/          # GoalForm, ContributionForm
│   │   │   └── ui/             # Reusable UI components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useCurrency.js  # Global currency hook
│   │   ├── lib/
│   │   │   └── utils.js        # Utility functions
│   │   ├── pages/              # Route-level page components
│   │   ├── App.jsx
│   │   └── main.jsx            # Axios baseURL configured here
│   ├── .env.example
│   ├── vercel.json             # Vercel SPA rewrite rules
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- A [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/spendwise.git
cd spendwise
```

### 2. Set up the Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev
```

### 3. Set up the Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### 4. Seed Demo Data (optional)

```bash
cd backend
npm run demo
```

This populates a demo account (`demo@spendwise.app` / `demo12345`) with 6 months of realistic financial data.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/spendwise` |
| `JWT_SECRET` | Secret key for signing JWTs | `a-long-random-secret-string` |
| `PORT` | Server port (Render sets this automatically) | `4000` |
| `FRONTEND_URL` | Your Vercel frontend URL (for CORS) | `https://spendwise.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Your Render backend URL | `https://spendwise-api.onrender.com` |

---

## ☁️ Deployment

### Deploy Frontend to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repository.
3. Set **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_URL` → your Render backend URL.
5. Click **Deploy**.

> The `vercel.json` file in the frontend directory handles SPA routing automatically.

### Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service** → connect your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — your JWT secret key
   - `FRONTEND_URL` — your Vercel frontend URL (e.g. `https://spendwise.vercel.app`)
6. Click **Create Web Service**.

### MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Go to **Database Access** → add a database user with a password.
3. Go to **Network Access** → add `0.0.0.0/0` to allow access from Render.
4. Click **Connect** → **Drivers** → copy the connection string.
5. Replace `<password>` with your database user's password.

---

## 🔮 Future Improvements

- [ ] AI-powered spending recommendations using OpenAI API
- [ ] Plaid or Razorpay bank account integration
- [ ] Multi-currency portfolio tracking
- [ ] Mobile app (React Native)
- [ ] Recurring transaction automation
- [ ] Budget sharing between family members
- [ ] PDF report export
- [ ] Two-factor authentication (2FA)
- [ ] PWA support for offline usage

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ by <strong>Sathvik Sai</strong></p>
</div>
