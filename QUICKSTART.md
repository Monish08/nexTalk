# 🚀 Quick Start Guide - NexTalk

Get your NexTalk platform running in 5 minutes!

## Step 1: Prerequisites

Ensure you have:
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- A code editor (VS Code recommended)

## Step 2: Set Up PostgreSQL

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb nextalk
```

### Option B: Free Cloud Database
Use one of these free options:
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Supabase**: https://supabase.com (includes PostgreSQL)
- **Railway**: https://railway.app
- **ElephantSQL**: https://www.elephantsql.com

## Step 3: Install Dependencies

```bash
cd nextalk
npm install
```

## Step 4: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:

```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/nextalk"

# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# For local development
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional - can skip for testing)
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
```

### Getting Google OAuth Credentials (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## Step 5: Set Up Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed with sample data
npm run prisma:seed
```

## Step 6: Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser 🎉

## Step 7: Test the Platform

Use these test accounts created during seeding:

| Email | Password | Role |
|-------|----------|------|
| admin@nextalk.com | admin123 | Admin |
| john@example.com | password123 | User |
| jane@example.com | password123 | User |

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Re-seed database

# Production
npm run build            # Build for production
npm start                # Start production server
```

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try: `npx prisma db pull` to test connection

### "Module not found"
```bash
npm install
npx prisma generate
```

### Port 3000 already in use
```bash
# Kill the process
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Reset everything
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
npx prisma migrate reset
npm run prisma:seed
```

## Next Steps

1. **Customize Categories**: Edit `prisma/seed.ts` and re-run seed
2. **Change Theme**: Modify `tailwind.config.js` colors
3. **Add Features**: Explore the codebase and add your own features
4. **Deploy**: See README.md for deployment instructions

## Support

- Check README.md for detailed documentation
- Review the code comments
- Open an issue on GitHub

Happy coding! 🚀
