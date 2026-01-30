# Fix: Database Still Using Production (Caching Issue)

## The Problem

Even though your `.env.local` points to local database, the app is still using production. This is likely a **caching issue** - Next.js cached the old database connection.

## Solution: Clear Cache and Restart

### Step 1: Stop the Dev Server Completely

1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl+C` to stop it
3. **Make sure it's fully stopped** (you should see the command prompt)

### Step 2: Delete Next.js Cache

In PowerShell, run:
```powershell
Remove-Item -Recurse -Force .next
```

Or manually:
- Delete the `.next` folder in your project root
- This clears all cached data including database connections

### Step 3: Clean Up .env.local

Your `.env.local` has a commented production URL. Let's clean it up:

1. Open `.env.local`
2. Remove or comment out the old production DATABASE_URL line (the one with `db.prisma.io`)
3. Make sure only this line is active:
   ```env
   DATABASE_URL="postgresql://postgres@localhost:5432/miniqms_local?schema=public"
   ```

### Step 4: Verify Environment Variables

Run this to see what Next.js will use:
```powershell
# This simulates what Next.js sees
$env:DATABASE_URL="postgresql://postgres@localhost:5432/miniqms_local?schema=public"
echo $env:DATABASE_URL
```

### Step 5: Restart Dev Server

```bash
npm run dev
```

### Step 6: Test Again

1. Add a test risk: "LOCAL TEST - Should NOT appear in production"
2. Check production - it should NOT appear

## Alternative: Force Environment Variable

If it still doesn't work, you can set it directly when starting:

```powershell
$env:DATABASE_URL="postgresql://postgres@localhost:5432/miniqms_local?schema=public"
npm run dev
```

## Debug: Check What Database is Actually Being Used

Add this temporarily to see what's happening:

1. Create a test API route: `src/app/api/test-db/route.ts`
2. Add this code:
   ```typescript
   import { NextResponse } from 'next/server'
   import prisma from '@/lib/db'
   
   export async function GET() {
     // This will show the actual connection string (without password)
     const url = process.env.DATABASE_URL
     return NextResponse.json({ 
       databaseUrl: url?.replace(/:[^:@]+@/, ':****@'), // Hide password
       message: 'Check what database URL is being used'
     })
   }
   ```
3. Visit `http://localhost:3000/api/test-db`
4. Check if it shows `localhost:5432/miniqms_local` or `db.prisma.io`

## Why This Happens

- PrismaClient is created **once** when the module loads
- If the server started with production URL, it keeps using it
- Next.js caches the Prisma client
- Deleting `.next` forces a fresh start

## Still Not Working?

1. **Check for other .env files:**
   ```powershell
   Get-ChildItem -Filter ".env*"
   ```

2. **Check system environment variables:**
   - Windows might have DATABASE_URL set globally
   - Check: System Properties → Environment Variables

3. **Try setting it explicitly:**
   ```powershell
   $env:DATABASE_URL="postgresql://postgres@localhost:5432/miniqms_local?schema=public"
   npm run dev
   ```
