# Mini QMS Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- S3-compatible storage (AWS S3, Vercel Blob, or compatible service)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/miniqms?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# S3 Storage
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="miniqms-storage"

# Optional: For S3-compatible services
S3_ENDPOINT=""
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## Step 3: Database Setup

### Generate Prisma Client
```bash
npm run db:generate
```

### Push Schema to Database
```bash
npm run db:push
```

### Seed ISO 9001 Clauses
```bash
npm run db:seed
```

This will populate the database with all ISO 9001 clause metadata.

## Step 4: Create Initial Tenant and User

You'll need to create your first tenant and user. You can do this via:

1. **Prisma Studio** (recommended for initial setup):
```bash
npx prisma studio
```

2. **Or via SQL**:
```sql
-- Create tenant
INSERT INTO tenants (id, name, "scope_statement", "created_at", "updated_at")
VALUES ('tenant-id-here', 'Your Company Name', 'Your scope statement', NOW(), NOW());

-- Create user
INSERT INTO users (id, email, name, "tenant_id", role, "created_at")
VALUES ('user-id-here', 'admin@example.com', 'Admin User', 'tenant-id-here', 'ADMIN', NOW());
```

## Step 5: Configure S3 Storage

### Option A: AWS S3

1. Create an S3 bucket
2. Set up IAM user with S3 access
3. Add credentials to `.env`

### Option B: Vercel Blob

1. Set up Vercel Blob storage
2. Use Vercel Blob SDK instead of AWS SDK
3. Update `src/lib/storage.ts` if needed

### Option C: Local Development (MinIO)

For local development, you can use MinIO:

1. Install MinIO: https://min.io/download
2. Run MinIO: `minio server ./data`
3. Configure endpoint in `.env`:
```env
S3_ENDPOINT="http://localhost:9000"
```

## Step 6: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 7: Complete Onboarding

1. Sign in (or create user via Prisma Studio)
2. Navigate to `/onboarding`
3. Complete the 6-step onboarding process:
   - Step 1: Enter scope statement
   - Step 2: Create default processes
   - Step 3: Add initial risks (3-5)
   - Step 4: Record first management review
   - Step 5: Upload quality policy
   - Step 6: Configure clause applicability (optional)

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### S3 Storage Issues

- Verify credentials are correct
- Check bucket exists and is accessible
- For local development, ensure MinIO is running

### Authentication Issues

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your app URL
- Ensure user exists in database with correct tenant_id

### Prisma Issues

- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema
- Check Prisma logs for detailed errors

## Production Deployment

### Environment Variables

Ensure all environment variables are set in your hosting platform:
- Vercel: Project Settings → Environment Variables
- AWS: Use Parameter Store or Secrets Manager
- Other platforms: Follow their environment variable setup

### Database Migrations

For production, use migrations instead of `db push`:

```bash
npm run db:migrate
```

### Build

```bash
npm run build
npm start
```

## Next Steps

- Complete authentication implementation (password hashing)
- Implement PDF generation for System Overview export
- Add email notifications
- Customize UI/UX as needed
- Add additional features per requirements
