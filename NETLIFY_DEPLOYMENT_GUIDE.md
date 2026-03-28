# Deploying JWT Auth Project to Netlify Only

This guide provides step-by-step instructions to deploy your JWT authentication project using **Netlify for both frontend and backend**. This is the simpler solution that guarantees all functionality works.

## Prerequisites

- GitHub account (to store your code)
- Netlify account (https://netlify.com)

---

## Why Netlify Only?

Your project already has everything needed:
- **Frontend**: React app in `jwt-auth-frontend/`
- **Backend**: Netlify function in `jwt-auth-frontend/netlify/functions/server.js`
- **Database**: `jwt-auth-frontend/public/db.json`

All authentication, products, and orders features are already implemented in the Netlify function.

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

Make sure your GitHub repository contains:

```
your-repo/
├── jwt-auth-frontend/
│   ├── public/
│   │   ├── db.json          # Your data (users, products, orders)
│   │   └── index.html
│   ├── src/                 # React frontend code
│   ├── netlify/
│   │   └── functions/
│   │       └── server.js   # Backend API (auth, products, orders)
│   ├── netlify.toml        # Netlify configuration
│   └── package.json
```

**Important**: Your `db.json` data is in `jwt-auth-frontend/public/db.json` - this will be used by the Netlify function.

### Step 2: Push Code to GitHub

1. Create a new GitHub repository
2. Push your code (including `jwt-auth-frontend/` folder)

### Step 3: Deploy to Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your repository
4. Configure these settings:

   | Setting | Value |
   |---------|-------|
   | Base directory | `jwt-auth-frontend` |
   | Build command | `npm run build` |
   | Publish directory | `build` |
   | Functions directory | `netlify/functions` |

5. Add environment variable (optional):
   - `JWT_SECRET` = (any random string for security)

6. Click "Deploy site"

### Step 4: Wait for Deployment

- Deployment takes 1-3 minutes
- Netlify will show "Site is live" when done

---

## How It Works

1. **Frontend**: React app is served from `https://your-site.netlify.app`
2. **Backend**: API calls like `/api/auth/login` go to the Netlify function
3. **Database**: The function reads/writes to `db.json` in the `public/` folder

### API Routes (All Included)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/check-username` | GET | Check username availability |
| `/api/auth/delete-account` | POST | Delete user account |
| `/products` | GET | Get all products |
| `/products` | POST | Add product (seller) |
| `/products/:id` | PUT | Update product |
| `/products/:id` | DELETE | Delete product |
| `/orders` | GET | Get orders |
| `/orders` | POST | Create order |
| `/orders/:id` | PUT | Update order status |
| `/orders/:id/cancel` | POST | Cancel order |

---

## Testing Your Deployment

After deployment, test these features:

1. **Visit your site**: `https://your-app.netlify.app`
2. **Register**: Create a new account
3. **Login**: Log in with your account
4. **Browse products**: View products on the home page
5. **Add to cart**: Add items to cart
6. **Checkout**: Complete checkout process
7. **View orders**: Check your orders page

If you were using seller/admin features locally, test:
- Seller dashboard
- Adding/editing products
- Order management

---

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| 404 errors on API calls | Check `netlify.toml` has the API redirect rule |
| Database not saving | Ensure `db.json` is in `public/` folder |
| Login not working | Check JWT_SECRET is set consistently |
| Images not loading | Ensure images are in `public/img/` folder |

---

## Configuration Files

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

After completing these steps, your project will be fully deployed on Netlify:

- **URL**: `https://your-app.netlify.app`
- **Frontend**: React app (all pages: home, login, register, cart, checkout, profile, etc.)
- **Backend**: Netlify function handling all API requests
- **Data**: Stored in `db.json` (users, products, orders)

All functionality from your offline project will work identically!