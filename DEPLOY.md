# Deploying Prism Studio

## Recommended: GitHub + Vercel
This is the best way to deploy. It gives you automatic deployments every time you push code.

### 1. Push to GitHub
1.  **Create a new repository** on GitHub (e.g., `prism-studio`).
2.  **Push your code**:
    ```bash
    git add .
    git commit -m "Initial commit for Prism Studio"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/prism-studio.git
    git push -u origin main
    ```

### 2. Connect to Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find your `prism-studio` repository and click **"Import"**.
5.  **Deploy**:
    -   Leave all settings as default (Vercel auto-detects Vite/React).
    -   Click **"Deploy"**.

### 3. Done!
Vercel will build your site and give you a live URL (e.g., `prism-studio.vercel.app`).
Anytime you push changes to GitHub, Vercel will automatically update your site.
