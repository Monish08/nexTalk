'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Hash } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  _count: {
    posts: number
  }
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-shimmer"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Hash className="h-5 w-5 mr-2 text-brand-600" />
        Categories
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/c/${category.slug}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon || '📁'}</span>
              <div>
                <div className="font-medium group-hover:text-brand-600 transition-colors">
                  {category.name}
                </div>
                <div className="text-xs text-slate-500">
                  {category._count.posts} posts
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
