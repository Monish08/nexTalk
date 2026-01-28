'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import { ArrowBigUp, ArrowBigDown, MessageSquare, Eye, Calendar, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  upvotes: number
  downvotes: number
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
    karma: number
  }
  replies?: Comment[]
}

interface PostViewProps {
  post: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    imageUrl: string | null
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
      name: string
      slug: string
      color: string | null
    }
    _count: {
      comments: number
    }
  }
}

export function PostView({ post }: PostViewProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [votes, setVotes] = useState({
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  })
  const [userVote, setUserVote] = useState<1 | -1 | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${post.id}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

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
          setVotes((prev) => ({
            upvotes: prev.upvotes + (value === 1 ? -1 : 0),
            downvotes: prev.downvotes + (value === -1 ? -1 : 0),
          }))
          setUserVote(null)
        } else if (userVote) {
          setVotes((prev) => ({
            upvotes: prev.upvotes + (value === 1 ? 1 : -1),
            downvotes: prev.downvotes + (value === -1 ? 1 : -1),
          }))
          setUserVote(value)
        } else {
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

  const handleComment = async (parentId?: string) => {
    if (!session) {
      toast.error('Please sign in to comment')
      return
    }

    if (!newComment.trim()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId: post.id,
          parentId,
        }),
      })

      if (response.ok) {
        toast.success('Comment posted!')
        setNewComment('')
        setReplyTo(null)
        fetchComments()
      } else {
        toast.error('Failed to post comment')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted')
        router.push('/')
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const score = votes.upvotes - votes.downvotes

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Content */}
      <article className="card mb-8">
        <div className="flex space-x-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVote(1)}
              className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${
                userVote === 1 ? 'text-brand-600 bg-brand-50' : 'text-slate-400'
              }`}
            >
              <ArrowBigUp className="h-8 w-8" fill={userVote === 1 ? 'currentColor' : 'none'} />
            </button>
            <span className={`text-xl font-bold ${score > 0 ? 'text-brand-600' : score < 0 ? 'text-red-600' : 'text-slate-600'}`}>
              {score}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${
                userVote === -1 ? 'text-red-600 bg-red-50' : 'text-slate-400'
              }`}
            >
              <ArrowBigDown className="h-8 w-8" fill={userVote === -1 ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            <Link
              href={`/c/${post.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color || '#64748b',
              }}
            >
              {post.category.name}
            </Link>

            {/* Title */}
            <h1 className="text-4xl font-display font-bold mb-4">{post.title}</h1>

            {/* Author and Meta */}
            <div className="flex items-center flex-wrap gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-300" />
                )}
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-slate-500">{post.author.karma} karma</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post._count.comments} comments</span>
                </div>
              </div>

              {/* Author Actions */}
              {session?.user.id === post.author.id && (
                <div className="ml-auto flex space-x-2">
                  <Link href={`/post/${post.slug}/edit`} className="btn btn-ghost text-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="btn btn-ghost text-sm text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Image */}
            {post.imageUrl && (
              <div className="mb-6">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="rounded-lg w-full object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({post._count.comments})
        </h2>

        {/* Add Comment */}
        {session ? (
          <div className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              rows={4}
              className="textarea mb-3"
            />
            <button
              onClick={() => handleComment()}
              disabled={loading || !newComment.trim()}
              className="btn btn-primary"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-slate-50 rounded-lg text-center">
            <p className="text-slate-600">
              <Link href="/auth/signin" className="text-brand-600 hover:text-brand-700 font-medium">
                Sign in
              </Link>{' '}
              to join the discussion
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(id) => setReplyTo(id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  onReply,
  depth = 0,
}: {
  comment: Comment
  onReply: (id: string) => void
  depth?: number
}) {
  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-slate-200 pl-4' : ''}`}>
      <div className="flex space-x-3">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name || 'User'}
            width={32}
            height={32}
            className="rounded-full h-8 w-8"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-300" />
        )}

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="text-slate-700 mb-3">{comment.content}</p>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <button className="hover:text-brand-600 transition-colors">
              ↑ {comment.upvotes}
            </button>
            <button className="hover:text-red-600 transition-colors">
              ↓ {comment.downvotes}
            </button>
            {depth < 2 && (
              <button
                onClick={() => onReply(comment.id)}
                className="hover:text-brand-600 transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
