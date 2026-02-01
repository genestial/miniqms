# Fix: Foreign Key Constraint Error - Create Local Tenant

## The Problem

You're getting this error:
```
Foreign key constraint violated: `risks_tenant_id_fkey (index)`
```

This happens because:
- You're logged in with a session that has a `tenantId` from **production**
- That tenant doesn't exist in your **local** database
- When you try to create a risk, it fails because the foreign key constraint can't find the tenant

## Solution: Create a Local Tenant and User

### Option 1: Use the Setup API (Easiest)

1. **Check your current session:**
   - Visit: `http://localhost:3000/api/test-session`
   - Note the `tenantId` it shows (this is from production)

2. **Create a local tenant and user:**
   - Open your browser console (F12)
   - Run this JavaScript:
   ```javascript
   fetch('/api/setup/local-tenant', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       tenantName: 'Local Development',
       userEmail: 'admin@local.dev',
       userName: 'Local Admin'
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```

3. **Log out and log back in:**
   - Go to: `http://localhost:3000/login`
   - Log out if you're logged in
   - Log in with the email you just created: `admin@local.dev`
   - (Password is not required for MVP)

4. **Try creating a risk again**

### Option 2: Use Prisma Studio

1. **Open Prisma Studio:**
   ```bash
   npx prisma studio
   ```

2. **Create a Tenant:**
   - Click on "Tenant" model
   - Click "Add record"
   - Fill in:
     - `name`: "Local Development"
     - `scopeStatement`: "Local dev tenant"
   - Click "Save 1 change"

3. **Create a User:**
   - Click on "User" model
   - Click "Add record"
   - Fill in:
     - `email`: "admin@local.dev"
     - `name`: "Local Admin"
     - `tenantId`: (select the tenant you just created)
     - `role`: "ADMIN"
   - Click "Save 1 change"

4. **Log out and log back in** with the new user

### Option 3: Use SQL Directly

If you have database access (HeidiSQL, pgAdmin, etc.):

```sql
-- Create tenant (replace 'local-tenant-id' with a unique ID)
INSERT INTO tenants (id, name, scope_statement, created_at, updated_at)
VALUES ('local-tenant-id', 'Local Development', 'Local dev tenant', NOW(), NOW());

-- Create user (use the tenant ID from above)
INSERT INTO users (id, email, name, tenant_id, role, created_at)
VALUES ('local-user-id', 'admin@local.dev', 'Local Admin', 'local-tenant-id', 'ADMIN', NOW());
```

## Verify It Works

1. **Check session:**
   - Visit: `http://localhost:3000/api/test-session`
   - Should show the new local `tenantId`

2. **Create a risk:**
   - Go to: `http://localhost:3000/risks`
   - Click "Add Risk/Opportunity"
   - Fill in the form and submit
   - Should work without errors!

## Why This Happened

- Your session cookie contains a `tenantId` from production
- When you switched to the local database, that tenant doesn't exist there
- NextAuth sessions persist across database switches
- Solution: Create matching tenant/user in local DB, or clear cookies and create new session

## Quick Fix: Clear Session

If you want to start fresh:

1. **Clear browser cookies** for `localhost:3000`
2. **Create local tenant/user** (Option 1, 2, or 3 above)
3. **Log in** with the local user
