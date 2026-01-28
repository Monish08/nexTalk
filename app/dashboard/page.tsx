'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, MessageSquare, TrendingUp, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface UserPost {
  id: string
  title: string
  slug: string
  upvotes: number
  downvotes: number
  createdAt: string
  _count: {
    comments: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<UserPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchUserPosts()
    }
  }, [status, router])

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      // Filter posts by current user
      const userPosts = data.posts.filter(
        (post: any) => post.author.id === session?.user.id
      )
      setPosts(userPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  const totalUpvotes = posts.reduce((sum, post) => sum + post.upvotes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post._count.comments, 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-center space-x-6">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-brand-600 flex items-center justify-center text-white text-4xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-2">
              {session?.user?.name}
            </h1>
            <p className="text-slate-600">{session?.user?.email}</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-brand-600" />
                <span className="font-medium">{posts.length} Posts</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">{totalUpvotes} Upvotes</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{totalComments} Comments</span>
              </div>
            </div>
          </div>

          <Link href="/create" className="btn btn-primary">
            Create Post
          </Link>
        </div>
      </div>

      {/* User Posts */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Your Posts</h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-slate-600 mb-6">
              Start sharing your thoughts with the community
            </p>
            <Link href="/create" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="block p-4 rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-lg mb-2 hover:text-brand-600 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <span>•</span>
                  <span>{post.upvotes - post.downvotes} points</span>
                  <span>•</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
