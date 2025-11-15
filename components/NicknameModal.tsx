'use client'

import { useState } from 'react'
import { createUser, checkNicknameAvailable } from '@/lib/auth'

interface NicknameModalProps {
  isOpen: boolean
  firebaseUser: {
    uid: string
    email: string
    displayName: string
    photoURL: string
  }
  onSuccess: () => void
}

export default function NicknameModal({ isOpen, firebaseUser, onSuccess }: NicknameModalProps) {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (nickname.length < 3) {
      setError('Nickname en az 3 karakter olmalı')
      return
    }
    
    if (nickname.length > 20) {
      setError('Nickname en fazla 20 karakter olabilir')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
      setError('Nickname sadece harf, rakam ve _ içerebilir')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Nickname kullanımda mı kontrol et
      const available = await checkNicknameAvailable(nickname)
      
      if (!available) {
        setError('Bu nickname zaten kullanılıyor')
        setLoading(false)
        return
      }

      // Kullanıcıyı oluştur
      await createUser(
        firebaseUser.uid,
        firebaseUser.email,
        nickname,
        firebaseUser.displayName,
        firebaseUser.photoURL
      )

      onSuccess()
    } catch (error: any) {
      console.error('Nickname kaydetme hatası:', error)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl max-w-md w-full p-6">
        {/* Başlık */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Hoş Geldin! 👋</h2>
          <p className="text-text-secondary-dark">
            Kendine bir nickname seç. Bu isimle toplulukta görüneceksin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ornek_kullanici"
              className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={20}
              disabled={loading}
            />
            <p className="text-xs text-text-secondary-dark mt-1">
              3-20 karakter, sadece harf, rakam ve _ kullanabilirsin
            </p>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-primary/10 border border-primary text-primary rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Butonlar */}
          <button
            type="submit"
            disabled={loading || nickname.length < 3}
            className="w-full bg-primary text-white rounded-lg py-3 px-4 font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Devam Et'}
          </button>
        </form>

        <p className="text-xs text-text-secondary-dark text-center mt-4">
          Nickname&apos;ini daha sonra değiştiremezsin, dikkatli seç!
        </p>
      </div>
    </div>
  )
}

