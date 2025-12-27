'use client'

import React, { useState, useEffect } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'
import { getEvents, deleteEvent } from '@/lib/events'
import { Event } from '@/types'
import CreateEventModal from '@/components/CreateEventModal'
import ConfirmModal from '@/components/ConfirmModal'

const CATEGORIES = [
  'Konser',
  'Festival',
  'Spor',
  'Sanat & Kültür',
  'Topluluk Buluşması',
  'Akademik',
  'Diğer'
]

export default function EventsPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES)
  const [view, setView] = useState<'Month' | 'Week' | 'List'>('Month')
  
  // Silme işlemi için state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Takvim grid hesaplaması
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Pazartesi başlasın
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  // Verileri çek
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      console.error('Etkinlikler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Kategori filtreleme toggle
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Etkinlik silme
  const handleDelete = async () => {
    if (!deleteId || !user || user.role !== 'admin') return
    
    try {
      setIsDeleting(true)
      await deleteEvent(deleteId, user.uid)
      await fetchEvents() // Listeyi yenile
      setDeleteId(null)
    } catch (error) {
      console.error('Event delete error:', error)
      alert('Etkinlik silinemedi')
    } finally {
      setIsDeleting(false)
    }
  }

  // Günün etkinliklerini al
  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      isSameDay(event.date.toDate(), day) && 
      selectedCategories.includes(event.category)
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      
      {/* Sidebar - Takvim Navigasyon & Filtreler */}
      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          
          {/* Mini Takvim Navigasyonu Kaldırıldı */}

          {/* Kategoriler */}
          <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
            <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Kategoriler
            </p>
            <div className="space-y-3">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-primary focus:ring-primary focus:ring-2" 
                  />
                  <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Ana İçerik */}
      <div className="flex-1 pb-10">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 text-sm mb-4">
          <a className="text-text-secondary-light dark:text-text-secondary-dark hover:underline" href="/">Forum</a>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Etkinlikler</span>
        </div>

        {/* Başlık ve Ekle Butonu */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em]">
              Etkinlik Takvimi
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
              Etkinlikleri görüntüle, filtrele ve takvime ekle.
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span className="truncate">Yeni Etkinlik Ekle</span>
            </button>
          )}
        </div>

        {/* Kontroller */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: tr })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="h-10 px-4 rounded-lg text-sm font-bold text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Bugün
            </button>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Takvim Grid */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
          {/* Gün Başlıkları */}
          <div className="grid grid-cols-7 text-center font-bold text-sm text-text-secondary-light dark:text-text-secondary-dark border-b border-border-light dark:border-border-dark bg-black/5 dark:bg-white/5">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
              <div key={day} className={`py-3 ${i > 0 ? 'border-l border-border-light dark:border-border-dark' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Günler */}
          <div className="grid grid-cols-7 auto-rows-[minmax(80px,auto)]">
            {calendarDays.map((day, i) => {
              const dayEvents = getDayEvents(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)

              return (
                <div 
                  key={day.toISOString()} 
                  className={`
                    p-1.5 border-border-light dark:border-border-dark
                    ${(i + 1) % 7 !== 0 ? 'border-r' : ''} 
                    ${i < calendarDays.length - 7 ? 'border-b' : ''}
                    ${!isCurrentMonth ? 'bg-black/5 dark:bg-white/5 text-text-secondary-light/50 dark:text-text-secondary-dark/50' : ''}
                    min-h-[80px] transition-colors hover:bg-black/5 dark:hover:bg-white/5
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`
                      text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${isTodayDate ? 'bg-primary text-white font-bold' : ''}
                      ${!isCurrentMonth && !isTodayDate ? 'text-text-secondary-light dark:text-text-secondary-dark' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  {/* Etkinlikler */}
                  <div className="mt-1 space-y-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="group relative p-1.5 rounded bg-primary/10 text-primary text-xs font-semibold leading-tight text-left cursor-pointer hover:bg-primary hover:text-white transition-all overflow-hidden"
                      >
                        <div className="truncate">
                          {format(event.date.toDate(), 'HH:mm')} - {event.title}
                        </div>
                        
                        {/* Admin Silme Butonu */}
                        {user?.role === 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteId(event.id)
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-0.5 rounded-full bg-white text-primary hover:bg-red-100 hover:text-red-500 transition-opacity"
                            title="Etkinliği Sil"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchEvents()
          setShowCreateModal(false)
        }}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Etkinliği Sil"
        message="Bu etkinliği silmek istediğinize emin misiniz?"
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </div>
  )
}
