# Running Database Migrations

## Step 1: Install Vercel CLI (if needed)

```bash
npm i -g vercel
```

Or use npx (no installation needed):
```bash
npx vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

## Step 3: Link Your Project

```bash
vercel link
```

Select your project when prompted.

## Step 4: Pull Environment Variables

```bash
vercel env pull .env.local
```

This downloads your Vercel environment variables (including the database URL) to a local file.

## Step 5: Run Migrations

```bash
# Push schema to database
npx prisma db push

# Seed ISO 9001 clauses
npm run db:seed
```

## Alternative: Direct Connection

If you prefer, you can also:

1. Get the database URL from Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Find `POSTGRES_URL` or `DATABASE_URL`
   - Copy it

2. Run migrations with the URL directly:
   ```bash
   DATABASE_URL="your-url-here" npx prisma db push
   DATABASE_URL="your-url-here" npm run db:seed
   ```

## Important Note

Prisma Postgres creates `POSTGRES_URL`, but Prisma expects `DATABASE_URL`.

**Option A:** In Vercel dashboard, add:
- Variable: `DATABASE_URL`
- Value: Same as `POSTGRES_URL` (or reference it)

**Option B:** Use POSTGRES_URL directly:
```bash
POSTGRES_URL="your-url" npx prisma db push
```
