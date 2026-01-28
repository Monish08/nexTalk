# NexTalk - Community Blog Platform

A Reddit-inspired community blog platform built with Next.js 14, PostgreSQL, Prisma, and NextAuth.js.

## 🚀 Features

### Core Features
- ✅ User authentication (Google OAuth + Email/Password)
- ✅ Create, edit, and delete posts with markdown support
- ✅ Categories (sub-communities)
- ✅ Upvote and downvote system
- ✅ Nested comments with replies
- ✅ Post search and filtering
- ✅ User dashboard

### Advanced Features
- ✅ Trending posts algorithm
- ✅ Markdown editor with preview
- ✅ Real-time vote updates
- ✅ Notifications system
- ✅ Content moderation (report posts)
- ✅ Responsive design
- ✅ SEO optimized

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Lucide Icons, Framer Motion
- **Editor**: React Markdown

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd nextalk
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/nextalk?schema=public"

# NextAuth - Generate a secret: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters-long"

# Google OAuth (Get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set Up Database

```bash
# Push the schema to your database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed the database with sample data
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Test Credentials

After seeding, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@nextalk.com | admin123 | Admin |
| john@example.com | password123 | User |
| jane@example.com | password123 | User |
| mike@example.com | password123 | User |

## 📁 Project Structure

```
nextalk/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── posts/            # Post CRUD
│   │   ├── comments/         # Comments
│   │   ├── votes/            # Voting system
│   │   ├── categories/       # Categories
│   │   └── notifications/    # Notifications
│   ├── auth/                 # Auth pages (signin, signup)
│   ├── create/               # Post creation
│   ├── post/[slug]/          # Individual post view
│   ├── dashboard/            # User dashboard
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── navbar.tsx            # Navigation bar
│   ├── post-card.tsx         # Post display card
│   ├── post-feed.tsx         # Posts list
│   ├── category-list.tsx     # Categories sidebar
│   └── trending-posts.tsx    # Trending sidebar
├── lib/                      # Utilities
│   ├── prisma.ts             # Prisma client
│   ├── auth.ts               # NextAuth config
│   ├── utils.ts              # Helper functions
│   └── validations.ts        # Zod schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── tailwind.config.js        # Tailwind configuration
└── next.config.js            # Next.js configuration
```

## 🎨 Key Components

### Authentication
- Google OAuth and email/password login
- Protected routes and API endpoints
- Session management with JWT

### Posts
- Markdown editor with live preview
- Image support
- Category assignment
- View tracking
- Hot/New/Top sorting algorithms

### Voting System
- Upvote/downvote on posts and comments
- Real-time vote count updates
- Reddit-style score calculation

### Comments
- Nested replies (3 levels deep)
- Real-time comment count
- Delete protection (own comments + admin)

### Notifications
- Comment notifications
- Reply notifications
- Upvote notifications
- Real-time badge updates

## 📊 Database Schema

Key models:
- **User**: Authentication and profile
- **Post**: Blog posts with markdown
- **Comment**: Nested comments
- **Vote**: Upvotes and downvotes
- **Category**: Post categories
- **Notification**: User notifications
- **Report**: Content moderation

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:studio    # Open Prisma Studio
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database with sample data
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `POST /api/posts` - Create post
- `GET /api/posts/[slug]` - Get single post
- `PATCH /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post

### Comments
- `GET /api/comments?postId=X` - Get post comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments?id=X` - Delete comment

### Votes
- `POST /api/votes` - Cast vote

### Categories
- `GET /api/categories` - Get all categories

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications` - Mark as read

## 🔒 Security Features

- Password hashing with bcryptjs
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Rate limiting ready
- Role-based access control (User, Moderator, Admin)

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Database Options

- **Vercel Postgres**: Integrated solution
- **Railway**: Easy PostgreSQL hosting
- **Supabase**: PostgreSQL with extras
- **AWS RDS**: Enterprise option

## 📈 Performance Optimizations

- Image optimization with Next.js Image
- Database query optimization with Prisma
- API route caching
- Client-side state management
- Lazy loading components
- Code splitting

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14 and modern web technologies.
