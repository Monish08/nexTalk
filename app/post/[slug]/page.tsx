import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostView } from './post-view'

interface PostPageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
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
  })

  return post
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | NexTalk`,
    description: post.excerpt || post.title,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return <PostView post={post} />
}
