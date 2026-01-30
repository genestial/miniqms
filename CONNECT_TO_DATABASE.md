# Connect to miniqms_local Database

## Database Found! ✅

You can see `miniqms_local` exists. Now let's connect to it and set it up.

## Step 1: Connect to miniqms_local in HeidiSQL

### Method 1: Use Database Dropdown
1. Look at the **top toolbar** in HeidiSQL
2. Find the **database dropdown** (shows current database name)
3. Click the dropdown arrow
4. Select **`miniqms_local`** from the list
5. HeidiSQL will switch to that database

### Method 2: Double-Click in Query Results
1. In the SQL query results where you see the database list
2. **Double-click** on `miniqms_local`
3. HeidiSQL should connect to it

### Method 3: Change Connection Settings
1. In HeidiSQL: **Tools** → **Session Manager**
2. Edit your current session
3. In the **Database** field, type: `miniqms_local`
4. Save and reconnect

## Step 2: Verify You're Connected

Once connected to `miniqms_local`:
- The database name should show in the toolbar/status bar
- In the left panel, you should see:
  - `public` schema
  - `pg_catalog` schema
  - `information_schema` schema

## Step 3: Update .env.local

Now update your local environment file to use this database:

1. **Open `.env.local`** in your project root
2. **Set the DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/miniqms_local?schema=public"
   ```
   
   Replace `YOUR_PASSWORD` with your PostgreSQL password (or leave empty if no password).

3. **If you don't know the password**, try:
   - Empty (no password)
   - `root` (Laragon default)
   - `postgres` (common default)

## Step 4: Test Connection

Run this to test if Prisma can connect:

```bash
npm run db:push
```

This will:
- Connect to `miniqms_local`
- Push your schema (create all tables)
- Show any errors if connection fails

## Step 5: Seed the Database (Optional)

If you want to add the ISO 9001 clauses:

```bash
npm run db:seed
```

## Step 6: Verify Separation

Now test that local and production are separate:

1. **Start local dev server:**
   ```bash
   npm run dev
   ```

2. **Add a test risk** at `http://localhost:3000/risks`
   - Name it: "LOCAL TEST - Should not appear in production"

3. **Check production** at `https://miniqms.vercel.app/risks`
   - The "LOCAL TEST" risk should **NOT** appear there ✅

## Troubleshooting

### "Can't connect" Error

If `npm run db:push` fails:

1. **Check PostgreSQL is running** in Laragon
2. **Verify password** in `.env.local`
3. **Check port** - make sure it's `5432` (or whatever Laragon uses)
4. **Test connection in HeidiSQL first** - if HeidiSQL can connect, Prisma should too

### "Password authentication failed"

Try different passwords:
- Empty (no password)
- `root`
- `postgres`
- Check Laragon PostgreSQL settings

### Still seeing production data locally?

1. **Double-check `.env.local`:**
   ```powershell
   Get-Content .env.local | Select-String "DATABASE_URL"
   ```
   Should show `localhost:5432/miniqms_local`, NOT a Vercel URL!

2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

## Clean Up (Optional)

You have `miniqms_local2` which you probably don't need. You can delete it:

```sql
-- In HeidiSQL, connect to postgres database first, then run:
DROP DATABASE miniqms_local2;
```

But this is optional - it won't hurt to leave it.
