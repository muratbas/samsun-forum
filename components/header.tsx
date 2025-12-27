'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { signOut, checkUserExists } from '@/lib/auth'
import LoginModal from './LoginModal'
import NicknameModal from './NicknameModal'
import CreatePostModal from './CreatePostModal'
import Image from 'next/image'

export default function Header() {
  const { user, firebaseUser, loading, refreshUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const hasCheckedNickname = useRef(false)
  
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Google login'den sonra nickname kontrolü
  useEffect(() => {
    // Race condition önlemek için kısa bir gecikme
    const timer = setTimeout(() => {
      const checkNickname = async () => {
        // Loading bitene kadar bekle ve sadece bir kez kontrol et
        if (!loading && firebaseUser && !user && !hasCheckedNickname.current) {
          // Firebase user var ama Firestore'da user yok = yeni kullanıcı
          hasCheckedNickname.current = true
          setShowNicknameModal(true)
        }
        
        // Kullanıcı varsa flag'i sıfırla (logout-login döngüsü için)
        if (user) {
          hasCheckedNickname.current = false
          // Eğer modal açıksa ve user geldiyse kapat
          setShowNicknameModal(false)
        }
      }
      checkNickname()
    }, 1000)

    return () => clearTimeout(timer)
  }, [firebaseUser, user, loading])

  // Login (veya Register) sayfasında header'ı gizle
  if (pathname === '/login' || pathname === '/register') return null

  const handleLoginClick = () => {
    if (user) {
      setShowCreatePostModal(true)
    } else {
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    await signOut()
    setShowUserMenu(false)
    router.refresh()
  }

  const handleNicknameSuccess = async () => {
    // Firestore'a yazma işleminin tamamlanması için kısa bir bekleme
    await new Promise(resolve => setTimeout(resolve, 500))
    setShowNicknameModal(false)
    await refreshUser()
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 sm:px-6 lg:px-8 py-3">
      {/* Logo ve Marka */}
      <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image 
          src="/omu-logo.png" 
          alt="OMÜ Logo" 
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        {/* Desktop'ta tam isim */}
        <h1 className="text-xl font-bold tracking-tight hidden sm:block">
          OMÜForum
        </h1>
        {/* Mobile'da kısa */}
        <h1 className="text-xl font-bold tracking-tight sm:hidden">
          OMÜ
        </h1>
      </a>

      {/* Arama Çubuğu - Sadece tablet+ */}
      <div className="hidden md:flex flex-1 justify-center px-8">
        <label className="flex flex-col w-full max-w-lg h-10">
          <div className="flex w-full items-stretch rounded-lg h-full border border-border-light dark:border-border-dark overflow-hidden">
            <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base"
              placeholder="OMÜ'de Ara..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </label>
      </div>

      {/* Sağ Taraf - Butonlar */}
      <div className="flex flex-1 justify-end gap-2 sm:gap-4">
        {/* Yeni Gönderi Butonu - Desktop'ta text, mobile'da icon */}
        <button 
          onClick={handleLoginClick}
          className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          Yeni Gönderi
        </button>
        <button 
          onClick={handleLoginClick}
          className="flex sm:hidden cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-primary text-white hover:bg-primary/90"
        >
          <span className="material-symbols-outlined">add</span>
        </button>

        {/* Bildirimler Butonu */}
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5"
          title="Bildirimler"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          <span className="material-symbols-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Kullanıcı Avatarı veya Giriş Butonu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-primary overflow-hidden"
              title={user.nickname}
            >
              <Image 
                src={user.photoURL || '/placeholder-avatar.png'} 
                alt={user.nickname}
                fill
                className="object-cover"
                sizes="40px"
              />
            </button>
            
            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-2 z-50">
                <div className="px-4 py-2 border-b border-border-light dark:border-border-dark">
                  <p className="font-bold text-sm">{user.nickname}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span className="hidden sm:inline">Giriş Yap</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
      
      {firebaseUser && (
        <NicknameModal
          isOpen={showNicknameModal}
          firebaseUser={{
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
          }}
          onSuccess={handleNicknameSuccess}
        />
      )}

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onSuccess={refreshPage}
      />
    </header>
  )
}