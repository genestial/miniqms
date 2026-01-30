# Push to GitHub - Quick Guide

## Step 1: Add GitHub Remote

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/miniqms.git
```

## Step 2: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If you get authentication errors, you may need to:

### Option A: Use GitHub CLI (Easiest)
```bash
gh auth login
gh repo create miniqms --public --source=. --remote=origin --push
```

### Option B: Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create a token with `repo` permissions
3. Use it as password when pushing:
```bash
git push -u origin main
# Username: YOUR_USERNAME
# Password: YOUR_TOKEN
```

### Option C: Use SSH (Recommended for long-term)
```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Copy public key: cat ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/miniqms.git
git push -u origin main
```

## Step 3: Verify

Check your GitHub repository - you should see all files there!

## Next: Deploy to Vercel

Once pushed to GitHub, follow `VERCEL_DEPLOYMENT.md` to connect and deploy.
