'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createPost } from '@/lib/posts'
import { TOPICS, getTopicById } from '@/lib/topics'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [pinned, setPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  // Modal açıldığında formu sıfırla
  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setContent('')
      setSelectedTopic('')
      setPinned(false)
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasyon
    if (title.length < 5) {
      setError('Başlık en az 5 karakter olmalı')
      return
    }

    if (!user) {
      setError('Giriş yapman gerekiyor')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Konu seçilmişse onu kullan, yoksa "Genel" kullan
      const topic = selectedTopic ? getTopicById(selectedTopic) : null
      const topicId = topic?.id || 'genel'
      const topicName = topic?.name || 'Genel'
      
      await createPost(
        user.uid,
        user.nickname,
        user.photoURL,
        title,
        content,
        topicId,
        topicName,
        undefined, // imageUrl
        user.role,
        isAdmin ? pinned : false
      )

      // Formu temizle ve kapat
      setTitle('')
      setContent('')
      setSelectedTopic('')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Post oluşturma hatası:', error)
      setError('Post oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl max-w-2xl w-full p-6 my-8">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Yeni Gönderi Oluştur</h2>
          <button
            onClick={onClose}
            className="text-text-secondary-dark hover:text-text-primary-dark"
            disabled={loading}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Başlık <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gönderinize bir başlık verin..."
              className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={50}
              disabled={loading}
            />
            <p className="text-xs text-text-secondary-dark mt-1">
              {title.length}/50
            </p>
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-sm font-medium mb-2">
              İçerik (Opsiyonel)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detayları buraya yazabilirsin..."
              className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={6}
              maxLength={2000}
              disabled={loading}
            />
            <p className="text-xs text-text-secondary-dark mt-1">
              {content.length}/2000
            </p>
          </div>

          {/* Konu Seçimi - Baloncuk/Tag Formatı */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Etiketler <span className="text-text-secondary-dark font-normal">(Opsiyonel)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? '' : topic.id)}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTopic === topic.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-dark/80 text-text-primary-dark hover:bg-surface-dark'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span>{topic.name}</span>
                  {selectedTopic === topic.id && (
                    <span className="text-white/80 hover:text-white">✕</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary-dark mt-2">
              e.g., traffic, help, news
            </p>
          </div>

          {/* Admin: Sabitle Toggle */}
          {isAdmin && (
            <div className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-lg">
              <div className="flex items-center gap-2">
                <i className="hgi-stroke hgi-pin text-lg text-primary"></i>
                <span className="text-sm font-medium">Resmi Duyuru Olarak Sabitle</span>
              </div>
              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                disabled={loading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  pinned ? 'bg-primary' : 'bg-border-dark'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    pinned ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Hata mesajı */}
          {error && (
            <div className="bg-primary/10 border border-primary text-primary rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-background-light dark:bg-background-dark text-text-primary-dark rounded-lg py-3 px-4 font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || title.length < 5}
              className="flex-1 bg-primary text-white rounded-lg py-3 px-4 font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

