'use client'

import { Event } from '@/types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'

interface EventDetailModalProps {
  event: Event | null
  onClose: () => void
  onDelete?: (eventId: string) => void
}

export default function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  const { user } = useAuth()
  if (!event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-surface-light dark:bg-surface-dark rounded-xl max-w-lg w-full p-6 my-8 shadow-2xl border border-border-light dark:border-border-dark relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="flex flex-col gap-6">
           {/* Header: Date Badge & Category */}
           <div className="flex items-start justify-between pr-8">
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                   {event.category}
                 </span>
                 <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
                   {event.title}
                 </h2>
              </div>
           </div>

           {/* Info Grid */}
           <div className="grid gap-4 py-2">
              <div className="flex items-start gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined shrink-0 text-primary">calendar_today</span>
                <div>
                  <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                    {format(event.date.toDate(), 'd MMMM yyyy, EEEE', { locale: tr })}
                  </p>
                  <p className="text-sm">
                    {format(event.date.toDate(), 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined shrink-0 text-primary">location_on</span>
                <div>
                  <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                    {event.location}
                  </p>
                </div>
              </div>
           </div>

           {/* Description */}
           {event.description && (
             <div className="border-t border-border-light dark:border-border-dark pt-4">
                <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Etkinlik Hakkında
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
             </div>
           )}

           {/* Footer Action (Delete) */}
           {user?.role === 'admin' && onDelete && (
             <div className="border-t border-border-light dark:border-border-dark pt-4 flex justify-end">
               <button
                 onClick={() => onDelete(event.id)}
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors text-sm font-bold"
               >
                 <span className="material-symbols-outlined text-lg">delete</span>
                 Etkinliği Sil
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
