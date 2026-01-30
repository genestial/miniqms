# Working with Local and Production Environments

This guide explains how to work with both your local development environment and the production environment on Vercel.

## Environment Setup

### Local Development (.env.local)

Your local `.env.local` file should have:
```env
# Local database (Laragon PostgreSQL or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/miniqms"

# NextAuth
NEXTAUTH_SECRET="your-local-secret"
NEXTAUTH_URL="http://localhost:3000"

# Storage (local S3-compatible like MinIO, or AWS S3)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="miniqms-local"
```

### Production (Vercel Environment Variables)

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# Production database (Vercel Prisma Postgres)
DATABASE_URL="postgresql://..." # From Vercel Prisma Postgres
PRISMA_DATABASE_URL="postgresql://..." # Same as DATABASE_URL

# NextAuth
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." # From Vercel Blob storage
```

## Workflow: Making Database Changes

### Step 1: Make Schema Changes Locally

1. Edit `prisma/schema.prisma` with your changes
2. Test locally:
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to local database
   npm run db:push
   
   # Test your changes
   npm run dev
   ```

### Step 2: Push Schema Changes to Production

**Option A: Using Prisma Migrate (Recommended for Production)**

```bash
# 1. Create a migration locally
npm run db:migrate
# This will create a migration file in prisma/migrations/

# 2. Commit and push to GitHub
git add prisma/migrations/
git commit -m "Add database migration: description"
git push

# 3. Vercel will automatically deploy, but you need to run migrations
# Connect to production database and run:
npx prisma migrate deploy
```

**Option B: Using db:push (Faster, but less safe for production)**

1. Get your production database URL from Vercel:
   - Vercel Dashboard → Your Project → Storage → Prisma Postgres
   - Copy the `POSTGRES_URL` or `PRISMA_DATABASE_URL`

2. Run push directly (temporarily set DATABASE_URL):
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="your-production-database-url"
   npx prisma db push
   
   # Or create a .env.production file (don't commit this!)
   # Then use:
   dotenv -e .env.production -- npx prisma db push
   ```

**⚠️ Warning:** `db:push` directly modifies the production database. Use with caution!

### Step 3: Verify Changes

1. Check Vercel deployment logs to ensure build succeeded
2. Test your production app to verify schema changes work
3. Use Prisma Studio to inspect production database (see below)

## Viewing Production Database

### Using Prisma Studio

1. Get production database URL from Vercel
2. Temporarily set it:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="your-production-database-url"
   npx prisma studio
   ```

3. Open http://localhost:5555 in your browser
4. **⚠️ Be careful!** You're viewing the production database

### Using Vercel Dashboard

- Vercel Dashboard → Your Project → Storage → Prisma Postgres
- Click "Open" to view database in Vercel's interface

## Best Practices

### 1. Always Test Locally First

```bash
# Make changes to schema.prisma
npm run db:push          # Test locally
npm run dev              # Test application
# Fix any issues before pushing to production
```

### 2. Use Migrations for Production

Migrations are safer because:
- They're versioned and tracked
- Can be rolled back if needed
- Better for team collaboration
- Safer for production databases

### 3. Keep Environments Separate

- **Never** use production database URL in `.env.local`
- **Never** commit `.env.local` or `.env.production` to git
- Use Vercel's environment variables for production secrets

### 4. Database Seeding

**Local:**
```bash
npm run db:seed
```

**Production (one-time setup):**
```bash
# Get production DATABASE_URL from Vercel
$env:DATABASE_URL="your-production-database-url"
npm run db:seed
```

## Common Workflows

### Adding a New Field

1. Edit `prisma/schema.prisma`
2. Test locally: `npm run db:push`
3. Create migration: `npm run db:migrate --name add_new_field`
4. Commit and push: `git add . && git commit -m "Add new field" && git push`
5. Deploy migration to production (see Step 2 above)

### Changing a Field Type

1. Edit `prisma/schema.prisma`
2. Test locally: `npm run db:push` (may show warnings about data loss)
3. **Backup production data first!**
4. Create migration: `npm run db:migrate --name change_field_type`
5. Review migration file in `prisma/migrations/`
6. Commit and push
7. Deploy to production carefully

### Adding a New Model

1. Edit `prisma/schema.prisma`
2. Test locally: `npm run db:push`
3. Create migration: `npm run db:migrate --name add_new_model`
4. Commit and push
5. Deploy to production

## Troubleshooting

### "Prisma Client is out of date"

**Local:**
```bash
npm run db:generate
```

**Production:**
- Vercel should auto-generate during build (we added this to `package.json`)
- If issues persist, check Vercel build logs

### "Can't connect to database"

1. Check DATABASE_URL is correct
2. Check database is running (local) or accessible (production)
3. Check firewall/network settings
4. Verify credentials

### "Migration failed"

1. Check migration file in `prisma/migrations/`
2. Review error message
3. May need to manually fix database state
4. Consider rolling back if possible

## Quick Reference

```bash
# Local Development
npm run dev                    # Start dev server
npm run db:generate            # Generate Prisma Client
npm run db:push                # Push schema to local DB
npm run db:seed                # Seed local database

# Production (after getting DATABASE_URL from Vercel)
$env:DATABASE_URL="prod-url"   # Set production URL
npx prisma db push             # Push schema (careful!)
npx prisma migrate deploy      # Deploy migrations (safer)
npx prisma studio              # View production DB
```

## Security Notes

- ⚠️ **Never commit** `.env.local` or production database URLs
- ⚠️ **Always backup** production data before major schema changes
- ⚠️ **Test migrations** locally first
- ⚠️ **Review migration files** before deploying to production
