# Fix: Update .env.local to Use Local Database

## The Problem

Your `.env.local` file is still pointing to the production Prisma database (`db.prisma.io`), which is why data from local appears in production.

## The Solution

You need to update `.env.local` to point to your local `miniqms_local` database.

## Step-by-Step Fix

### Step 1: Open .env.local

Open the file `.env.local` in your project root directory.

### Step 2: Find the DATABASE_URL Line

Look for a line that starts with `DATABASE_URL=`. It probably looks like:
```env
DATABASE_URL="postgres://...@db.prisma.io:5432/postgres?sslmode=require"
```

### Step 3: Replace It

Replace that line with:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/miniqms_local?schema=public"
```

**Replace `YOUR_PASSWORD` with your PostgreSQL password.**

Common passwords to try:
- Empty (no password): `postgresql://postgres@localhost:5432/miniqms_local?schema=public`
- `root`: `postgresql://postgres:root@localhost:5432/miniqms_local?schema=public`
- `postgres`: `postgresql://postgres:postgres@localhost:5432/miniqms_local?schema=public`

### Step 4: Comment Out or Remove PRISMA_DATABASE_URL

If you see a `PRISMA_DATABASE_URL` line, comment it out or remove it for local development:
```env
# PRISMA_DATABASE_URL="..." # Only needed for production
```

### Step 5: Save the File

Save `.env.local`

### Step 6: Restart Your Dev Server

**Important:** You MUST restart your dev server for the changes to take effect!

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 7: Test the Connection

Run this to verify it connects to local database:
```bash
npm run db:push
```

If it works, you should see:
```
✔ Generated Prisma Client
✔ Pushed to database
```

### Step 8: Verify Separation

1. **Add a test risk** at `http://localhost:3000/risks`
   - Name it: "LOCAL TEST - Should NOT appear in production"

2. **Check production** at `https://miniqms.vercel.app/risks`
   - The "LOCAL TEST" risk should **NOT** appear there ✅

## Finding Your PostgreSQL Password

If you don't know your PostgreSQL password:

1. **Try connecting in HeidiSQL** with different passwords:
   - Empty (no password)
   - `root`
   - `postgres`

2. **Check Laragon settings:**
   - Open Laragon
   - Check PostgreSQL settings
   - Look for password configuration

3. **If all else fails**, you can reset the password:
   - In HeidiSQL, connect to `postgres` database
   - Run: `ALTER USER postgres WITH PASSWORD 'newpassword';`
   - Then use that password in `.env.local`

## Complete .env.local Example

Here's what your `.env.local` should look like:

```env
# Local Database (separate from production!)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/miniqms_local?schema=public"

# NextAuth (local)
NEXTAUTH_SECRET="your-local-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Storage (local - use MinIO or local S3)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
S3_BUCKET_NAME="miniqms-local"
S3_ENDPOINT="http://localhost:9000"

# Production URLs (commented out for local dev)
# PRISMA_DATABASE_URL="..." # Only for production
```

## Troubleshooting

### "Can't connect to database"

1. Make sure PostgreSQL is running in Laragon
2. Check the password is correct
3. Verify the database `miniqms_local` exists
4. Check the port (should be `5432`)

### "Still seeing production data"

1. **Double-check `.env.local`** - make sure it has `localhost:5432/miniqms_local`
2. **Restart dev server** - changes only take effect after restart
3. **Clear Next.js cache:**
   ```bash
   # Delete .next folder
   rm -r .next  # or on Windows: Remove-Item -Recurse .next
   npm run dev
   ```

### "Password authentication failed"

Try different passwords or reset it (see above).

## Important Notes

- ⚠️ **Never commit** `.env.local` to git (it's in `.gitignore`)
- ⚠️ **Always restart** dev server after changing `.env.local`
- ✅ **Test locally first** before pushing to production
- ✅ **Keep environments separate** - local and production should never share a database
