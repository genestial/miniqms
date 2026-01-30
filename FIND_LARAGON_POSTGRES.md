# Finding Your Laragon PostgreSQL Database

## The Issue

You created a database but can't see it in HeidiSQL. This usually means:
- HeidiSQL is connected to a different PostgreSQL instance
- The database was created in Laragon's PostgreSQL, but HeidiSQL is connected elsewhere

## Solution: Connect HeidiSQL to Laragon's PostgreSQL

### Step 1: Find Laragon's PostgreSQL Port

Laragon typically uses:
- **Port**: `5432` (default) or `5433` (if 5432 is in use)
- **Host**: `localhost` or `127.0.0.1`
- **User**: Usually `postgres`
- **Password**: Check Laragon settings or try empty/`root`

### Step 2: Check Laragon PostgreSQL Status

1. Open **Laragon**
2. Check if PostgreSQL is running (green indicator)
3. Click on PostgreSQL to see the port number
4. Note the port (usually shown in the status)

### Step 3: Connect HeidiSQL to Laragon PostgreSQL

1. **Open HeidiSQL**
2. **Create a new session:**
   - Click "New" or "Session" → "New Session"
3. **Set connection details:**
   - **Network type**: `PostgreSQL (TCP/IP)`
   - **Hostname/IP**: `localhost` or `127.0.0.1`
   - **Port**: `5432` (or the port Laragon shows)
   - **User**: `postgres`
   - **Password**: 
     - Try empty (no password)
     - Or `root` (Laragon default)
     - Or check Laragon settings
   - **Database**: Leave empty or use `postgres`
4. **Click "Open"**

### Step 4: Verify Database Exists

Once connected:
1. Look in the left panel for your database list
2. You should see `miniqms_local` if it exists
3. If not visible, try:
   - Right-click in database list → "Refresh"
   - Or check if you're in the right PostgreSQL instance

### Step 5: Create Database if Needed

If the database doesn't exist:

1. **In HeidiSQL**, right-click on the PostgreSQL server
2. Select **"Create new"** → **"Database"**
3. Name: `miniqms_local`
4. Click **"OK"**

### Alternative: Create Database via Command Line

If you have access to Laragon's PostgreSQL command line:

1. Open Laragon
2. Click on PostgreSQL → "Open Terminal" or "Command Prompt"
3. Run:
   ```sql
   psql -U postgres
   ```
4. Then:
   ```sql
   CREATE DATABASE miniqms_local;
   \l  -- List all databases
   \q  -- Quit
   ```

## Common Issues

### "Can't connect to PostgreSQL"

1. **Check Laragon PostgreSQL is running:**
   - Should show green/running status
   - If not, click "Start" in Laragon

2. **Check port number:**
   - Laragon might use a different port
   - Check Laragon's PostgreSQL settings

3. **Check firewall:**
   - Windows Firewall might block connections
   - Try disabling temporarily to test

### "Wrong password"

Laragon PostgreSQL default passwords:
- Empty (no password)
- `root`
- `postgres`
- Check Laragon → Settings → PostgreSQL

### "Database exists but not visible"

1. **Refresh HeidiSQL:**
   - Right-click → Refresh
   - Or press F5

2. **Check you're in the right server:**
   - Multiple PostgreSQL instances might be running
   - Make sure you're connected to Laragon's instance

## Quick Test: List All Databases

Once connected in HeidiSQL, run this SQL:
```sql
SELECT datname FROM pg_database;
```

This will show all databases. You should see `miniqms_local` in the list.

## Next Steps

Once you can see `miniqms_local` in HeidiSQL:

1. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/miniqms_local?schema=public"
   ```
   Replace `password` with your actual PostgreSQL password.

2. **Push schema:**
   ```bash
   npm run db:push
   ```

3. **Test connection:**
   ```bash
   npm run dev
   ```
