# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FTUE Flow Manager"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the settings (Vite + React)
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/dotanwork/ftue-new-system
   vercel
   ```

3. **Follow the prompts**:
   - Login to Vercel (if not already)
   - Confirm project settings
   - Deploy!

4. **Your app will be live** at a URL like: `https://ftue-new-system.vercel.app`

### Option 3: Deploy via GitHub Actions (Advanced)

If you want automatic deployments on every push:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Vercel
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
   ```

## Alternative: Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repo for auto-deployments

## Testing Locally Before Deploy

```bash
npm run build
npm run preview
```

This will serve the production build locally at `http://localhost:4173`

