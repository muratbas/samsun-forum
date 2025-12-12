'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signInWithGoogle, signInWithEmail, getUserEmailByNickname } from '@/lib/auth'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [emailOrNickname, setEmailOrNickname] = useState('') // Değişken adı daha açıklayıcı olsun
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      console.error('Login error:', err)
      setError(err.message || 'Giriş yapılırken bir hata oluştu.')
    }
  }

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    let loginEmail = emailOrNickname

    // Eğer email formatında değilse nickname sorgusu yap
    if (!emailOrNickname.includes('@')) {
      try {
        const foundEmail = await getUserEmailByNickname(emailOrNickname)
        if (!foundEmail) {
          setError('Bu kullanıcı adıyla kayıtlı bir hesap bulunamadı.')
          setIsSubmitting(false)
          return
        }
        loginEmail = foundEmail
      } catch (err) {
        console.error('Nickname sorgu hatası:', err)
        setError('Kullanıcı sorgulanırken bir hata oluştu.')
        setIsSubmitting(false)
        return
      }
    }

    try {
      await signInWithEmail(loginEmail, password)
      router.push('/')
    } catch (err: any) {
      console.error('Giriş hatası:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-posta adresi (veya kullanıcı adı) veya şifre hatalı.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta formatı.')
      } else {
        setError('Giriş yapılırken bir hata oluştu.')
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
      
      {/* Header / Nav - Bu sayfanın özel header'ı */}
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
        
        <div className="flex gap-4 items-center">
          <span className="hidden sm:block text-sm text-text-secondary-light dark:text-gray-400">
            Üye değil misin?
          </span>
          <button 
            onClick={() => router.push('/register')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
          >
            <span className="truncate">Kayıt Ol</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        
        {/* Left: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-surface-light dark:bg-surface-dark transition-colors">
          <div className="w-full max-w-[480px] flex flex-col gap-6">
            
            {/* Header Text */}
            <div className="flex flex-col gap-2">
              <h1 className="text-text-primary-light dark:text-white text-3xl font-bold leading-tight tracking-tight">
                Tekrar Hoşgeldin
              </h1>
              <p className="text-text-secondary-light dark:text-gray-400 text-base font-normal">
                Öğrenciler ve akademisyenlerle bağlantı kur. Devam etmek için lütfen giriş yap.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5 mt-2" onSubmit={handleFormLogin}>
              {/* Username / Email */}
              <label className="flex flex-col gap-2">
                <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                  Kullanıcı Adı veya E-posta
                </span>
                <input 
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 px-4 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                  placeholder="Kullanıcı adı veya e-posta" 
                  type="text"
                  value={emailOrNickname}
                  onChange={(e) => setEmailOrNickname(e.target.value)}
                />
              </label>
              
              {/* Password */}
              <label className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary-light dark:text-gray-200 text-sm font-medium leading-normal">
                    Şifre
                  </span>
                  <a className="text-sm font-medium text-primary hover:text-blue-600 transition-colors" href="#">
                    Şifremi Unuttum?
                  </a>
                </div>
                <div className="relative flex w-full items-stretch rounded-lg">
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-white dark:bg-[#1a2632] border border-border-light dark:border-border-dark focus:border-primary focus:ring-primary h-12 px-4 pr-12 text-base font-normal placeholder:text-[#93a2b1] transition-all" 
                    placeholder="Şifrenizi girin" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-text-secondary-light hover:text-text-primary-light dark:hover:text-white transition-colors cursor-pointer" type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                  </button>
                </div>
              </label>

              {/* Submit Button */}
              <button 
                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors mt-2 shadow-sm shadow-blue-500/20 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`} 
                type="submit"
                disabled={isSubmitting}
              >
                 <span className="truncate">{isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
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
                Hesabın yok mu?
              </p>
              <button onClick={() => router.push('/register')} className="text-sm font-bold text-primary hover:text-blue-600 transition-colors">
                Kayıt Ol
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
                Akademik sohbete katıl
              </h3>
              <p className="text-lg opacity-90 font-light">
                Araştırmalara erişin, fakülteyle bağlantı kurun ve en son kampüs etkinliklerinden haberdar olun.
              </p>
            </div>
            
            {/* Simple Footer in Image Area */}
            <div className="flex gap-6 text-sm text-white/70 font-medium">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors">Destek</a>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
