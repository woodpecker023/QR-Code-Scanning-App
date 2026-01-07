# Deployment Guide

This guide will help you deploy your QR Inventory App to Vercel so you can access it from your phone anywhere.

## Option 1: Deploy with Vercel CLI (Recommended)

### Step 1: Sign up for Vercel (if you haven't)
1. Go to https://vercel.com/signup
2. Sign up with GitHub, GitLab, or email
3. It's completely free!

### Step 2: Deploy from Command Line

Open your terminal in the project directory and run:

```bash
cd "C:\RPA\n8n projects\QR Code Scanning App"
vercel login
```

Follow the prompts to authenticate.

Then deploy:

```bash
vercel --prod
```

**Answer the prompts:**
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- What's your project's name? **qr-inventory-app** (or any name you like)
- In which directory is your code located? **./** (just press Enter)
- Want to override the settings? **N**

The deployment will start and you'll get a URL like: `https://qr-inventory-app.vercel.app`

### Step 3: Set Environment Variables on Vercel

After deployment, you need to add your environment variables:

1. Go to https://vercel.com/dashboard
2. Click on your project "qr-inventory-app"
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:

```
VITE_GOOGLE_CLIENT_ID = 454713839078-jd5n5ob0fhjllnfd75nek7ckjk9uv1dd.apps.googleusercontent.com
VITE_GOOGLE_SHEET_ID = 1ej031hW_vn_83MVs3pWq57CJIkUETgpVp4zS9Mt-5uU
VITE_SHEET_NAME = Inventory
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots (...) on the latest deployment → **Redeploy**

### Step 4: Update Google Cloud Console OAuth Settings

**IMPORTANT:** You must add your Vercel URL to Google OAuth settings:

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, add:
   - `https://your-app-name.vercel.app` (replace with your actual Vercel URL)
4. Under **"Authorized redirect URIs"**, add:
   - `https://your-app-name.vercel.app` (replace with your actual Vercel URL)
5. Click **Save**

### Step 5: Test on Your Phone!

1. Open your Vercel URL on your phone: `https://your-app-name.vercel.app`
2. Sign in with Google
3. Grant camera permissions
4. Start scanning QR codes!

---

## Option 2: Deploy via Vercel Website (Easiest)

### Step 1: Push to GitHub (if you haven't)

First, initialize git and push to GitHub:

```bash
cd "C:\RPA\n8n projects\QR Code Scanning App"
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/qr-inventory-app.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_GOOGLE_CLIENT_ID = 454713839078-jd5n5ob0fhjllnfd75nek7ckjk9uv1dd.apps.googleusercontent.com
   VITE_GOOGLE_SHEET_ID = 1ej031hW_vn_83MVs3pWq57CJIkUETgpVp4zS9Mt-5uU
   VITE_SHEET_NAME = Inventory
   ```

7. Click **Deploy**

### Step 3: Update Google OAuth (Same as Option 1, Step 4)

---

## Option 3: Access on Phone via Local Network (No Deployment Needed)

If you just want to test on your phone while on the same WiFi:

1. Make sure your phone is on the same WiFi as your computer
2. On your phone, open browser and go to: `http://192.168.0.30:5173`
   - **Note:** Camera access may not work on HTTP (only works on localhost or HTTPS)

---

## Troubleshooting

### Camera Not Working
- Camera requires HTTPS in production
- Make sure you deployed to Vercel (not using HTTP)
- Grant camera permissions when prompted

### "Invalid Origin" Error
- Make sure you added your Vercel URL to Google Cloud Console OAuth settings
- Check both "Authorized JavaScript origins" and "Authorized redirect URIs"

### Environment Variables Not Working
- After adding env vars on Vercel, you MUST redeploy
- Go to Deployments tab → Click (...) on latest deployment → Redeploy

### Sheet Not Loading
- Verify your Google Sheet structure (ID, Item Name, SKU, Total Sales, Quantity)
- Make sure sheet tab is named "Inventory"
- Check that test user (sucdotaacc1@gmail.com) is added in Google Cloud Console

---

## Quick Deploy Command

If you already completed Step 1 and logged in to Vercel:

```bash
cd "C:\RPA\n8n projects\QR Code Scanning App"
vercel --prod
```

That's it! Your app will be live in seconds.
