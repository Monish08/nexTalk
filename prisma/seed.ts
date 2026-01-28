import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nextalk.com' },
    update: {},
    create: {
      email: 'admin@nextalk.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      bio: 'Platform administrator',
      karma: 1000,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  })

  // Create regular users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
        bio: 'Tech enthusiast and avid reader',
        karma: 450,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password123', 10),
        bio: 'Designer and creative thinker',
        karma: 320,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        name: 'Mike Johnson',
        password: await bcrypt.hash('password123', 10),
        bio: 'Developer and open source contributor',
        karma: 580,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      },
    }),
  ])

  console.log('✅ Created users')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech news, gadgets, and software discussions',
        icon: '💻',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Code, algorithms, and software development',
        icon: '👨‍💻',
        color: '#8B5CF6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX, graphics, and creative design',
        icon: '🎨',
        color: '#EC4899',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'science' },
      update: {},
      create: {
        name: 'Science',
        slug: 'science',
        description: 'Scientific discoveries and research',
        icon: '🔬',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Health, fitness, and daily living',
        icon: '🌟',
        color: '#F59E0B',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gaming' },
      update: {},
      create: {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Video games, reviews, and gaming culture',
        icon: '🎮',
        color: '#EF4444',
      },
    }),
  ])

  console.log('✅ Created categories')

  // Create posts
  const posts = [
    {
      title: 'The Future of AI: What to Expect in 2026',
      content: `# The Future of AI: What to Expect in 2026

Artificial Intelligence continues to evolve at an unprecedented pace. As we move through 2026, several key trends are emerging that will shape the future of technology.

## Key Developments

1. **Multimodal AI Systems**: AI models that can seamlessly process text, images, audio, and video are becoming mainstream.

2. **AI Agents**: Autonomous AI agents that can perform complex tasks with minimal human intervention are gaining traction.

3. **Ethical AI**: Increased focus on responsible AI development and deployment.

## Impact on Society

The integration of AI into daily life continues to accelerate, with applications ranging from healthcare to education to creative industries.

What are your thoughts on where AI is heading?`,
      excerpt: 'Exploring the key AI trends shaping 2026 and beyond',
      categorySlug: 'technology',
      authorEmail: 'john@example.com',
    },
    {
      title: 'Best Practices for Clean Code in 2026',
      content: `# Best Practices for Clean Code

Writing maintainable code is more important than ever. Here are essential practices every developer should follow:

## Core Principles

- **Meaningful Names**: Use descriptive variable and function names
- **Small Functions**: Keep functions focused on a single task
- **DRY Principle**: Don't Repeat Yourself
- **Comments**: Write self-documenting code, use comments sparingly

## Modern Tools

Leverage modern tooling like ESLint, Prettier, and TypeScript to enforce code quality automatically.

\`\`\`typescript
// Good example
function calculateUserAge(birthYear: number): number {
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}
\`\`\`

Remember: Clean code is not about being clever, it's about being clear.`,
      excerpt: 'Essential coding practices for writing maintainable software',
      categorySlug: 'programming',
      authorEmail: 'mike@example.com',
    },
    {
      title: 'UI Design Trends Dominating 2026',
      content: `# UI Design Trends Dominating 2026

The design landscape is constantly evolving. Here's what's hot in UI design this year:

## Top Trends

### 1. Glassmorphism 2.0
Enhanced transparency effects with better performance and accessibility.

### 2. Micro-interactions
Subtle animations that enhance user experience without overwhelming.

### 3. Dark Mode First
Designing for dark mode as the primary interface, not an afterthought.

### 4. 3D Elements
Tasteful use of 3D graphics to create depth and engagement.

## Color Psychology

Understanding how colors affect user behavior remains crucial. Bold, vibrant palettes are making a comeback while maintaining accessibility standards.

What design trends are you implementing in your projects?`,
      excerpt: 'Discover the UI design trends shaping digital experiences',
      categorySlug: 'design',
      authorEmail: 'jane@example.com',
    },
    {
      title: 'Breakthrough in Quantum Computing',
      content: `# Breakthrough in Quantum Computing

Scientists have achieved a major milestone in quantum error correction, bringing practical quantum computers closer to reality.

## The Discovery

Researchers have developed a new quantum error correction code that is significantly more efficient than previous methods, potentially enabling quantum computers with thousands of logical qubits.

## Implications

This breakthrough could revolutionize:
- Drug discovery
- Climate modeling
- Cryptography
- Materials science

## What's Next?

The race is now on to scale up quantum systems using this new approach. Companies and research institutions worldwide are already adapting their quantum strategies.`,
      excerpt: 'New quantum error correction breakthrough brings us closer to practical quantum computers',
      categorySlug: 'science',
      authorEmail: 'john@example.com',
    },
    {
      title: 'Building a Productive Morning Routine',
      content: `# Building a Productive Morning Routine

Your morning sets the tone for your entire day. Here's how to build a routine that works.

## My Morning Framework

**6:00 AM - Wake Up**
No snoozing! Get up immediately and hydrate with a glass of water.

**6:15 AM - Exercise**
20-30 minutes of movement. Could be yoga, running, or strength training.

**6:45 AM - Meditation**
10 minutes of mindfulness to center yourself for the day.

**7:00 AM - Healthy Breakfast**
Fuel your body with nutritious food.

**7:30 AM - Plan the Day**
Review your goals and prioritize tasks.

## Key Principles

- **Consistency**: Same time every day
- **No Phone**: Avoid screens for the first hour
- **Preparation**: Set everything up the night before

What does your morning routine look like?`,
      excerpt: 'A science-backed approach to starting your day right',
      categorySlug: 'lifestyle',
      authorEmail: 'jane@example.com',
    },
    {
      title: 'The Rise of Indie Games in 2026',
      content: `# The Rise of Indie Games in 2026

Indie games are experiencing a golden age, with more success stories than ever before.

## Why Indies Are Thriving

### 1. Accessible Development Tools
Modern game engines like Unity, Unreal, and Godot have never been more powerful or accessible.

### 2. Digital Distribution
Platforms like Steam, Epic, and itch.io have democratized game distribution.

### 3. Community Funding
Kickstarter and other crowdfunding platforms enable direct support from fans.

## Notable Successes

Recent indie hits have shown that innovative gameplay and storytelling can compete with AAA titles.

## Getting Started

If you're thinking about making your own game:
- Start small with game jams
- Join indie dev communities
- Focus on your unique vision
- Iterate based on feedback

The indie game scene has never been more welcoming to newcomers!`,
      excerpt: 'How independent game developers are changing the industry',
      categorySlug: 'gaming',
      authorEmail: 'mike@example.com',
    },
  ]

  for (const post of posts) {
    const category = categories.find((c) => c.slug === post.categorySlug)
    const author = users.find((u) => u.email === post.authorEmail) || admin

    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        slug: post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        content: post.content,
        excerpt: post.excerpt,
        published: true,
        authorId: author.id,
        categoryId: category!.id,
        upvotes: Math.floor(Math.random() * 100) + 20,
        downvotes: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 500) + 100,
        score: Math.random() * 100 + 50,
      },
    })

    // Create comments for each post
    const commentAuthors = [admin, ...users]
    const numComments = Math.floor(Math.random() * 5) + 2

    for (let i = 0; i < numComments; i++) {
      const randomAuthor =
        commentAuthors[Math.floor(Math.random() * commentAuthors.length)]

      await prisma.comment.create({
        data: {
          content: `This is a great post! I really enjoyed reading about this topic. ${i + 1}`,
          authorId: randomAuthor.id,
          postId: createdPost.id,
          upvotes: Math.floor(Math.random() * 20),
          downvotes: Math.floor(Math.random() * 3),
        },
      })
    }
  }

  console.log('✅ Created posts and comments')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('Email: admin@nextalk.com | Password: admin123')
  console.log('Email: john@example.com | Password: password123')
  console.log('Email: jane@example.com | Password: password123')
  console.log('Email: mike@example.com | Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
