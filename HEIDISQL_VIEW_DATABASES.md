# How to See Databases in HeidiSQL (PostgreSQL)

## The Issue

You're seeing **schemas** (public, pg_catalog, etc.) instead of **databases**. This means you're looking inside a database, not at the server level.

## Solution: View Databases at Server Level

### Step 1: Understand the Hierarchy

In PostgreSQL/HeidiSQL:
```
Server (PostgreSQL)
├── Database: postgres
│   ├── Schema: public
│   ├── Schema: pg_catalog
│   └── Schema: information_schema
├── Database: miniqms_local  ← You want to see this!
└── Database: other_databases
```

### Step 2: View Database List in HeidiSQL

**Method 1: Look at the Top Level**

1. In HeidiSQL's left panel, look at the **very top**
2. You should see your server name (e.g., "PostgreSQL" or "localhost")
3. **Click on the server name** (not on any database below it)
4. In the right panel, you should see a list of databases

**Method 2: Use the Database Dropdown**

1. Look at the **top toolbar** in HeidiSQL
2. There's a **database dropdown** (shows current database)
3. Click the dropdown arrow
4. You should see all databases listed there, including `miniqms_local`

**Method 3: Run SQL Query**

1. Make sure you're connected
2. In the SQL tab, run:
   ```sql
   SELECT datname FROM pg_database WHERE datistemplate = false;
   ```
3. This will show all non-template databases
4. You should see `miniqms_local` in the results

### Step 3: Connect to miniqms_local

Once you can see `miniqms_local` in the list:

1. **Double-click** on `miniqms_local` in the database list, OR
2. **Select it from the database dropdown** in the toolbar, OR
3. **Right-click** on `miniqms_local` → "Open"

### Step 4: Verify You're in the Right Database

After connecting to `miniqms_local`:
- The database name should show in the toolbar/status bar
- You should see schemas: `public`, `pg_catalog`, `information_schema`
- These are schemas **inside** `miniqms_local`, which is correct!

## Visual Guide

```
HeidiSQL Left Panel:
┌─────────────────────────────┐
│ 📊 PostgreSQL (localhost)   │ ← Click HERE to see databases
│   ├── 📁 postgres           │
│   ├── 📁 miniqms_local      │ ← Your database!
│   └── 📁 template1           │
└─────────────────────────────┘

When you click on "PostgreSQL (localhost)":
Right Panel shows:
┌─────────────────────────────┐
│ Databases:                  │
│ - postgres                  │
│ - miniqms_local  ← HERE!   │
│ - template1                 │
└─────────────────────────────┘
```

## If You Still Don't See It

### Check Connection Settings

1. Make sure you're connected to the **right PostgreSQL instance**
2. In HeidiSQL: **Tools** → **Session Manager**
3. Check which server you're connected to
4. Verify the port matches Laragon's PostgreSQL port

### Verify Database Exists

Run this SQL (connected to any database):
```sql
SELECT datname, datcollate, datctype 
FROM pg_database 
WHERE datname = 'miniqms_local';
```

If it returns a row, the database exists and you're just not seeing it in the UI.

### Refresh the View

1. **Disconnect** from the current session
2. **Reconnect** to the server
3. Look at the server level again

## Quick Test

1. Connect to PostgreSQL in HeidiSQL
2. Click on the **server name** (top of left panel)
3. Look at the **right panel** - should show database list
4. Or use the **database dropdown** in toolbar
5. Run the SQL query above to verify database exists

## Next Steps

Once you can see and connect to `miniqms_local`:

1. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/miniqms_local?schema=public"
   ```

2. **Push schema:**
   ```bash
   npm run db:push
   ```

3. **Test:**
   ```bash
   npm run dev
   ```
