# Satta Disawer Satta - MongoDB Version

This is a MongoDB-based version of the Satta Disawer Satta platform, replacing the Sanity CMS backend with **MongoDB**, a free document database.

## Key Changes from Sanity Version

### What's Different:
- ✅ **MongoDB** instead of Sanity CMS
- ✅ **Mongoose** for schema management  
- ✅ **API Routes** in Next.js for data operations
- ✅ **Completely FREE** - No paid CMS required
- ✅ **Same UI/UX** - All components work identically
- ✅ **Offline capable** - Can run with local MongoDB

### What's the Same:
- Same Next.js framework and routing
- Same React components and styles
- Same admin panel functionality
- Same email notifications
- Same game configurations

## Installation & Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or cloud)

### 2. Install MongoDB (Choose One)

**Option A: Local Installation**
```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS:
brew install mongodb-community

# Linux (Ubuntu):
sudo apt-get install mongodb
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string

### 3. Setup Project
```bash
cd goodlucksatta-mongodb
npm install
```

### 4. Environment Variables
Create a `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/goodlucksatta
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=password123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_NOTIF_EMAIL=admin@example.com
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goodlucksatta
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Admin Access
- URL: `http://localhost:3000/login`
- Username: `admin` (from .env)
- Password: `password123` (from .env)

## API Endpoints

### Results
- `GET /api/results` - Get all results
- `GET /api/results?type=today` - Today's results
- `GET /api/results?type=yesterday` - Yesterday's results
- `GET /api/results?type=last` - Last recorded result
- `GET /api/results?type=disawar` - Disawar results
- `GET /api/results?game=game_name&year=2025` - Yearly results
- `GET /api/results?month=1&year=2025` - Monthly results
- `POST /api/results` - Create result (Admin)
- `PUT /api/results/[id]` - Update result (Admin)
- `DELETE /api/results/[id]` - Delete result (Admin)

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (Admin)

## Database Schema

### Result Collection
```javascript
{
  _id: ObjectId,
  game: String,        // "disawer", "gali", "desawar", etc.
  date: String,        // "2025-02-26" format
  resultNumber: String,// "123"
  waitingGame: String, // Next game waiting for result
  createdAt: Date,
  updatedAt: Date
}
```

### Settings Collection
```javascript
{
  _id: ObjectId,
  site2_name: String,
  site2_contactName: String,
  site2_whatsappNumber: String,
  site2_paymentNumber: String,
  site2_rate: String,
  contactName: String,
  whatsappNumber: String,
  siteName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Production Deployment

### Using MongoDB Atlas (Recommended)
```bash
# Build
npm run build

# Deploy to Vercel, Netlify, or your hosting
vercel deploy
```

### Environment Variables for Production
Set these in your hosting platform:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NEXT_PUBLIC_API_URL` - Your production domain
- `NEXT_PUBLIC_ADMIN_USERNAME` - Change to secure username
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Change to secure password

## Data Migration from Sanity

If you have existing Sanity data and want to migrate:

1. Export data from Sanity
2. Transform to MongoDB format
3. Use MongoDB Compass or mongoimport to import

Example migration script:
```javascript
// scripts/migrate.js
const mongoose = require('mongoose');
const sanityData = require('./sanity-export.json');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  // Transform and insert sanityData
}
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# For Atlas, verify:
# 1. Connection string is correct
# 2. IP whitelist includes your machine
# 3. Database user has correct permissions
```

### API Routes Not Working
- Check `.env.local` has `MONGODB_URI`
- Restart dev server: `npm run dev`
- Check browser console for errors

### Admin Login Fails
- Verify `.env.local` has correct admin credentials
- Check no typos in username/password

## Support & Documentation

- MongoDB Docs: https://docs.mongodb.com
- Mongoose Docs: https://mongoosejs.com
- Next.js Docs: https://nextjs.org/docs
- Original Project: See original README.md

## License

Same as original Satta Disawer Satta project
