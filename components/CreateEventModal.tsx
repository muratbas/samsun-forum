'use client'

import { useState } from 'react'
import { createEvent } from '@/lib/events'
import { useAuth } from '@/contexts/AuthContext'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  'Konser',
  'Festival',
  'Spor',
  'Sanat & Kültür',
  'Topluluk Buluşması',
  'Akademik',
  'Diğer'
]

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const { user } = useAuth()
  const today = new Date()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`)
  const [time, setTime] = useState('12:00')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'admin') return

    try {
      setLoading(true)
      setError('')

      const eventDate = new Date(`${date}T${time}`)
      
      if (isNaN(eventDate.getTime())) {
        throw new Error('Geçersiz tarih formatı')
      }

      await createEvent(
        title,
        description,
        location,
        eventDate,
        category,
        user.uid
      )

      // Reset form
      setTitle('')
      setDescription('')
      setLocation('')
      // Tarihi resetleme, bugünde kalsın kolaylık olsun
      setCategory(CATEGORIES[0])
      
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Etkinlik oluşturulurken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl max-w-lg w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Yeni Etkinlik Ekle</h2>
          <button
            onClick={onClose}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            disabled={loading}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Etkinlik adı..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama <span className="text-text-secondary-light/60 dark:text-text-secondary-dark/60 font-normal">(Opsiyonel)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Detaylar..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Konum</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Örn: Kongre Merkezi..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tarih</label>
              <div className="flex gap-2">
                <select
                  value={parseInt(date.split('-')[2] || '1')}
                  onChange={(e) => {
                    const [y, m, d] = (date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`).split('-')
                    setDate(`${y}-${m}-${e.target.value.padStart(2, '0')}`)
                  }}
                  className="w-20 px-2 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={parseInt(date.split('-')[1] || '1')}
                  onChange={(e) => {
                    const [y, m, d] = (date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`).split('-')
                    setDate(`${y}-${e.target.value.padStart(2, '0')}-${d}`)
                  }}
                  className="flex-1 px-2 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={parseInt(date.split('-')[0] || new Date().getFullYear().toString())}
                  onChange={(e) => {
                    const [y, m, d] = (date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`).split('-')
                    setDate(`${e.target.value}-${m}-${d}`)
                  }}
                  className="w-24 px-2 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Saat</label>
              <div className="flex gap-2 items-center">
                <select
                  value={parseInt(time.split(':')[0] || '12')}
                  onChange={(e) => {
                    const m = time.split(':')[1] || '00'
                    setTime(`${e.target.value.padStart(2, '0')}:${m}`)
                  }}
                  className="w-20 px-2 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  {Array.from({ length: 24 }, (_, i) => i).map(h => (
                    <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="font-bold">:</span>
                <select
                  value={parseInt(time.split(':')[1] || '00')}
                  onChange={(e) => {
                    const h = time.split(':')[0] || '12'
                    setTime(`${h}:${e.target.value.padStart(2, '0')}`)
                  }}
                  className="w-20 px-2 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                    <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
