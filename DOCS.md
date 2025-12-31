# Meal Manager SaaS - Documentation

## Project Overview
A multi-tenant Meal Management SaaS built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Designed for messes, hostels, and restaurants to track meals and automate manual billing.

## 🗄️ Database Schema
The database uses PostgreSQL with Prisma ORM.

### Entities
- **Organization**: Represents a mess/hostel (tenant).
- **User**: Members and Admins scoped by `organizationId`.
- **MealSchedule**: Daily menu and pricing for Breakfast, Lunch, and Dinner.
- **MealRecord**: Individual participation logs.
- **Expense**: Daily expenditure tracking.
- **WalletTransaction**: Manual credits (deposits) and automatic debits (meals).

### ER Diagram (Mermaid)
```mermaid
erDiagram
    Organization ||--o{ User : has
    Organization ||--o{ MealSchedule : has
    Organization ||--o{ Expense : has
    Organization ||--o{ WalletTransaction : has
    User ||--o{ MealRecord : creates
    User ||--o{ WalletTransaction : has
    MealSchedule ||--o{ MealRecord : tracks
```

## 🛠️ Setup Guide

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generated string for auth sessions

4. Run Prisma migrations:
   ```bash
   npx prisma db push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mealmanager"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Deployment Instructions
The app is optimized for **Vercel**.

1. Connect your GitHub repository to Vercel.
2. In Vercel Project Settings, add the Environment Variables.
3. Vercel will automatically build and deploy the app.
4. Ensure your PostgreSQL database (e.g., Vercel Postgres or Supabase) is accessible and the URL is correct.

## 🧑‍💻 Functional Workflow
1. **Admin Registration**: Create a new organization and admin account.
2. **Member Management**: Admin adds members to the mess.
3. **Meal Planning**: Admin creates meal schedules with price and menu.
4. **Participation**: Members confirm joining via their dashboard.
5. **Billing**:
   - Admin deposits cash manually to member wallets.
   - System automatically deducts cost upon meal confirmation.
6. **Reporting**: Admin views monthly summaries and exports data.
