'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signInWithGoogle, signUpWithEmail, checkNicknameAvailable, createUser } from '@/lib/auth'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading, refreshUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleGoogleLogin = async () => {
    try {
      setError('')
      await signInWithGoogle()
      router.push('/')
    } catch (err: any) {
      console.error('Register error:', err)
      setError(err.message || 'Kayıt sırasında bir hata oluştu.')
    }
  }

  const handleFormRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validasyonlar
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.')
      setIsSubmitting(false)
      return
    }

    if (nickname.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır.')
      setIsSubmitting(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
      setError('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.')
      setIsSubmitting(false)
      return
    }

    try {
      // 1. Nickname kontrolü
      const isAvailable = await checkNicknameAvailable(nickname)
      if (!isAvailable) {
        setError('Bu kullanıcı adı maalesef kullanımda. Lütfen başka bir tane seçin.')
        setIsSubmitting(false)
        return
      }

      // 2. Auth User oluşturma (Email/Pass)
      const firebaseUser = await signUpWithEmail(email, password)
      
      if (firebaseUser) {
        // 3. Firestore'a kullanıcı kaydı (Böylece anasayfada modal çıkmaz)
        await createUser(
          firebaseUser.uid,
          firebaseUser.email || email,
          nickname,
          fullName || 'Adsız', // Ad Soyad boşsa varsayılan
          firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${nickname}&background=random` // Varsayılan avatar
        )
        
        // Context'i güncelle (ÖNEMLİ: Race condition preventing)
        await refreshUser()

        // Yönlendirme
        router.push('/')
      }
    } catch (err: any) {
      console.error('Kayıt hatası:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.')
      } else {
        setError('Kayıt sırasında bir hata oluştu.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-primary-light dark:text-white font-display">
      
      {/* Header / Nav - Sadece Logo */}
      <header className="w-full flex items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-6 py-4 md:px-10 z-10">
        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="size-8 text-primary overflow-hidden rounded-full relative">
             <Image 
                src="/omu-logo.png" 
                alt="OMÜ Logo" 
                fill
                className="object-cover"
              />
          </div>
          <h2 className="text-text-primary-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            OMÜForum
          </h2>
        </div>
        
        {/* Sağ taraf boş */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        
        {/* Left: Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-light dark:bg-surface-dark transition-colors overflow-y-auto">
          <div className="w-full max-w-[480px] flex flex-col gap-6 my-auto">
            
            {/* Header Text */}
            <div className="flex flex-col gap-2">
              <h1 className="text-text-primary-light dark:text-white text-3xl font-bold leading-tight tracking-tight">
                Hesap Oluştur
              </h1>
              <p className="text-text-secondary-light dark:text-gray-400 text-base font-normal">
                OMÜ topluluğunun bir parçası ol.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5 mt-2" onSubmit={handleFormRegister}>
              {/* Full Name */}
              <label className="flex flex-col gap-2">
                <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                  Ad Soyad
                </span>
                <input 
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 px-4 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                  placeholder="Adınız Soyadınız" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>

              {/* Nickname */}
              <label className="flex flex-col gap-2">
                <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                  Kullanıcı Adı (Nickname)
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                  <input 
                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 pl-8 pr-4 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                    placeholder="kullaniciadi" 
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    maxLength={20}
                    required
                  />
                </div>
                <p className="text-xs text-text-secondary-light dark:text-gray-500">
                  Benzersiz bir kullanıcı adı seçin.
                </p>
              </label>

              {/* Email */}
              <label className="flex flex-col gap-2">
                <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                  E-posta Adresi
                </span>
                <input 
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 px-4 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                  placeholder="ogrenci@omu.edu.tr" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              
              {/* Password */}
              <label className="flex flex-col gap-2">
                <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                  Şifre
                </span>
                <div className="relative flex w-full items-stretch rounded-lg">
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 px-4 pr-12 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                    placeholder="Güçlü bir şifre oluşturun" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-text-secondary-light hover:text-text-primary-light dark:hover:text-white transition-colors cursor-pointer" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-text-secondary-light dark:text-gray-500">
                  En az 8 karakter uzunluğunda olmalı.
                </p>
              </label>

              {/* Submit Button */}
              <button 
                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors mt-2 shadow-sm shadow-blue-500/20 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                type="submit"
                disabled={isSubmitting}
              >
                <span className="truncate">{isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
                <span className="flex-shrink mx-4 text-[#93a2b1] text-xs font-medium uppercase tracking-wider">
                  Veya şununla devam et
                </span>
                <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
              </div>

              {/* Social / Alt Login */}
              <div className="flex gap-3">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-[#1a2632] hover:bg-gray-50 dark:hover:bg-[#253240] transition-colors text-sm font-medium text-text-primary-light dark:text-white" 
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google ile Giriş Yap</span>
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-1 mt-4">
              <p className="text-text-secondary-light dark:text-gray-400 text-sm">
                Zaten hesabın var mı?
              </p>
              <button onClick={() => router.push('/login')} className="text-sm font-bold text-primary hover:text-blue-600 transition-colors">
                Giriş Yap
              </button>
            </div>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="hidden lg:block w-1/2 relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6xZXvVpN24iq5iY8Ns_aQqxRhuyNlpFs3xrmqIBFe-WEwaPnylbKhS_7IM8Qbr5EtO8VlGt_pfo8dzy5cEzlxLtlI4XnLISy-lGQBqvdnbCY5pMpkfJnWqVKHI8TEIbjnV9ckWNKA2V8NJh4mLMqGsy5hKhvVHSr0jTU9VnnWLDYE6Utw0ex7fk3OjshDoX4JX5v0niS-prQdzTF24WVepQ9MbLihCc-welALWgEAvAxOOUGFQGuy-L2koqcQ5f6aCvJOTYp18Lo')" }}
          ></div>
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12">
            <div className="max-w-md text-white mb-6">
              <h3 className="text-3xl font-bold mb-4 font-display">
                Akademik topluluğa katıl
              </h3>
              <p className="text-lg opacity-90 font-light">
                OMÜForum ile kampüsteki gelişmeleri takip et, sorularını sor ve yeni arkadaşlıklar kur.
              </p>
            </div>
            

          </div>
        </div>

      </main>
    </div>
  )
}
