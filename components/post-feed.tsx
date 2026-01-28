'use client'

import { useEffect, useState } from 'react'
import { PostCard } from './post-card'
import { Filter } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  upvotes: number
  downvotes: number
  views: number
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
    karma: number
  }
  category: {
    id: string
    name: string
    slug: string
    color: string | null
  }
  _count: {
    comments: number
  }
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot')

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?sort=${sortBy}`)
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-shimmer">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Sort Filters */}
      <div className="flex items-center space-x-2 mb-6 p-4 bg-white rounded-lg border border-slate-200">
        <Filter className="h-5 w-5 text-slate-500" />
        <button
          onClick={() => setSortBy('hot')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === 'hot'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🔥 Hot
        </button>
        <button
          onClick={() => setSortBy('new')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === 'new'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ✨ New
        </button>
        <button
          onClick={() => setSortBy('top')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === 'top'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🏆 Top
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-500">No posts found. Be the first to create one!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}
