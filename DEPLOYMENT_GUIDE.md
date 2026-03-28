# Deploying JWT Auth Project to Render (Backend) + Netlify (Frontend)

This guide provides step-by-step instructions to deploy your JWT authentication project with Render as the backend and Netlify as the frontend.

## Prerequisites

- GitHub account (to store your code)
- Render account (https://render.com)
- Netlify account (https://netlify.com)

---

## Part 1: Deploying Backend to Render

### Step 1: Prepare the Backend Code

The backend is located in `jwt-auth-backend/` folder. Ensure the following files exist:

- `server.js` - Main Express server
- `package.json` - Dependencies and scripts
- `db.json` - Database file (your data)
- `middleware/authMiddleware.js` - Authentication middleware
- `routes/auth.js` - Authentication routes

### Step 2: Push Code to GitHub

1. Create a new GitHub repository
2. Initialize git in your project root:
   ```bash
   git init
   ```
3. Add all files (excluding node_modules, .gitignore items):
   ```bash
   git add .
   git commit -m "Initial commit"
   ```
4. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   ```
5. Push to GitHub:
   ```bash
   git push -u origin main
   ```

### Step 3: Deploy to Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select your repository
4. **Select the Git branch**: Choose `master` (or `main` if that's what you're using)
5. Configure the web service:
   - **Name**: `jwt-auth-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Add Environment Variables:
   - Key: `NODE_VERSION`, Value: `20`
   - Key: `RENDER`, Value: `true`
   - Key: `JWT_SECRET` (optional - uses default if not provided)

6. Click "Create Web Service"

**Important**: Make sure the `db.json` file is included in your git repository. Render will need it for the database.

### Step 4: Note Your Backend URL

After deployment, Render will provide a URL like:
`https://jwt-auth-backend-xxxx.onrender.com`

---

## Part 2: Deploying Frontend to Netlify

### Step 1: Update API Configuration

Before deploying, update the frontend to point to your Render backend:

1. Open `jwt-auth-frontend/netlify.toml`
2. Update the `REACT_APP_API_URL` environment variable with your Render backend URL:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
     functions = "netlify/functions"
     environment = { NODE_VERSION = "18", REACT_APP_API_URL = "https://your-backend.onrender.com" }
   ```

### Step 2: Ensure db.json Exists in Public Folder

The frontend needs access to db.json:

1. Ensure `jwt-auth-frontend/public/db.json` exists (this is used by the Netlify function)
2. The data will be served from the same domain

### Step 3: Deploy to Netlify

#### Option A: Using GitHub (Recommended)

1. Push your updated code to GitHub
2. Log in to [Netlify Dashboard](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub and select the repository
5. Configure build settings:
   - **Base directory**: `jwt-auth-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Functions directory**: `netlify/functions`
6. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-render-backend-url.onrender.com`
7. Click "Deploy site"

#### Option B: Using Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Navigate to frontend directory:
   ```bash
   cd jwt-auth-frontend
   ```
3. Login to Netlify:
   ```bash
   netlify login
   ```
4. Deploy:
   ```bash
   netlify deploy --prod --dir=build
   ```

### Step 4: Note Your Frontend URL

After deployment, Netlify will provide a URL like:
`https://your-project-name.netlify.app`

---

## Part 3: Testing the Deployment

### Verify Backend is Running

1. Visit your Render backend URL: `https://jwt-auth-backend-xxxx.onrender.com`
2. Test the health endpoint (if available) or try logging in

### Verify Frontend Works

1. Visit your Netlify URL: `https://your-project.netlify.app`
2. Try registering a new user
3. Try logging in
4. Test adding products to cart
5. Test checkout functionality

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure the backend allows requests from your Netlify domain |
| Database not found | Check that db.json is in the correct location |
| Authentication not working | Verify JWT_SECRET matches between frontend and backend |
| API calls failing | Confirm REACT_APP_API_URL is set correctly in Netlify |
| Exit status 1 error | Check Render logs - usually caused by missing db.json or Node version issues |

---

## Part 4: Important Configuration Files

### render.yaml (Backend)

```yaml
services:
  - type: web
    name: jwt-auth-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_VERSION
        value: "20"
      - key: RENDER
        value: "true"
    autoDeploy: true
```

### netlify.toml (Frontend)

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"
  environment = { NODE_VERSION = "18" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

---

## Summary

After completing these steps, your project will be deployed as follows:

- **Frontend**: https://your-app.netlify.app (served by Netlify)
- **Backend API**: https://jwt-auth-backend-xxxx.onrender.com (served by Render)

The frontend communicates with the backend via API calls, and all authentication, products, and orders functionality will work identically to the local version.