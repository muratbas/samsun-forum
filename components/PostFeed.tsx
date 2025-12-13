'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from './PostCard'
import { getPosts } from '@/lib/posts'
import { Post } from '@/types'

interface PostFeedProps {
  sortBy?: 'new' | 'popular' | 'top'
}

export default function PostFeed({ sortBy = 'popular' }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchQuery])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await getPosts(sortBy)
      
      if (searchQuery) {
        const query = searchQuery.trim().toLowerCase()
        
        if (query.startsWith('@')) {
          // Kullanıcı adına göre arama (@nickname)
          const nicknameQuery = query.substring(1) // @ işaretini kaldır
          const filtered = fetchedPosts.filter(post => 
            post.authorNickname.toLowerCase().includes(nicknameQuery)
          )
          setPosts(filtered)
        } else {
          // Normal arama (Başlık ve İçerik)
          const filtered = fetchedPosts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            (post.content && post.content.toLowerCase().includes(query))
          )
          setPosts(filtered)
        }
      } else {
        setPosts(fetchedPosts)
      }
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
    if (searchQuery) {
      return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 text-center border border-border-light/60 dark:border-border-dark/60">
          <span className="material-symbols-outlined text-6xl text-text-secondary-dark mb-4">search_off</span>
          <h3 className="text-xl font-bold mb-2">Sonuç bulunamadı</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            "{searchQuery}" için herhangi bir gönderi bulamadık.
          </p>
        </div>
      )
    }

    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-8 text-center border border-border-light/60 dark:border-border-dark/60">
        <span className="material-symbols-outlined text-6xl text-text-secondary-dark mb-4">
          forum
        </span>
        <h3 className="text-xl font-bold mb-2">Henüz gönderi yok</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          İlk gönderiyi sen paylaş!
        </p>
      </div>
    )
  }

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId))
  }

  return (
    <div className="flex flex-col gap-4">
      {searchQuery && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60 mb-2">
          <p className="text-sm font-medium">
            <span className="text-primary">"{searchQuery}"</span> için arama sonuçları ({posts.length}):
          </p>
        </div>
      )}
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onDelete={() => handlePostDelete(post.id)}
        />
      ))}
    </div>
  )
}
