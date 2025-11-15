'use client'

import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import { getPosts } from '@/lib/posts'
import { Post } from '@/types'

interface PostFeedProps {
  sortBy?: 'new' | 'hot' | 'top'
}

export default function PostFeed({ sortBy = 'hot' }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await getPosts(sortBy)
      setPosts(fetchedPosts)
    } catch (err) {
      console.error('Postları yüklerken hata:', err)
      setError('Postlar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 animate-pulse"
          >
            <div className="h-4 bg-background-dark rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-background-dark rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 text-center">
        <p className="text-primary mb-4">{error}</p>
        <button
          onClick={loadPosts}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-text-secondary-dark mb-4">
          forum
        </span>
        <h3 className="text-xl font-bold mb-2">Henüz gönderi yok</h3>
        <p className="text-text-secondary-dark">
          İlk gönderiyi sen paylaş!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

