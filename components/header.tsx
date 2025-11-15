'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut, checkUserExists } from '@/lib/auth'
import LoginModal from './LoginModal'
import NicknameModal from './NicknameModal'
import CreatePostModal from './CreatePostModal'

export default function Header() {
  const { user, firebaseUser, loading, refreshUser } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Google login'den sonra nickname kontrolü
  useEffect(() => {
    console.log('Header useEffect:', { 
      firebaseUser: firebaseUser?.uid, 
      user: user?.nickname, 
      loading 
    })
    
    const checkNickname = async () => {
      if (firebaseUser && !user && !loading) {
        console.log('Nickname modal açılıyor - yeni kullanıcı')
        // Firebase user var ama Firestore'da user yok = yeni kullanıcı
        setShowNicknameModal(true)
      }
    }
    checkNickname()
  }, [firebaseUser, user, loading])

  const handleLoginClick = () => {
    if (user) {
      setShowCreatePostModal(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setShowUserMenu(false)
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
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl">
          forum
        </span>
        {/* Desktop'ta tam isim */}
        <h1 className="text-xl font-bold tracking-tight hidden sm:block">
          Samsun Forum
        </h1>
        {/* Mobile'da kısa */}
        <h1 className="text-xl font-bold tracking-tight sm:hidden">
          SF
        </h1>
      </div>

      {/* Arama Çubuğu - Sadece tablet+ */}
      <div className="hidden md:flex flex-1 justify-center px-8">
        <label className="flex flex-col w-full max-w-lg h-10">
          <div className="flex w-full items-stretch rounded-lg h-full">
            <div className="text-text-secondary-dark flex bg-background-dark items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 rounded-r-lg text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-background-dark h-full placeholder:text-text-secondary-dark px-4 pl-2 text-base"
              placeholder="Samsun'da Ara..."
              type="text"
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

        {/* Kullanıcı Avatarı veya Giriş Butonu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-primary"
              style={{
                backgroundImage: `url("${user.photoURL}")`,
              }}
              title={user.nickname}
            />
            
            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-2 z-50">
                <div className="px-4 py-2 border-b border-border-light dark:border-border-dark">
                  <p className="font-bold text-sm">u/{user.nickname}</p>
                  <p className="text-xs text-text-secondary-dark">{user.karma} karma</p>
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
            onClick={() => setShowLoginModal(true)}
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