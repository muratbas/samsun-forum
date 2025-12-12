'use client'

import { useState, useEffect } from 'react'
import { getPinnedPosts } from '@/lib/posts'
import { Post } from '@/types'
import Link from 'next/link'

export default function RightSidebar() {
  const [pinnedPosts, setPinnedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - sonra Firebase'den gelecek
  const trendingTopics = [
    '#FinalHaftası', '#Sınav', '#Yemekhane', 
    '#Kulüpler', '#Etkinlik', '#Kampüs'
  ]

  useEffect(() => {
    const loadPinnedPosts = async () => {
      try {
        const posts = await getPinnedPosts(3)
        setPinnedPosts(posts)
      } catch (error) {
        console.error('Sabitlenmiş postlar yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPinnedPosts()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      
      {/* Today on Campus / Bugün Kampüste */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light/60 dark:border-border-dark/60">
        <div className="bg-primary px-4 py-3">
          <h3 className="text-white font-bold text-sm">Bugün Kampüste</h3>
        </div>
        <div className="p-4">
          {/* Hava Durumu */}
          <div className="flex items-center gap-3 mb-4">
            <i className="bi bi-cloud-sun-fill text-3xl text-yellow-500"></i>
            <div>
              <p className="font-bold">Hava Durumu</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                18°C / Güneşli
              </p>
            </div>
          </div>
          
          {/* Öne Çıkan Etkinlik */}
          <div className="flex items-start gap-3 pt-3 border-t border-border-light dark:border-border-dark">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <i className="bi bi-calendar-event text-xl text-primary"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-0.5">Öne Çıkan Etkinlik</p>
              <p className="font-semibold text-sm truncate">Kariyer Günleri 2025</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Bugün · 14:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics / Gündemdeki Konular */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
        <h3 className="font-bold text-sm mb-3">Gündemdeki Konular</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, index) => (
            <a
              key={index}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-full transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      </div>

      {/* Official Announcements / Resmi Duyurular */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm">Resmi Duyurular</h3>
          <i className="hgi-stroke hgi-pin text-primary"></i>
        </div>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3">
          Pinned by admin
        </p>
        
        {loading ? (
          <div className="space-y-2">
            <div className="h-16 bg-background-dark/50 rounded-lg animate-pulse"></div>
          </div>
        ) : pinnedPosts.length > 0 ? (
          <div className="space-y-2">
            {pinnedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border-l-2 border-primary transition-colors"
              >
                <p className="text-sm font-semibold line-clamp-2 break-words">
                  {post.title}
                </p>
                {post.content && (
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 line-clamp-1">
                    {post.content}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Henüz sabitlenmiş duyuru yok.
            </p>
          </div>
        )}
      </div>

      {/* Yaklaşan Etkinlikler */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
        <h3 className="font-bold text-sm mb-3">Yaklaşan Etkinlikler</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
              <span className="text-[10px] font-bold">ARA</span>
              <span className="text-lg font-extrabold -mt-1">20</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Kariyer Günleri</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Kongre Merkezi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
              <span className="text-[10px] font-bold">ARA</span>
              <span className="text-lg font-extrabold -mt-1">25</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Yılbaşı Konseri</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Amfi Tiyatro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
              <span className="text-[10px] font-bold">OCA</span>
              <span className="text-lg font-extrabold -mt-1">10</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Final Dönemi Başlangıcı</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Tüm Fakülteler
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
