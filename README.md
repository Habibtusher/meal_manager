# 🍽️ Meal Manager

A **multi-tenant Meal Management SaaS** built for messes, hostels, and restaurants. It automates meal tracking, billing, and expense reporting — replacing tedious manual calculations with a clean, role-based dashboard.

## ✨ Features

### 🏢 Multi-Tenant Architecture
- Each organization (mess/hostel) is fully isolated — members only see data for their own organization.
- Supports `ADMIN`, `MEMBER`, and `SUPER_ADMIN` roles.
- Admins can register a new organization and onboard members independently.

### 🔐 Authentication
- Secure email/password login with **NextAuth v5**.
- Role-based route protection; users are automatically redirected to their respective dashboard (Admin / Member).
- Forgot password flow included.
- Passwords are hashed with **bcryptjs**.

### 👑 Admin Dashboard
- **Overview**: Key stats — active members, total meals, total expenses, and current meal rate at a glance.
- **Meal Management**: Create daily meal schedules (Breakfast, Lunch, Dinner) with menu and price. Activate or deactivate schedules.
- **Member Management**: View all members, their wallet balances, room rent, and active status.
- **Expense Tracking**: Log daily organization expenses by category. View running totals.
- **Shared Costs**: Record shared costs (e.g., utility bills, supplies) and auto-allocate them across members.
- **Wallet Transactions**: Manually deposit money to member wallets. All debits are automated upon meal confirmation. Full transaction history per member.
- **Reports**: Monthly settlement summary per member — meals consumed, meal cost, shared/room cost, total cost, total deposited, and adjusted balance. Exportable reports.

### 👤 Member Dashboard
- **My Dashboard**: Personal overview — available wallet balance, total meals this month, monthly cost, and daily meal totals.
- **Meal History**: Full log of past meal participation with date, type, and status.
- **Expenses**: View the organization's expense breakdown relevant to the member.
- **Profile**: Update personal details, room rent, and account settings.
- **Support Tickets**: Members can raise support tickets directly from their dashboard.

### 👁️ Super Admin Panel
- Global oversight across all organizations.
- Stats: total organizations, total users, meals recorded, and support tickets.
- Manage and view all organizations.
- Support ticket management across all tenants.

### 💰 Wallet & Billing
- Each member has a wallet balance.
- **Credits**: Admin manually deposits funds.
- **Debits**: Automatically triggered when a member confirms a meal.
- Full transaction log with balance-after snapshot for auditing.

### 📊 Reports & Exports
- Monthly settlement reports with per-member breakdown.
- Shared cost and room rent factored into totals.
- Data export for billing and reconciliation.

### 🌐 Internationalization (i18n)
- Supports **English** and **Bengali (বাংলা)** — switchable via the language toggle in the sidebar.
- Built with **next-intl**.

### 🎨 UI & UX
- Clean, responsive UI built with **Tailwind CSS v4**.
- Dark/light mode support via **next-themes**.
- Toast notifications via **react-hot-toast**.
- Interactive charts using **Recharts**.
- Icons from **Lucide React**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | NextAuth v5 + Prisma Adapter |
| Styling | Tailwind CSS v4 |
| i18n | next-intl |
| Charts | Recharts |
| Validation | Zod |
| Deployment | Netlify / Vercel |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    Organization ||--o{ User : has
    Organization ||--o{ MealSchedule : has
    Organization ||--o{ Expense : has
    Organization ||--o{ WalletTransaction : has
    Organization ||--o{ SharedCost : has
    User ||--o{ MealRecord : creates
    User ||--o{ WalletTransaction : has
    User ||--o{ SharedCostAllocation : has
    User ||--o{ SupportTicket : raises
    MealSchedule ||--o{ MealRecord : tracks
    SharedCost ||--o{ SharedCostAllocation : splits
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/meal_manager.git
   cd meal_manager
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**

   Create a `.env` file at the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mealmanager"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧑‍💻 Workflow

1. **Admin Registration** — Create a new organization and admin account.
2. **Member Onboarding** — Admin invites and adds members to the organization.
3. **Meal Planning** — Admin creates daily meal schedules with menu and pricing.
4. **Meal Participation** — Members confirm their participation in scheduled meals.
5. **Automated Billing** — Wallet is debited automatically upon confirmation.
6. **Expense Logging** — Admin logs daily expenses; shared costs are allocated across members.
7. **Monthly Report** — Admin exports the settlement summary for billing.

---

## 📁 Project Structure

```
├── app/
│   ├── (dashboard)/
│   │   ├── admin/          # Admin pages (dashboard, meals, members, expenses, wallet, reports)
│   │   ├── member/         # Member pages (dashboard, history, expenses, profile)
│   │   └── super-admin/    # Super Admin pages (dashboard, organizations, tickets)
│   ├── api/                # API route handlers
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── components/             # Reusable UI components
├── lib/                    # Utilities, auth config, DB client, actions
├── messages/               # i18n translation files (en.json, bn.json)
└── prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Database seed
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables in the Vercel project settings.
4. Vercel will build and deploy automatically.

### Netlify
A `netlify.toml` config is included for Netlify deployments.

> Ensure your PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres) is accessible from the deployment environment.

---

## 📄 License

This project is private and not licensed for public distribution.
