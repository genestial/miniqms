# Vercel Deployment Guide

This guide will help you deploy Mini QMS to Vercel with Vercel Blob storage.

## Best Workflow: GitHub → Vercel

**Recommended approach:**
1. Push code to GitHub first
2. Connect GitHub repo to Vercel
3. Vercel will auto-deploy on every push

This is better than creating a Vercel project first because:
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Easy rollbacks
- ✅ Better CI/CD integration

## Step 1: Push to GitHub

### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Mini QMS MVP"
```

### Add GitHub Remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/miniqms.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Step 2: Set Up Vercel Blob Storage

### In Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project (or create new)
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Blob**
6. Name it: `miniqms-blob` (or any name you prefer)
7. Click **Create**

### Get Your Blob Token

1. In your Blob storage settings
2. Find **BLOB_READ_WRITE_TOKEN**
3. Copy this token (you'll need it for environment variables)

## Step 3: Create Vercel Project from GitHub

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `miniqms` repository
4. Click **Import**

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts to link your GitHub repo.

## Step 4: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/miniqms?schema=public

# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-project.vercel.app

# Vercel Blob (automatically available, but you can set explicitly)
BLOB_READ_WRITE_TOKEN=your-blob-token-from-step-2
VERCEL_BLOB_STORAGE=true
```

### Getting NEXTAUTH_SECRET

Run locally:
```bash
npm run generate:secret
```

Copy the generated secret to Vercel environment variables.

### Getting DATABASE_URL

You'll need a PostgreSQL database. Options:

**Option 1: Vercel Postgres (Easiest)**
1. In Vercel dashboard → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Copy the connection string to `DATABASE_URL`

**Option 2: External Database**
- Use services like:
  - Supabase (free tier available)
  - Neon (free tier available)
  - Railway
  - Render
  - Your own PostgreSQL server

## Step 5: Deploy

### Automatic Deployment

Once connected to GitHub, Vercel will:
- Deploy automatically on every push to `main`
- Create preview deployments for pull requests

### Manual Deployment

If you need to deploy manually:
```bash
vercel --prod
```

## Step 6: Run Database Migrations

After first deployment, you need to run migrations:

### Option A: Via Vercel CLI

```bash
vercel env pull .env.local  # Pull environment variables
npx prisma db push
npx prisma db seed
```

### Option B: Via Vercel Postgres Dashboard

1. Go to your Postgres database in Vercel
2. Use the SQL editor to run migrations manually
3. Or use Prisma Studio: `npx prisma studio`

### Option C: Add Migration Script to Vercel

Create `vercel.json`:

```json
{
  "buildCommand": "npm run db:generate && npm run build",
  "installCommand": "npm install"
}
```

## Step 7: Create Initial User

After deployment, create your first user:

1. Use Prisma Studio locally (with production DATABASE_URL):
   ```bash
   DATABASE_URL="your-production-url" npx prisma studio
   ```

2. Or use SQL directly in your database dashboard

3. Create tenant and user (see SETUP.md Step 4)

## Step 8: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Sign in with your created user
3. Complete onboarding
4. Test file uploads (should use Vercel Blob)

## Environment Variables Summary

### Development (.env.local)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="..."
VERCEL_BLOB_STORAGE="true"
```

### Production (Vercel Dashboard)
```env
DATABASE_URL="postgresql://..." (production database)
NEXTAUTH_SECRET="..." (same or different)
NEXTAUTH_URL="https://your-project.vercel.app"
BLOB_READ_WRITE_TOKEN="..." (from Vercel Blob)
VERCEL_BLOB_STORAGE="true"
```

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` scripts are correct

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- For Vercel Postgres, connection should work automatically

### Blob Storage Not Working

- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check `VERCEL_BLOB_STORAGE=true` is set
- Ensure `@vercel/blob` package is installed

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your Vercel domain
- Ensure cookies can be set (check domain settings)

## Continuous Deployment

Once set up:
- Every push to `main` → Production deployment
- Every pull request → Preview deployment
- Automatic rollback on deployment failure

## Next Steps

- Set up custom domain (optional)
- Configure database backups
- Set up monitoring and alerts
- Configure preview deployments for staging

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull .env.local
```

Happy deploying! 🚀
