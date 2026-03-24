# Deployment Guide

This guide will help you deploy your JWT Auth system to the web using:
- **Backend**: Render.com (free)
- **Frontend**: Firebase Hosting (free)

---

## Prerequisites

You need:
1. A [GitHub](https://github.com) account
2. A [Render.com](https://render.com) account (free)
3. A [Firebase](https://firebase.google.com) account (free)

---

## STEP 1: Deploy Backend to Render.com

### 1.1 Prepare Your Backend for GitHub

Your backend files are in the `jwt-auth-backend` folder. You need to push this to GitHub.

**If you already have a GitHub repo:**
- Add the `jwt-auth-backend` folder to your existing repository

**If you don't have a GitHub repo:**
1. Go to [GitHub](https://github.com) and create a new repository named `jwt-auth-project`
2. Run these commands in your terminal:

```bash
# Navigate to your project folder
cd "c:/Users/hp/OneDrive/Desktop/jwt-auth-project"

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"

# Add your GitHub repository (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### 1.2 Deploy to Render.com

1. Go to [Render.com](https://render.com) and sign up/login
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name**: `jwt-auth-backend`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **"Create Web Service"**
6. Wait for deployment to complete (1-2 minutes)
7. Copy your backend URL (e.g., `https://jwt-auth-backend.onrender.com`)

---

## STEP 2: Update Frontend API Configuration

1. Open the file: `jwt-auth-frontend/src/apiConfig.js`
2. Change line 14 from:
   ```javascript
   return "http://localhost:5000";
   ```
   to your Render backend URL:
   ```javascript
   return "https://jwt-auth-backend.onrender.com";
   ```

---

## STEP 3: Deploy Frontend to Firebase

### 3.1 Install Firebase CLI

If you don't have Firebase CLI installed, open a terminal and run:

```bash
npm install -g firebase-tools
```

### 3.2 Initialize Firebase

```bash
cd "c:/Users/hp/OneDrive/Desktop/jwt-auth-project/jwt-auth-frontend"

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting
```

**When prompted:**
- Select your Firebase project (or create a new one)
- What do you want to use as your public directory? → `build`
- Configure as a single-page app? → `Yes`
- Set up automatic builds and deploys with GitHub? → `No` (optional)

### 3.3 Build and Deploy

```bash
# Build the React app
npm run build

# Deploy to Firebase
firebase deploy
```

---

## STEP 4: Verify Your Deployment

After deployment, you'll get a URL like:
- Frontend: `https://your-project.web.app`
- Backend: `https://jwt-auth-backend.onrender.com`

Test by opening the frontend URL and trying to log in or register.

---

## Troubleshooting

### If login/register doesn't work:
1. Check browser console (F12) for errors
2. Verify your backend URL is correct in `apiConfig.js`
3. Make sure CORS is enabled on backend (it already is)

### If you get "Failed to fetch":
- Check that your backend is running on Render.com
- Verify the URL in `apiConfig.js` is correct (must include `https://`)

---

## Summary of URLs

| Service | URL |
|---------|-----|
| Frontend (Firebase) | `https://your-project.web.app` |
| Backend (Render) | `https://jwt-auth-backend.onrender.com` |
| API Base | `https://jwt-auth-backend.onrender.com` |