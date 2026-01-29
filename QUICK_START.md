# Quick Start Guide for Beginners

Welcome! This guide will get you up and running with Mini QMS step by step.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check with: `node --version` - should be 18+)
- ✅ PostgreSQL database (or access to one)
- ✅ Code editor (VS Code recommended)

## Step-by-Step Setup

### Step 1: Install Dependencies ✅ (Already Done!)

Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### Step 2: Set Up File Storage

**Recommended for beginners: Use MinIO (local storage)**

1. **Download MinIO:**
   - Go to https://min.io/download
   - Download for your operating system
   - Extract the ZIP file

2. **Create a data folder:**
   ```bash
   mkdir minio-data
   ```

3. **Start MinIO:**
   - Open a new terminal/command prompt
   - Navigate to where you extracted MinIO
   - Run: `minio.exe server D:\path\to\minio-data` (Windows)
   - Or: `./minio server ./minio-data` (Mac/Linux)
   - **Keep this terminal open!**

4. **Create bucket:**
   - Open http://localhost:9000 in browser
   - Login: `minioadmin` / `minioadmin`
   - Click "Create Bucket"
   - Name: `miniqms-storage`
   - Click "Create bucket"

5. **Update your `.env` file:**
   ```env
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="minioadmin"
   AWS_SECRET_ACCESS_KEY="minioadmin"
   S3_BUCKET_NAME="miniqms-storage"
   S3_ENDPOINT="http://localhost:9000"
   ```

6. **Test the connection:**
   ```bash
   npm run test:s3
   ```
   You should see: ✅ All tests passed!

**For detailed S3 setup options, see `S3_SETUP_GUIDE.md`**

### Step 3: Set Up Database

1. **Make sure PostgreSQL is running**
   - Check if you have PostgreSQL installed
   - Start the PostgreSQL service if needed

2. **Create a database:**
   ```sql
   CREATE DATABASE miniqms;
   ```

3. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/miniqms?schema=public"
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```

5. **Seed ISO 9001 clauses:**
   ```bash
   npm run db:seed
   ```

### Step 4: Create First User

You need to create a tenant and user. Use Prisma Studio (easiest):

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

1. **Create Tenant:**
   - Click "Tenant" model
   - Click "Add record"
   - Fill in:
     - `name`: Your company name
     - `scopeStatement`: (optional for now)
   - Click "Save 1 change"
   - **Copy the `id`** (you'll need it)

2. **Create User:**
   - Click "User" model
   - Click "Add record"
   - Fill in:
     - `email`: your-email@example.com
     - `name`: Your name
     - `tenantId`: Paste the tenant ID you copied
     - `role`: Select "ADMIN"
   - Click "Save 1 change"

### Step 5: Complete .env File

Make sure your `.env` file has all these:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/miniqms?schema=public"

# NextAuth
NEXTAUTH_SECRET="TjiAK+lYUpS9b+30mh67NzU9alqdQRbae3rMOIuX9+k="
NEXTAUTH_URL="http://localhost:3000"

# S3 Storage (MinIO example)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
S3_BUCKET_NAME="miniqms-storage"
S3_ENDPOINT="http://localhost:9000"
```

### Step 6: Start the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

### Step 7: Sign In

1. Go to http://localhost:3000/login
2. Use the email you created in Prisma Studio
3. For MVP, password validation is simplified - you should be able to sign in

### Step 8: Complete Onboarding

1. After signing in, you'll be redirected to `/onboarding`
2. Follow the 6-step wizard:
   - Step 1: Enter scope statement
   - Step 2: Create default processes
   - Step 3: Add 3-5 risks
   - Step 4: Record first management review
   - Step 5: Upload quality policy
   - Step 6: Configure clause applicability (optional)

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Make sure database exists

### "S3 connection failed"
- For MinIO: Make sure MinIO server is running
- Check S3_ENDPOINT in .env matches MinIO URL
- Verify bucket name is correct

### "Unauthorized" when accessing pages
- Make sure you created a user in Prisma Studio
- Check user has correct tenantId
- Try signing out and back in

## Next Steps

- Explore the dashboard
- Add more processes, risks, and evidence
- Customize your company profile
- Review the compliance dashboard

## Need More Help?

- **S3 Setup**: See `S3_SETUP_GUIDE.md` for detailed storage options
- **Full Setup**: See `SETUP.md` for comprehensive instructions
- **Troubleshooting**: Check the troubleshooting sections in both guides

Happy building! 🚀
