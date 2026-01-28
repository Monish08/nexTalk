'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowBigUp, ArrowBigDown, MessageSquare, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface PostCardProps {
  post: {
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
    }
    category: {
      name: string
      slug: string
      color: string | null
    }
    _count: {
      comments: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession()
  const [votes, setVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  })
  const [userVote, setUserVote] = useState<1 | -1 | null>(null)

  const handleVote = async (value: 1 | -1) => {
    if (!session) {
      toast.error('Please sign in to vote')
      return
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, postId: post.id }),
      })

      if (response.ok) {
        if (userVote === value) {
          // Remove vote
          setVotes((prev) => ({
            upvotes: prev.upvotes + (value === 1 ? -1 : 0),
            downvotes: prev.downvotes + (value === -1 ? -1 : 0),
          }))
          setUserVote(null)
        } else if (userVote) {
          // Change vote
          setVotes((prev) => ({
            upvotes: prev.upvotes + (value === 1 ? 1 : -1),
            downvotes: prev.downvotes + (value === -1 ? 1 : -1),
          }))
          setUserVote(value)
        } else {
          // New vote
          setVotes((prev) => ({
            upvotes: prev.upvotes + (value === 1 ? 1 : 0),
            downvotes: prev.downvotes + (value === -1 ? 1 : 0),
          }))
          setUserVote(value)
        }
      }
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const score = votes.upvotes - votes.downvotes

  return (
    <div className="card group hover:shadow-lg transition-all">
      <div className="flex space-x-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={() => handleVote(1)}
            className={`p-1 rounded hover:bg-slate-100 transition-colors ${
              userVote === 1 ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <ArrowBigUp className="h-6 w-6" fill={userVote === 1 ? 'currentColor' : 'none'} />
          </button>
          <span className={`font-bold ${score > 0 ? 'text-brand-600' : score < 0 ? 'text-red-600' : 'text-slate-600'}`}>
            {score}
          </span>
          <button
            onClick={() => handleVote(-1)}
            className={`p-1 rounded hover:bg-slate-100 transition-colors ${
              userVote === -1 ? 'text-red-600' : 'text-slate-400'
            }`}
          >
            <ArrowBigDown className="h-6 w-6" fill={userVote === -1 ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <Link
            href={`/c/${post.category.slug}`}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
            style={{
              backgroundColor: `${post.category.color}20`,
              color: post.category.color || '#64748b',
            }}
          >
            {post.category.name}
          </Link>

          {/* Title */}
          <Link href={`/post/${post.slug}`}>
            <h2 className="text-xl font-bold mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-slate-600 mb-3 line-clamp-2">{post.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'User'}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-slate-300" />
              )}
              <span>{post.author.name}</span>
            </div>
            
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            
            <span>•</span>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post._count.comments} comments</span>
            </div>
            
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
