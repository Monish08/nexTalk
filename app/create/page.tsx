'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Send, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Category {
  id: string
  name: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    imageUrl: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id }))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const post = await response.json()
        toast.success('Post created successfully!')
        router.push(`/post/${post.slug}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create post')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Create a Post</h1>
        <p className="text-slate-600">Share your thoughts with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="input text-lg"
              placeholder="Give your post an engaging title..."
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Image URL (optional)
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Editor Tabs */}
          <div className="flex space-x-2 mb-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 font-medium transition-colors ${
                !showPreview
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 font-medium transition-colors ${
                showPreview
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Content Editor */}
          {!showPreview ? (
            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={16}
                className="textarea font-mono text-sm"
                placeholder="Write your post content here... Markdown is supported!

**Bold text**
*Italic text*
# Heading 1
## Heading 2
- List item
[Link text](url)
"
              />
              <div className="mt-2 text-xs text-slate-500">
                Markdown supported. Minimum 50 characters required.
              </div>
            </div>
          ) : (
            <div className="min-h-[400px] p-4 border border-slate-200 rounded-lg prose max-w-none">
              {formData.content ? (
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              ) : (
                <p className="text-slate-400">Nothing to preview yet...</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.content.length < 50}
            className="btn btn-primary"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
