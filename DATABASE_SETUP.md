# PostgreSQL Database Setup Guide

## For Vercel Deployment (Production)

You need a **cloud PostgreSQL database** - Vercel can't connect to your local database.

### Option 1: Vercel Postgres (Recommended - Easiest) ⭐

**Best for:** Vercel deployments, seamless integration

1. In Vercel dashboard → Your project
2. Go to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it: `miniqms-db`
5. Click **Create**
6. Vercel automatically:
   - Creates the database
   - Adds `POSTGRES_URL` environment variable
   - Sets up connection pooling
   - Handles backups

**Pros:**
- ✅ Zero configuration
- ✅ Automatically connected to your Vercel project
- ✅ Free tier: 256 MB storage, 60 hours compute/month
- ✅ Automatic backups
- ✅ Connection pooling included

**Cons:**
- ⚠️ Tied to Vercel (can't use elsewhere easily)

**Cost:** Free tier available, then pay-as-you-go

---

### Option 2: Supabase (Best Free Tier) 🆓

**Best for:** Free tier, great developer experience

1. Go to https://supabase.com
2. Sign up (free)
3. Click **New Project**
4. Fill in:
   - Name: `miniqms`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Click **Create new project**
6. Wait ~2 minutes for setup
7. Go to **Settings** → **Database**
8. Find **Connection string** → **URI**
9. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`)

**Pros:**
- ✅ Generous free tier (500 MB database, 2 GB bandwidth)
- ✅ Great dashboard and tools
- ✅ Can use for other projects
- ✅ Built-in auth (if you want to use it later)

**Cons:**
- ⚠️ Separate service (not integrated with Vercel)

**Cost:** Free tier is very generous, then $25/month

---

### Option 3: Neon (Serverless PostgreSQL) 🚀

**Best for:** Serverless, auto-scaling

1. Go to https://neon.tech
2. Sign up (free)
3. Click **Create Project**
4. Fill in:
   - Name: `miniqms`
   - Region: Choose closest
5. Click **Create Project**
6. Copy the connection string from dashboard

**Pros:**
- ✅ Serverless (scales to zero when not used)
- ✅ Free tier: 0.5 GB storage
- ✅ Branching (like git for databases)
- ✅ Fast setup

**Cons:**
- ⚠️ Newer service (less established)

**Cost:** Free tier, then pay-as-you-go

---

### Option 4: Siteground (If Available)

Check if your Siteground account supports PostgreSQL:

1. Log into Siteground cPanel
2. Look for "PostgreSQL" or "Databases"
3. If available, create a database and user
4. Get connection details

**Note:** Many shared hosting providers don't support PostgreSQL (only MySQL). Check first!

---

## For Local Development

### Using Laragon with PostgreSQL

Laragon can run PostgreSQL! Here's how:

1. **Install PostgreSQL in Laragon:**
   - Open Laragon
   - Click **Menu** → **Tools** → **Quick add**
   - Search for "PostgreSQL"
   - Install it

2. **Or install PostgreSQL separately:**
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember the password you set for `postgres` user

3. **Create local database:**
   ```sql
   -- Connect to PostgreSQL (via pgAdmin or command line)
   CREATE DATABASE miniqms_dev;
   ```

4. **Update your local `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/miniqms_dev?schema=public"
   ```

5. **Run migrations locally:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## Recommended Setup Strategy

### Development (Local)
- Use Laragon PostgreSQL or local PostgreSQL
- `.env` file with local database URL
- Test everything locally first

### Production (Vercel)
- Use **Vercel Postgres** (easiest) or **Supabase** (best free tier)
- Environment variables in Vercel dashboard
- Separate database for production

### Environment Variables Setup

**Local `.env` file:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/miniqms_dev?schema=public"
```

**Vercel Environment Variables:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/miniqms?schema=public"
```

Vercel will use the production database automatically when deployed.

---

## Quick Start: Vercel Postgres

1. In Vercel dashboard → Your project
2. **Storage** tab → **Create Database** → **Postgres**
3. Name: `miniqms-db` → **Create**
4. Wait ~30 seconds
5. Go to **Settings** → **Environment Variables**
6. You'll see `POSTGRES_URL` automatically added
7. Add this to your `.env.local` for local development (optional):
   ```env
   DATABASE_URL="${POSTGRES_URL}"
   ```

That's it! Vercel handles everything.

---

## Migration Steps After Database Setup

Once you have your production database:

1. **Get connection string:**
   - Vercel Postgres: Use `POSTGRES_URL` from Vercel
   - Supabase/Neon: Copy from their dashboard

2. **Add to Vercel environment variables:**
   - Go to Vercel project → **Settings** → **Environment Variables**
   - Add: `DATABASE_URL` = your connection string

3. **Run migrations:**
   ```bash
   # Option A: Via Vercel CLI
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed

   # Option B: Direct connection (temporarily)
   DATABASE_URL="your-production-url" npx prisma db push
   DATABASE_URL="your-production-url" npx prisma db seed
   ```

4. **Create first user:**
   - Use Prisma Studio with production URL:
   ```bash
   DATABASE_URL="your-production-url" npx prisma studio
   ```

---

## My Recommendation

**For you:** Start with **Vercel Postgres** because:
- ✅ Easiest setup (one click)
- ✅ Already integrated
- ✅ Free tier is enough to start
- ✅ No separate account needed
- ✅ Automatic backups

You can always migrate to Supabase or Neon later if needed!

---

## Troubleshooting

### "Connection refused"
- Check database is running (for local)
- Verify connection string is correct
- Check firewall/network settings

### "Database does not exist"
- Create the database first
- Verify database name in connection string

### "Authentication failed"
- Check username and password
- For Vercel Postgres, use the provided `POSTGRES_URL` exactly

### Laragon PostgreSQL not working
- Make sure PostgreSQL service is running in Laragon
- Check port 5432 is not blocked
- Try restarting Laragon
