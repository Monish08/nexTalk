import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPostSchema } from '@/lib/validations'
import { generateSlug, calculateScore } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'hot'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    let orderBy: any = {}
    
    switch (sort) {
      case 'new':
        orderBy = { createdAt: 'desc' }
        break
      case 'top':
        orderBy = { upvotes: 'desc' }
        break
      case 'hot':
      default:
        orderBy = { score: 'desc' }
        break
    }

    const where: any = { published: true }
    
    if (category) {
      where.category = { slug: category }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              karma: true,
            },
          },
          category: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    const slug = generateSlug(validatedData.title)
    
    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })
    
    const finalSlug = existingPost 
      ? `${slug}-${Date.now().toString(36)}`
      : slug

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        authorId: session.user.id,
        categoryId: validatedData.categoryId,
        score: 0,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
