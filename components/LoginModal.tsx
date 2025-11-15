'use client'

import { useState } from 'react'
import { signInWithGoogle } from '@/lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
      onSuccess()
    } catch (error: any) {
      console.error('Giriş hatası:', error)
      setError('Giriş yapılamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl max-w-md w-full p-6">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Samsun Forum&apos;a Hoş Geldin!</h2>
          <button
            onClick={onClose}
            className="text-text-secondary-dark hover:text-text-primary-dark"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* İçerik */}
        <div className="space-y-4">
          <p className="text-text-secondary-dark">
            Gönderi paylaşmak ve oylama yapmak için giriş yapman gerekiyor.
          </p>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-primary/10 border border-primary text-primary rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Google ile giriş */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 rounded-lg py-3 px-4 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Giriş yapılıyor...' : 'Google ile Devam Et'}
          </button>

          <p className="text-xs text-text-secondary-dark text-center">
            Giriş yaparak{' '}
            <a href="/rules" className="text-primary hover:underline">
              Topluluk Kurallarını
            </a>{' '}
            kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  )
}

