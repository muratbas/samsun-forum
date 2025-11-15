'use client'

import { useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasyon
    if (title.length < 5) {
      setError('Başlık en az 5 karakter olmalı')
      return
    }

    if (!selectedTopic) {
      setError('Lütfen bir konu seç')
      return
    }

    if (!user) {
      setError('Giriş yapman gerekiyor')
      return
    }

    setLoading(true)
    setError('')

    try {
      const topic = getTopicById(selectedTopic)!
      
      await createPost(
        user.uid,
        user.nickname,
        user.photoURL,
        title,
        content,
        topic.id,
        topic.name
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
              maxLength={200}
              disabled={loading}
            />
            <p className="text-xs text-text-secondary-dark mt-1">
              {title.length}/200
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
              maxLength={5000}
              disabled={loading}
            />
            <p className="text-xs text-text-secondary-dark mt-1">
              {content.length}/5000
            </p>
          </div>

          {/* Konu Seçimi - Liste Formatı */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Konu Seç <span className="text-primary">*</span>
            </label>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  disabled={loading}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    selectedTopic === topic.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="text-sm font-bold text-primary">#</span>
                  <span className="text-sm font-bold leading-normal">
                    {topic.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
              disabled={loading || title.length < 5 || !selectedTopic}
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

