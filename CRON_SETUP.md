# External Games Auto-Update Setup

This project automatically fetches game results from **a7satta.com** for the following games:

- Delhi Bazar
- Shree Ganesh
- Faridabad
- Ghaziabad
- Gali
- Disawer

## How It Works

The system uses **two mechanisms** to keep results updated:

### 1. Page Load Updates (Primary) ✅

- **Frequency**: Every page visit (with 15-minute cooldown)
- **How**: Automatically fetches when users visit the homepage
- **Benefit**: Provides frequent updates throughout the day
- **No setup required** - works automatically!

### 2. Daily Cron Job (Backup) 🕐

- **Frequency**: Once daily at midnight UTC (Vercel Hobby plan limitation)
- **How**: Vercel Cron Jobs
- **Benefit**: Ensures updates even if site has no visitors
- **Requires setup** - see instructions below

## Setup Instructions for Daily Cron Job

### 1. Environment Variables

Add the following environment variable to your Vercel project:

```bash
CRON_SECRET=<generate-a-random-secret-string>
```

You can generate a secure random string using:

```bash
openssl rand -base64 32
```

Or use any password generator to create a strong secret.

### 2. Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Your generated secret string
   - **Environment**: Production (and optionally Preview/Development)
4. Click **Save**

### 3. Deploy

The `vercel.json` file is already configured with the cron job. Simply deploy your project:

```bash
vercel --prod
```

The cron job will automatically start running once daily.

## Update Schedule

### With Vercel Hobby Plan (Free)

- **Page Load Updates**: Every 15 minutes (when someone visits)
- **Cron Job**: Once daily at midnight UTC
- **Effective Update Frequency**: Every 15 minutes during active hours!

### With Vercel Pro Plan (Paid)

You can increase cron frequency by updating `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/external-games",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

This runs every 30 minutes instead of daily.

## Testing the Setup

### Test Page Load Updates

1. Visit your homepage
2. Check browser console or server logs
3. External games should be fetched automatically (if cooldown has passed)

### Test Manual Fetch (Development Only)

```bash
POST http://localhost:3000/api/cron/external-games
```

Note: This only works in development mode.

## Monitoring

### Check Fetch Status

View your deployment logs to see fetch activity:

```
Starting external games cron job...
Successfully fetched X games from a7satta.com
```

### Verify Database

Check your MongoDB collection `externalgames` to see the latest fetched results.

## Troubleshooting

### Games Not Updating

- Check if page load is triggering fetch (check server logs)
- Verify MongoDB connection is working
- Ensure a7satta.com is accessible
- Check if 15-minute cooldown is preventing fetch

### Cron Job Issues

- Verify `CRON_SECRET` is set in Vercel environment variables
- Check `vercel.json` is properly committed
- Ensure you've deployed to production
- Review Vercel deployment logs for errors

### Vercel Plan Limitations

- **Hobby Plan**: Cron jobs limited to once per day
- **Solution**: The page load mechanism provides more frequent updates!
- **Upgrade to Pro**: Get hourly or more frequent cron jobs

## API Endpoints

### GET /api/external-games

Retrieve stored external games from the database.

### POST /api/external-games

Manually trigger a fresh fetch from a7satta.com.

### GET /api/cron/external-games

Cron endpoint (called automatically by Vercel Cron Jobs).

## Database Schema

External games are stored with the following structure:

```javascript
{
  name: String,        // Game name (e.g., "DELHI BAZAR")
  time: String,        // Game time (e.g., "3:15 PM")
  todayResult: String, // Today's result
  yesterdayResult: String, // Yesterday's result
  source: String,      // "a7satta"
  fetchedAt: Date,     // Last fetch timestamp (auto-expires after 2 days)
}
```

## Notes

- Results are automatically cleaned up after 2 days
- Duplicate games (same name and time) are automatically handled
- Games that match your default schedule are filtered out
- Only the 6 specified games are fetched, even if a7satta.com has more
- 15-minute cooldown prevents excessive requests to a7satta.com
