# 🔧 Setup Guide - Fix Results Not Updating

## Problem

Results are updating on a7satta.com but not on this site.

## Root Causes Found

1. ❌ Missing `MONGODB_URI` in environment variables
2. ❌ Missing `CRON_SECRET` for Vercel cron job
3. ⚠️ MongoDB connection may need IP whitelisting

---

## ✅ Solution Steps

### Step 1: Fix Local Environment (Already Done ✓)

The `.env.local` file has been updated with:

```env
MONGODB_URI="mongodb+srv://admin:admin@cluster0.szokn.mongodb.net/goodluck?appName=Cluster0"
CRON_SECRET="sk_cron_2026_secure_external_games_fetch_a7satta_v1"
```

### Step 2: Configure MongoDB Atlas

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Whitelist All IP Addresses** (for testing):
   - Go to **Network Access** (left sidebar)
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

3. **Verify Database User**:
   - Go to **Database Access** (left sidebar)
   - Ensure user `admin` exists with password `admin`
   - Or create a new user and update `MONGODB_URI` in `.env.local`

### Step 3: Add Environment Variables to Vercel

You need to add these to your Vercel project:

1. Go to: https://vercel.com/your-project/settings/environment-variables

2. Add these variables:

   **Variable 1:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://admin:admin@cluster0.szokn.mongodb.net/goodluck?appName=Cluster0`
   - Environment: ✓ Production, ✓ Preview, ✓ Development

   **Variable 2:**
   - Name: `CRON_SECRET`
   - Value: `sk_cron_2026_secure_external_games_fetch_a7satta_v1`
   - Environment: ✓ Production, ✓ Preview, ✓ Development

3. Click **"Save"** for each

### Step 4: Redeploy to Vercel

After adding environment variables:

```bash
# Option 1: Deploy via Vercel CLI
vercel --prod

# Option 2: Trigger redeploy from Vercel dashboard
# Go to Deployments → Click "..." → Redeploy
```

---

## 🧪 Testing

### Test Local Development

```bash
# Start dev server
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3001/api/cron/external-games
```

**Expected Response:**

```json
{
  "success": true,
  "gamesCount": 6,
  "games": [...]
}
```

### Test Production

After deploying to Vercel, test the cron endpoint:

```bash
curl -X GET https://your-domain.com/api/cron/external-games \
  -H "Authorization: Bearer sk_cron_2026_secure_external_games_fetch_a7satta_v1"
```

---

## 📊 How It Works After Fix

Once configured, results will update automatically via:

### 1. **Page Load Updates** (Primary - Every 15 minutes)

- When users visit the homepage
- Checks if cooldown (15 min) has passed
- Fetches latest results from a7satta.com
- Updates database

### 2. **Vercel Cron Job** (Backup - Daily at midnight UTC)

- Runs even if no visitors
- Ensures results are always fresh
- Requires `CRON_SECRET` for authentication

---

## ⚠️ Common Issues

### Issue: MongoDB Connection Refused

**Solution:**

- Check MongoDB Atlas Network Access
- Ensure 0.0.0.0/0 is whitelisted (or add your IP)
- Verify database credentials

### Issue: Cron Job Not Running

**Solution:**

- Verify `CRON_SECRET` is set in Vercel
- Check `vercel.json` has the cron configuration
- View logs in Vercel dashboard → Logs

### Issue: Results Still Not Updating

**Solution:**

1. Clear browser cache
2. Check Vercel deployment logs
3. Verify MongoDB has data:
   - Go to MongoDB Atlas → Browse Collections
   - Check `externalgames` collection

---

## 📝 Quick Checklist

- [ ] MongoDB Atlas IP whitelisting configured
- [ ] `MONGODB_URI` added to Vercel
- [ ] `CRON_SECRET` added to Vercel
- [ ] Project redeployed to Vercel
- [ ] Tested API endpoint (returns success)
- [ ] Verified results showing on homepage

---

## 🆘 Still Having Issues?

Run the test script:

```bash
node scripts/test-external-fetch.js
```

This will:

- Test MongoDB connection
- Fetch games from a7satta.com
- Show detailed error messages
