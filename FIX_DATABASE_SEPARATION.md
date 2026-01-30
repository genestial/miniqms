# Fix: Separate Local and Production Databases

## The Problem

You're seeing data from local appear in production because **both environments are using the same database**. This is dangerous and not normal!

## Why This Happens

Your `.env.local` file is likely pointing to the production database URL from Vercel. When you run `npm run dev` locally, it uses that same database.

## The Solution: Set Up Separate Databases

### Step 1: Set Up Local Database

You mentioned you use Laragon. Let's set up a local PostgreSQL database:

1. **Install PostgreSQL in Laragon** (if not already installed):
   - Open Laragon
   - Click "Menu" → "Database" → "PostgreSQL"
   - If not installed, download and install it

2. **Create a local database:**
   - Open Laragon's database tool (HeidiSQL or similar)
   - Create a new database called `miniqms_local`
   - Note the connection details (usually `localhost:5432`)

3. **Update `.env.local`** with local database:
   ```env
   # LOCAL DATABASE (separate from production!)
   DATABASE_URL="postgresql://postgres:password@localhost:5432/miniqms_local?schema=public"
   
   # NextAuth (local)
   NEXTAUTH_SECRET="your-local-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Storage (local - use MinIO or local S3)
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="minioadmin"
   AWS_SECRET_ACCESS_KEY="minioadmin"
   S3_BUCKET_NAME="miniqms-local"
   S3_ENDPOINT="http://localhost:9000"
   ```

4. **Push schema to local database:**
   ```bash
   npm run db:push
   ```

5. **Seed local database (optional):**
   ```bash
   npm run db:seed
   ```

6. **Create a local test user:**
   - Use Prisma Studio: `npx prisma studio`
   - Create a tenant and user in the local database

### Step 2: Verify Production Database is Separate

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` points to the Vercel Prisma Postgres database
3. This should be different from your local `.env.local`

### Step 3: Test the Separation

1. **Start local dev server:**
   ```bash
   npm run dev
   ```

2. **Add a test risk** at `http://localhost:3000/risks`
   - Name it "LOCAL TEST RISK"

3. **Check production** at `https://miniqms.vercel.app/risks`
   - The "LOCAL TEST RISK" should **NOT** appear there

4. **If it still appears**, your `.env.local` is still using production URL!

## Quick Check: Which Database Am I Using?

Run this in your terminal:
```bash
# Windows PowerShell
Get-Content .env.local | Select-String "DATABASE_URL"
```

If it shows a Vercel/cloud database URL, that's the problem!

## Proper Setup Summary

```
Local Development:
├── .env.local
├── DATABASE_URL → localhost:5432/miniqms_local
├── npm run dev → uses local database
└── Data stays on your machine

Production (Vercel):
├── Vercel Environment Variables
├── DATABASE_URL → Vercel Prisma Postgres
├── Deployed app → uses production database
└── Data stays in production
```

## Important Notes

- ⚠️ **Never** use production database URL in `.env.local`
- ⚠️ **Never** commit `.env.local` to git (it's in `.gitignore`)
- ✅ Always test changes locally first
- ✅ Push schema changes to production separately

## Troubleshooting

### "Can't connect to local database"

1. Make sure PostgreSQL is running in Laragon
2. Check the connection string in `.env.local`
3. Verify database `miniqms_local` exists
4. Check PostgreSQL port (usually 5432)

### "Still seeing production data locally"

1. Check `.env.local` has local DATABASE_URL
2. Restart dev server: `npm run dev`
3. Clear Next.js cache: delete `.next` folder and restart

### "Want to copy production data to local for testing"

1. Export from production (using Prisma Studio with prod URL)
2. Import to local database
3. **Never** do the reverse (local → production)!
