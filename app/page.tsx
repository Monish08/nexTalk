import { PostFeed } from '@/components/post-feed'
import { CategoryList } from '@/components/category-list'
import { TrendingPosts } from '@/components/trending-posts'

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-8">
        <div className="mb-6">
          <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Welcome to NexTalk
          </h1>
          <p className="text-slate-600">
            Join the conversation. Share your thoughts. Connect with the community.
          </p>
        </div>
        
        <PostFeed />
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-6">
        <CategoryList />
        <TrendingPosts />
      </aside>
    </div>
  )
}
