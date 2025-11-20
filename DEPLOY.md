# Deployment Instructions

## Steps to Deploy to GitHub:

1. **Create a GitHub Repository:**
   - Go to https://github.com/new
   - Name your repository (e.g., `portfolio-website`)
   - Don't initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Connect and Push to GitHub:**
   After creating the repository, run these commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values):

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages (Optional - for free hosting):**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Alternative: Deploy to Vercel/Netlify

For better hosting with automatic deployments:

### Vercel:
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Import your repository
4. Deploy (it's automatic!)

### Netlify:
1. Go to https://netlify.com
2. Sign up/login with GitHub
3. Add new site → Import from Git
4. Select your repository
5. Build command: (leave empty or `npm install`)
6. Publish directory: `/` (root)
7. Deploy!

