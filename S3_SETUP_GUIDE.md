# S3 Storage Setup Guide for Beginners

This guide will help you set up file storage for Mini QMS. You have three options - choose the one that fits your needs:

## Option 1: AWS S3 (Production/Real Storage) 🌐

This is the real AWS cloud storage. Use this for production or if you want actual cloud storage.

### Step 1: Create an AWS Account

1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process (you'll need a credit card, but AWS Free Tier includes 5GB S3 storage for 12 months)

### Step 2: Create an S3 Bucket

1. Log into AWS Console: https://console.aws.amazon.com/
2. Search for "S3" in the top search bar
3. Click "S3" service
4. Click "Create bucket" button
5. Fill in the form:
   - **Bucket name**: Choose a unique name (e.g., `miniqms-yourname-storage`)
     - Must be globally unique across all AWS
     - Use lowercase letters, numbers, and hyphens only
   - **AWS Region**: Choose closest to you (e.g., `us-east-1`, `eu-west-1`)
   - **Block Public Access**: Keep checked (we use signed URLs, not public access)
   - Click "Create bucket"

### Step 3: Create IAM User for Access

1. In AWS Console, search for "IAM"
2. Click "IAM" service
3. Click "Users" in left sidebar
4. Click "Create user"
5. Enter username: `miniqms-storage-user`
6. Click "Next"
7. Select "Attach policies directly"
8. Search for and select: `AmazonS3FullAccess`
9. Click "Next", then "Create user"

### Step 4: Get Access Keys

1. Click on the user you just created (`miniqms-storage-user`)
2. Click "Security credentials" tab
3. Scroll to "Access keys" section
4. Click "Create access key"
5. Select "Application running outside AWS"
6. Click "Next", then "Create access key"
7. **IMPORTANT**: Copy both:
   - **Access key ID** (starts with `AKIA...`)
   - **Secret access key** (click "Show" to reveal)
   - Save these securely - you won't see the secret key again!

### Step 5: Update Your .env File

Add these to your `.env` file:

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAXXXXXXXXXXXXXXXX"
AWS_SECRET_ACCESS_KEY="your-secret-access-key-here"
S3_BUCKET_NAME="miniqms-yourname-storage"
```

Replace:
- `us-east-1` with your bucket's region
- `AKIAXXXXXXXXXXXXXXXX` with your Access key ID
- `your-secret-access-key-here` with your Secret access key
- `miniqms-yourname-storage` with your bucket name

---

## Option 2: Vercel Blob (Easiest for Vercel Deployments) 🚀

If you're deploying to Vercel, this is the easiest option.

### Step 1: Create Vercel Account

1. Go to https://vercel.com/
2. Sign up for free account

### Step 2: Enable Blob Storage

1. In Vercel dashboard, go to your project
2. Go to "Storage" tab
3. Click "Create Database"
4. Select "Blob"
5. Give it a name (e.g., `miniqms-blob`)
6. Click "Create"

### Step 3: Get Credentials

1. In your Blob storage settings, find:
   - **BLOB_READ_WRITE_TOKEN** (this is your access token)

### Step 4: Update Code for Vercel Blob

You'll need to modify `src/lib/storage.ts` to use Vercel Blob SDK instead of AWS SDK. For now, use AWS S3 option or see Option 3 for local development.

---

## Option 3: Local Development with MinIO (Easiest for Testing) 💻

This runs a local S3-compatible server on your computer. Perfect for development and testing.

### Step 1: Download MinIO

**Windows:**
1. Go to https://min.io/download
2. Download "MinIO Server" for Windows
3. Extract the ZIP file
4. You'll get `minio.exe`

**Mac:**
```bash
brew install minio/stable/minio
```

**Linux:**
```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
```

### Step 2: Create Data Directory

Create a folder where MinIO will store files:

```bash
# In your project root or anywhere convenient
mkdir minio-data
```

### Step 3: Start MinIO Server

Open a terminal/command prompt and run:

```bash
# Windows (adjust path to where you extracted MinIO)
minio.exe server D:\path\to\minio-data

# Mac/Linux
minio server ./minio-data
```

You'll see output like:
```
MinIO Object Storage Server
Copyright: 2015-2024 MinIO, Inc.
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl-3.0.html>
Version: RELEASE.2024-01-16T16-07-38Z

API: http://127.0.0.1:9000  http://172.17.0.1:9000
RootUser: minioadmin
RootPass: minioadmin
```

**Keep this terminal window open!** MinIO needs to keep running.

### Step 4: Create Bucket via Web UI

1. Open browser to http://localhost:9000
2. Login with:
   - Username: `minioadmin`
   - Password: `minioadmin`
3. Click "Create Bucket"
4. Name it: `miniqms-storage`
5. Click "Create bucket"

### Step 5: Create Access Key

1. In MinIO web UI, click the user icon (top right)
2. Click "Access Keys"
3. Click "Create access key"
4. Copy:
   - **Access Key** (e.g., `minioadmin`)
   - **Secret Key** (e.g., `minioadmin`)

### Step 6: Update Your .env File

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
S3_BUCKET_NAME="miniqms-storage"
S3_ENDPOINT="http://localhost:9000"
```

**Important**: Add `S3_ENDPOINT` for MinIO!

---

## Testing Your Setup

After configuring your `.env` file, test the connection:

### Create a Test Script

Create `test-s3.js` in your project root:

```javascript
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

async function test() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log('✅ S3 Connection Successful!');
    console.log('Buckets:', response.Buckets?.map(b => b.Name));
  } catch (error) {
    console.error('❌ S3 Connection Failed:', error.message);
  }
}

test();
```

Run it:
```bash
node test-s3.js
```

---

## Quick Comparison

| Option | Best For | Cost | Setup Difficulty |
|--------|----------|------|------------------|
| **AWS S3** | Production | Free tier, then pay-as-you-go | Medium |
| **Vercel Blob** | Vercel deployments | Free tier available | Easy |
| **MinIO (Local)** | Development/Testing | Free | Easy |

---

## Recommended: Start with MinIO

If you're new to this, I recommend starting with **MinIO (Option 3)** because:
- ✅ Free and runs on your computer
- ✅ No credit card needed
- ✅ Perfect for learning and testing
- ✅ Same API as AWS S3 (easy to switch later)
- ✅ Fast (no internet needed)

You can always switch to AWS S3 later when you're ready for production!

---

## Troubleshooting

### "Access Denied" Error
- Check your Access Key ID and Secret Access Key are correct
- Verify bucket name matches exactly
- For AWS: Ensure IAM user has S3 permissions

### "Bucket Not Found" Error
- Verify bucket name in `.env` matches the actual bucket name
- Check you're using the correct region (AWS) or endpoint (MinIO)

### MinIO Won't Start
- Check if port 9000 is already in use
- Try a different port: `minio server ./minio-data --address :9001`
- Update `S3_ENDPOINT` in `.env` to match

### Connection Timeout
- For MinIO: Make sure MinIO server is running
- For AWS: Check your internet connection
- Verify endpoint URL is correct

---

## Next Steps

Once S3 is configured:
1. Test the connection using the test script above
2. Continue with database setup in `SETUP.md`
3. Run `npm run dev` to start the application

Need help? Check the error message and refer to the troubleshooting section above!
