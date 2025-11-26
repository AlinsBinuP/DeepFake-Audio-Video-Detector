# Deployment Guide (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

## Option 1: Git Integration (Recommended)

1.  **Push your code** to a Git provider (GitHub, GitLab, or Bitbucket).
2.  Log in to your **Vercel Dashboard**.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your repository.
5.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect `Vite`.
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `npm run build` (default)
    *   **Output Directory**: `dist` (default)
6.  **Environment Variables** (CRITICAL):
    *   Expand the "Environment Variables" section.
    *   Add the following variable:
        *   **Key**: `VITE_API_KEY`
        *   **Value**: Your Google Gemini API Key
7.  Click **"Deploy"**.

## Option 2: Vercel CLI

If you prefer the command line:

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Login:
    ```bash
    vercel login
    ```
3.  Deploy:
    ```bash
    vercel
    ```
4.  Follow the prompts. When asked about settings, the defaults are usually correct.
5.  **Set Environment Variable**:
    *   Go to the project settings in the Vercel Dashboard after the first deployment (which might fail if it needs the key at build time, though usually it's a runtime key for client-side apps, but Vite replaces it at build time).
    *   **Important**: Since we use `import.meta.env`, the key is embedded at **build time**. You must set the Environment Variable in Vercel **BEFORE** the build runs.
    *   If using CLI, you can set it via:
        ```bash
        vercel env add VITE_API_KEY
        ```
    *   Then redeploy:
        ```bash
        vercel --prod
        ```

## Troubleshooting

*   **Build Fails?** Check the logs. Ensure `@types/node` is installed (we added this).
*   **App loads but API fails?** Check that `VITE_API_KEY` is set correctly in Vercel and that you redeployed *after* setting it.
