# Troubleshooting Guide

## "Connection Failed" Error

### Check 1: Is the dev server running?

Look at your terminal where you ran `npm run dev`. You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

If you don't see this, the server isn't running. Try:
```bash
npm run dev
```

### Check 2: What URL are you using?

Make sure you're going to: **http://localhost:3000**

Not `https://` - use `http://` for local development.

### Check 3: Check for errors in terminal

Look for any error messages in the terminal where `npm run dev` is running. Common issues:

**Database connection errors:**
- Make sure `.env.local` has `DATABASE_URL` set
- Verify the database URL is correct

**Port already in use:**
- Another app might be using port 3000
- Try: `npm run dev -- -p 3001`
- Then go to: http://localhost:3001

**Missing environment variables:**
- Check `.env.local` exists
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL=http://localhost:3000`

### Check 4: Authentication Setup

The app requires authentication. For local testing, you might need to:

1. **Set up NextAuth properly** - The login page is currently a placeholder
2. **Or bypass auth temporarily** for testing

Let me help you set this up properly.
