'use client'

import { useState, useEffect } from 'react'
import { getPinnedPosts } from '@/lib/posts'
import { getUpcomingEvents } from '@/lib/events'
import { getRandomQuote } from '@/lib/ataturkQuotes'
import { getCurrentWeather, WeatherData } from '@/lib/weather'
import { Post, Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { format, isToday } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function RightSidebar() {
  const [pinnedPosts, setPinnedPosts] = useState<Post[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock data - Manuel Gündem Başlıkları
  const trendingTopics = [
    '#FinalHaftası', '#Sınav', '#Yemekhane', 
    '#Kulüpler', '#Etkinlik', '#Kampüs'
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, eventsData, weatherData] = await Promise.all([
          getPinnedPosts(3),
          getUpcomingEvents(5), // Bugün + 4 gelecek etkinlik çekelim
          getCurrentWeather()
        ])
        setPinnedPosts(postsData)
        setEvents(eventsData)
        setWeather(weatherData)
      } catch (error) {
        console.error('Veriler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Sayfa yüklendiğinde rastgele bir söz seç (Client-side only)
    setQuote(getRandomQuote())
  }, [])

  // Bugünün etkinliğini bul (Saati geçmişse gösterme, sıradakini göster)
  const now = new Date()
  
  // Bugüne ait ve saati henüz geçmemiş etkinlikleri bul
  const todaysUpcomingEvents = events.filter(event => {
    const eventDate = event.date.toDate()
    return isToday(eventDate) && eventDate > now
  })
  
  // En yakın olanı seç
  const todayEvent = todaysUpcomingEvents[0]
  
  // Yaklaşan etkinlikler (Bugünün dışındakiler)
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
            {weather ? (
              <>
                <i className={`bi ${weather.icon} text-3xl ${weather.color}`}></i>
                <div>
                  <p className="font-bold">Kampüs</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {weather.temperature}°C / {weather.condition}
                  </p>
                </div>
              </>
            ) : (
              <>
                <i className="bi bi-cloud-sun-fill text-3xl text-gray-300 dark:text-gray-600 animate-pulse"></i>
                <div>
                  <p className="font-bold text-gray-400">Yükleniyor...</p>
                </div>
              </>
            )}
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

      {/* Atatürk'ten Söz */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light/60 dark:border-border-dark/60 shadow-sm relative overflow-hidden group">
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 opacity-100">
            <i className="hgi-stroke hgi-quote-down text-2xl text-primary"></i>
          </div>
          
          <p className="font-display font-medium text-sm leading-relaxed mb-6 italic text-text-primary-light dark:text-text-primary-dark">
            &quot;{quote}&quot;
          </p>
          
          <div className="relative w-40 h-16 mt-auto opacity-100">
            <Image 
              src="/images/ataturk-signature.png" 
              alt="M.K. Atatürk" 
              fill
              className="object-contain dark:invert"
              priority
            />
          </div>
        </div>
      </div>

    </div>
  )
}
