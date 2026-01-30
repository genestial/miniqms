# Push to GitHub - Ready to Go!

Your repository is ready to push. Run this command:

```bash
git push -u origin main
```

## If you get authentication errors:

### Option 1: Use Personal Access Token (Recommended)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Mini QMS"
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

7. When you run `git push`, use:
   - Username: `genestial`
   - Password: `YOUR_TOKEN_HERE`

### Option 2: Use GitHub CLI

```bash
gh auth login
git push -u origin main
```

### Option 3: Use SSH (For future)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: https://github.com/settings/keys
# Copy public key: cat ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:genestial/miniqms.git
git push -u origin main
```

## After pushing:

1. Verify at: https://github.com/genestial/miniqms
2. Then follow `VERCEL_DEPLOYMENT.md` to deploy to Vercel
