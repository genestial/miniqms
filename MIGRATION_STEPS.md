# Running Database Migrations - Step by Step

## Method 1: Using Vercel CLI (Recommended)

### Step 1: Login to Vercel
Run this command - it will open your browser:
```bash
vercel login
```

### Step 2: Link Your Project
```bash
vercel link
```
- Select your account
- Select your project: `miniqms`
- Keep defaults for other questions

### Step 3: Pull Environment Variables
```bash
vercel env pull .env.local
```
This downloads your database URL from Vercel.

### Step 4: Check the Database URL
Vercel Prisma Postgres creates `POSTGRES_URL`, but Prisma needs `DATABASE_URL`.

**Option A:** Add DATABASE_URL in Vercel dashboard:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add new variable:
   - Name: `DATABASE_URL`
   - Value: Copy the value from `POSTGRES_URL`
3. Pull again: `vercel env pull .env.local`

**Option B:** Use POSTGRES_URL directly:
```bash
# Check what's in .env.local
cat .env.local

# If you see POSTGRES_URL, use it:
POSTGRES_URL="your-url" npx prisma db push
POSTGRES_URL="your-url" npm run db:seed
```

### Step 5: Run Migrations
```bash
# Push schema to database
npx prisma db push

# Seed ISO 9001 clauses
npm run db:seed
```

---

## Method 2: Manual (Easier if CLI is complicated)

### Step 1: Get Database URL from Vercel Dashboard
1. Go to Vercel dashboard → Your project
2. **Settings** → **Environment Variables**
3. Find `POSTGRES_URL` (or `DATABASE_URL` if it exists)
4. **Copy the value** (click the eye icon to reveal)

### Step 2: Add DATABASE_URL to Vercel
1. Still in Environment Variables
2. Click **Add New**
3. Name: `DATABASE_URL`
4. Value: Paste the same value from `POSTGRES_URL`
5. Select environments: **Production, Preview, Development**
6. Click **Save**

### Step 3: Run Migrations with Direct URL
Run these commands, replacing `YOUR_DATABASE_URL` with the actual URL:

```bash
# Push schema
DATABASE_URL="YOUR_DATABASE_URL" npx prisma db push

# Seed data
DATABASE_URL="YOUR_DATABASE_URL" npm run db:seed
```

**Example:**
```bash
DATABASE_URL="postgres://user:pass@host:5432/db?sslmode=require" npx prisma db push
```

---

## What These Commands Do

- `npx prisma db push` - Creates all tables in your database
- `npm run db:seed` - Adds ISO 9001 clause data

---

## Verify It Worked

After running migrations, you should see:
- ✅ "Database synchronized successfully"
- ✅ "Seeded X ISO 9001 clauses"

Then you can create your first user and start using the app!
