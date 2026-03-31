# Firebase Firestore Backup Setup Guide

This guide explains how to configure Firebase Firestore as a backup database for your project.

## Prerequisites

1. Firebase Project: `crochet-haven-b9c65`
2. Firebase Service Account JSON file (downloaded from Firebase Console)

## Setup Steps

### Step 1: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **crochet-haven-b9c65**
3. Go to **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Save the JSON file as `service-account.json` in the `jwt-auth-frontend` folder

### Step 2: Configure Environment Variables

The `.env` file in `jwt-auth-frontend/` already has the configuration. You just need to:

1. Place your `service-account.json` file in `jwt-auth-frontend/` folder
2. Make sure `FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json` is in your `.env`

**For Render/Netlify deployment** (if you can't use file-based auth):
- Uncomment the `FIREBASE_SERVICE_ACCOUNT` line in `.env`
- Paste your entire service account JSON on a single line
- Or use Netlify/Render's environment variable settings

### Step 3: Install Dependencies

```bash
cd jwt-auth-frontend
npm install firebase-admin
```

### Step 4: Test Locally

```bash
npm run dev
```

Check backup status:
```
GET http://localhost:5000/api/admin/backup-status
```

Manual backup:
```
POST http://localhost:5000/api/admin/backup-to-firebase
```

Manual restore:
```
POST http://localhost:5000/api/admin/restore-from-firebase
```

## How It Works

1. **Automatic Backup**: Every time data is written to db.json, it automatically syncs to Firebase Firestore (non-blocking)

2. **Manual Backup/Restore**: Use the admin API endpoints to manually trigger backup or restore operations

3. **Fallback**: If Firebase is not configured, the app continues to work normally using only local db.json

## Firestore Structure

Data is stored in Firestore under:
- `backup/data/users` - User accounts
- `backup/data/products` - Product listings
- `backup/data/orders` - Order records
- `backup/metadata` - Backup timestamp

## Deployment Order

1. ✅ **Render** - Main backend (already done)
2. 🔄 **Firebase** - Backup database (this setup)
3. ⏳ **Netlify** - Frontend hosting (next step)

## Deploy to Netlify

Once Firebase is configured:

```bash
cd jwt-auth-frontend
npm run build
```

Then either:
- Connect your GitHub repo to Netlify, OR
- Use Netlify CLI: `netlify deploy --prod`

**Important**: In Netlify's environment variables, add:
- `FIREBASE_SERVICE_ACCOUNT` = (paste your entire service account JSON)

## Security Note

⚠️ **Never commit your service-account.json to Git!** It's already added to `.gitignore`.

## Troubleshooting

**Firebase not initializing:**
- Check that the service account JSON is valid
- Verify the file path is correct
- Check that firebase-admin is installed: `npm install firebase-admin`

**Backup failing:**
- Check Firestore permissions (must have read/write)
- Verify network connectivity
- Check Firebase quota

**Data not syncing:**
- The backup is async and non-blocking
- Check server logs for errors
- Verify Firebase is initialized