'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { 
  Bell, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Plus, 
  Search, 
  User, 
  X 
} from 'lucide-react'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-2xl font-display font-bold"
          >
            <MessageSquare className="h-8 w-8 text-brand-600" />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              NexTalk
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="input pl-10"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/create" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Link>
                
                <Link href="/notifications" className="btn btn-ghost relative">
                  <Bell className="h-5 w-5" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-white">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-lg border border-slate-200 bg-white shadow-lg">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center w-full px-4 py-3 hover:bg-slate-50 transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden btn btn-ghost"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="input pl-10"
                />
              </div>
            </form>

            {session ? (
              <div className="space-y-2">
                <Link href="/create" className="btn btn-primary w-full justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Link>
                <Link href="/notifications" className="btn btn-ghost w-full justify-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Link>
                <Link href="/dashboard" className="btn btn-ghost w-full justify-center">
                  <User className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn btn-ghost w-full justify-center text-red-600"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/signin" className="btn btn-ghost w-full justify-center">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary w-full justify-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
