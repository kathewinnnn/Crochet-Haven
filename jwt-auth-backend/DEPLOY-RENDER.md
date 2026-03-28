# Deploying JWT Auth Project to Render - Step by Step Guide

This guide will walk you through deploying your JWT Authentication Backend to Render.

---

## Prerequisites

- A [Render account](https://render.com) (sign up with GitHub)
- Your project pushed to a GitHub repository
- Node.js 18+ (as specified in your render.yaml)

---

## Step 1: Prepare Your Backend for Deployment

Your backend is already configured with [`render.yaml`](jwt-auth-backend/render.yaml) which tells Render how to deploy:

```yaml
services:
  - type: web
    name: jwt-auth-backend
    env: node
    rootDir: jwt-auth-backend
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_VERSION
        value: 18
    autoDeploy: false
```

**Key Configuration:**
- **Root Directory**: `jwt-auth-backend` - Ensure your backend code is in this folder
- **Build Command**: `npm install` - Installs dependencies
- **Start Command**: `node server.js` - Runs your Express server
- **Node Version**: 18

---

## Step 2: Push Your Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Initialize git in your project (if not already done):

```bash
cd jwt-auth-project
git init
git add .
git commit -m "Initial commit"
```

3. Add your GitHub repository as remote and push:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Blueprint"**
3. Connect your GitHub account and select your repository
4. Render will detect the `render.yaml` file automatically
5. Click **"Apply"** to deploy

### Option B: Manual Deployment

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository
4. Configure the following settings:

| Setting | Value |
|---------|-------|
| Name | `jwt-auth-backend` |
| Region | Choose closest to you |
| Branch | `main` |
| Root Directory | `jwt-auth-backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

5. Click **"Create Web Service"**

---

## Step 4: Configure Environment Variables

After deployment, you need to set environment variables:

1. In your Render service dashboard, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_VERSION` | `18` | |
| `JWT_SECRET` | Generate a secure random string | **Important!** Use a strong secret |
| `PORT` | `10000` | Render assigns this automatically |

**To generate a secure JWT_SECRET:**
- Use a random string generator
- Or use this command in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Step 5: Verify Your Backend is Running

1. Once deployed, Render will provide a URL like:
   `https://jwt-auth-backend.onrender.com`

2. Test your API endpoints:
   ```
   GET https://jwt-auth-backend.onrender.com/products
   POST https://jwt-auth-backend.onrender.com/api/auth/login
   ```

---

## Step 6: Update Frontend Configuration

Now you need to update your frontend to use the new backend URL:

1. Open [`jwt-auth-frontend/src/apiConfig.js`](jwt-auth-frontend/src/apiConfig.js)
2. Update the API base URL:

```javascript
// Change from local to your Render URL
export const API_BASE_URL = 'https://jwt-auth-backend.onrender.com';
```

---

## Step 7: Deploy Frontend

You have several options for the frontend:

### Option A: Deploy to Netlify (Recommended)

1. Go to [Netlify](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository (select the frontend folder)
4. Configure:
   - Base directory: `jwt-auth-frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **"Deploy site"**

### Option B: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - Root directory: `jwt-auth-frontend`
   - Build command: `npm run build`
   - Output directory: `build`
5. Click **"Deploy"**

---

## Important Notes

### Database Persistence
- Your backend uses `db.json` for data storage
- On Render's free plan, data will be lost when the service sleeps (after 15 min of inactivity)
- **To persist data**, consider using:
  - Render's **disks** (persistent storage)
  - Or upgrade to a paid plan
  - Or use an external database (MongoDB, PostgreSQL)

### First Deploy Wake-up
- The first request after inactivity will take ~30 seconds (cold start)
- Subsequent requests will be faster

### CORS Configuration
- Your backend is configured with CORS enabled (`app.use(cors())`)
- This allows requests from any domain

---

## Troubleshooting

### Build Failures
- Ensure Node version in render.yaml matches package.json engines
- Check that all dependencies are in package.json

### 500 Errors
- Check Render logs in the dashboard
- Verify JWT_SECRET is set
- Ensure db.json path is correct

### Connection Issues
- Verify frontend API_BASE_URL matches your Render backend URL
- Check that your backend is deployed and running

---

## Summary of URLs

After deployment, your URLs will be:

| Service | URL |
|---------|-----|
| Backend API | `https://jwt-auth-backend.onrender.com` |
| Frontend | `https://your-frontend-name.netlify.app` (or Vercel) |

---

## Next Steps

To update your deployment:
1. Push changes to GitHub
2. Render will auto-deploy (if autoDeploy is enabled)
3. For manual trigger, click "Deploy" in Render dashboard