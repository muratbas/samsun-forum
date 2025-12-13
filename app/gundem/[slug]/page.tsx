'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPostsByTopic } from '@/lib/posts'
import { getTopicBySlug } from '@/lib/topics'
import { Post } from '@/types'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const topic = getTopicBySlug(slug)

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (topic) {
      const loadData = async () => {
        try {
          setLoading(true)
          const data = await getPostsByTopic(topic.id)
          setPosts(data)
        } catch (error) {
          console.error('Topic postları yüklenemedi:', error)
        } finally {
          setLoading(false)
        }
      }
      loadData()
    } else {
      setLoading(false)
    }
  }, [topic])

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64">
           <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-3xl text-gray-400">search_off</span>
             </div>
             <h1 className="text-2xl font-bold mb-2">Konu Bulunamadı</h1>
             <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
               Aradığınız konu başlığı mevcut değil veya kaldırılmış olabilir.
             </p>
             <Link href="/" className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
               Ana Sayfaya Dön
             </Link>
           </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              
              {/* Topic Header */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light/60 dark:border-border-dark/60 mb-6 flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ 
                    backgroundColor: topic.iconColor ? `${topic.iconColor}15` : 'rgba(227, 6, 19, 0.1)',
                    color: topic.iconColor || '#E30613'
                  }}
                >
                  <span className="material-symbols-outlined">{topic.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">#{topic.name}</h1>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Posts */}
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 animate-pulse h-40"></div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onDelete={() => handlePostDelete(post.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-12 text-center border border-border-light/60 dark:border-border-dark/60">
                  <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">post_add</span>
                  <h3 className="text-lg font-bold mb-2">Henüz gönderi yok</h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                    #{topic.name} etiketiyle ilk paylaşımı sen yap!
                  </p>
                </div>
              )}

            </div>
            
            {/* Right Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
