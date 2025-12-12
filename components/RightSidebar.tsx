'use client'

import { useState, useEffect } from 'react'
import { getPinnedPosts } from '@/lib/posts'
import { getUpcomingEvents } from '@/lib/events'
import { Post, Event } from '@/types'
import Link from 'next/link'
import { format, isToday } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function RightSidebar() {
  const [pinnedPosts, setPinnedPosts] = useState<Post[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - sonra Firebase'den gelecek
  const trendingTopics = [
    '#FinalHaftası', '#Sınav', '#Yemekhane', 
    '#Kulüpler', '#Etkinlik', '#Kampüs'
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, eventsData] = await Promise.all([
          getPinnedPosts(3),
          getUpcomingEvents(5) // Bugün + 4 gelecek etkinlik çekelim
        ])
        setPinnedPosts(postsData)
        setEvents(eventsData)
      } catch (error) {
        console.error('Veriler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Bugünün etkinliğini bul
  const todayEvent = events.find(event => isToday(event.date.toDate()))
  
  // Yaklaşan etkinlikler (Bugünün etkinliğini listeden çıkarıp ilk 3'ünü al)
  const upcomingEvents = events
    .filter(event => !isToday(event.date.toDate()))
    .slice(0, 3)

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
          
          {/* Öne Çıkan Etkinlik (Bugünün Etkinliği) */}
          <div className="flex items-start gap-3 pt-3 border-t border-border-light dark:border-border-dark">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <i className="bi bi-calendar-event text-xl text-primary"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-0.5">Öne Çıkan Etkinlik</p>
              {todayEvent ? (
                <>
                  <p className="font-semibold text-sm truncate" title={todayEvent.title}>{todayEvent.title}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                    {format(todayEvent.date.toDate(), 'HH:mm')} • {todayEvent.location}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Bugün planlanmış etkinlik yok.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics / Gündem */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
        <h3 className="font-bold text-sm mb-3">Gündem Başlıkları</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, index) => (
            <Link 
              key={index} 
              href={`/topic/${topic.replace('#', '')}`}
              className="text-xs font-medium px-3 py-1.5 bg-background-light dark:bg-white/5 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* Official Announcements / Resmi Duyurular */}
      {pinnedPosts.length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
          <div className="flex items-center gap-2 mb-3">
            <i className="hgi-stroke hgi-pin text-primary"></i>
            <h3 className="font-bold text-sm">Resmi Duyurular</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {pinnedPosts.map(post => (
              <div key={post.id} className="group">
                <Link href={`/post/${post.id}`}>
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {(post.authorRole === 'admin' || post.authorRole === 'moderator') ? 'Yönetici Duyurusu' : `Gönderen: ${post.authorNickname}`}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yaklaşan Etkinlikler */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Yaklaşan Etkinlikler</h3>
          <Link href="/etkinlikler" className="text-xs text-primary hover:underline">
            Tümünü Gör
          </Link>
        </div>
        
        <div className="flex flex-col gap-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase">
                    {format(event.date.toDate(), 'MMM', { locale: tr }).replace('.', '')}
                  </span>
                  <span className="text-lg font-extrabold -mt-1">
                    {format(event.date.toDate(), 'dd')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" title={event.title}>{event.title}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                    {event.location}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Yakın zamanda etkinlik bulunmuyor.
            </p>
          )}
        </div>
      </div>

    </div>
  )
}
