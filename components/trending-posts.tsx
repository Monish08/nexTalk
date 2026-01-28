'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, ArrowUp } from 'lucide-react'

interface TrendingPost {
  id: string
  title: string
  slug: string
  upvotes: number
  _count: {
    comments: number
  }
}

export function TrendingPosts() {
  const [posts, setPosts] = useState<TrendingPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingPosts()
  }, [])

  const fetchTrendingPosts = async () => {
    try {
      const response = await fetch('/api/posts?sort=hot&limit=5')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching trending posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Trending</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded animate-shimmer"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
        Trending Now
      </h3>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="block p-3 rounded-lg hover:bg-white/50 transition-colors group"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-2 group-hover:text-brand-600 transition-colors mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <div className="flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {post.upvotes}
                  </div>
                  <span>•</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
