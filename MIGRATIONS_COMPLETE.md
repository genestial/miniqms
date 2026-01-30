# ✅ Database Migrations Complete!

## What Was Done

1. ✅ **Schema Pushed** - All database tables created
2. ✅ **Data Seeded** - 27 ISO 9001 clauses added to database

## Important: Vercel Prisma Postgres

Vercel Prisma Postgres uses `PRISMA_DATABASE_URL` (not `DATABASE_URL`).

Your Prisma schema has been updated to use:
- `PRISMA_DATABASE_URL` (for Vercel production)
- Falls back to `DATABASE_URL` (for local development)

## Next Steps

### 1. Create Your First User

You need to create a tenant and admin user. You can do this via:

**Option A: Prisma Studio (Easiest)**
```bash
# Use production database
$url = (Get-Content .env.local | Select-String -Pattern "^PRISMA_DATABASE_URL=").ToString().Split('=',2)[1].Trim().Trim('"').Trim("'")
$env:DATABASE_URL = $url
npx prisma studio
```

Then:
1. Click "Tenant" model
2. Add record:
   - `name`: Your company name
   - `scopeStatement`: (optional)
3. Copy the `id` (tenant ID)
4. Click "User" model
5. Add record:
   - `email`: your-email@example.com
   - `name`: Your name
   - `tenantId`: Paste the tenant ID
   - `role`: ADMIN

**Option B: SQL (Direct)**
Connect to your database and run:
```sql
-- Create tenant (replace with your values)
INSERT INTO tenants (id, name, "scope_statement", "created_at", "updated_at")
VALUES (gen_random_uuid(), 'Your Company Name', 'Your scope', NOW(), NOW());

-- Create user (replace tenant_id with the ID from above)
INSERT INTO users (id, email, name, "tenant_id", role, "created_at")
VALUES (gen_random_uuid(), 'admin@example.com', 'Admin User', 'tenant-id-here', 'ADMIN', NOW());
```

### 2. Deploy to Vercel

Your code is already on GitHub. Vercel should auto-deploy, or you can:

1. Go to Vercel dashboard
2. Your project should show the latest commit
3. Click "Redeploy" if needed

### 3. Set Environment Variables in Vercel

Make sure these are set in Vercel → Settings → Environment Variables:

- ✅ `PRISMA_DATABASE_URL` - Already set (from Prisma Postgres)
- ✅ `POSTGRES_URL` - Already set
- ⚠️ `DATABASE_URL` - Should be set to same as `PRISMA_DATABASE_URL` (for compatibility)
- ⚠️ `NEXTAUTH_SECRET` - Generate with `npm run generate:secret`
- ⚠️ `NEXTAUTH_URL` - Your Vercel URL (e.g., `https://miniqms.vercel.app`)
- ⚠️ `BLOB_READ_WRITE_TOKEN` - From your Blob storage
- ⚠️ `VERCEL_BLOB_STORAGE` - Set to `true`

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Sign in with the user you created
3. Complete onboarding
4. Test file uploads (should use Vercel Blob)

## Troubleshooting

### Can't connect to database
- Verify `PRISMA_DATABASE_URL` is set in Vercel
- Check database is fully provisioned (might take a few minutes)

### Authentication issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your Vercel domain

### File uploads not working
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check `VERCEL_BLOB_STORAGE=true` is set

## You're Almost There! 🎉

Just create your first user and you're ready to go!
