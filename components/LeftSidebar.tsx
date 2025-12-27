'use client'

import { useSidebar } from '@/contexts/SidebarContext'

export default function LeftSidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar()

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light/50 dark:border-border-dark/50
        transition-transform duration-300 ease-in-out z-40
        top-[61px]
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        lg:translate-x-0 lg:shadow-none
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-custom px-4 py-4">
          
          {/* Main Feeds / Ana Akışlar */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark px-3 py-2">
              Ana Akışlar
            </h3>
            <nav className="flex flex-col gap-0.5">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary"
                href="/"
              >
                <i className="bi bi-house-door text-xl"></i>
                <span className="text-sm font-medium">Anasayfa</span>
              </a>
            </nav>
          </div>

          {/* Academic Hub / Akademik */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark px-3 py-2">
              Akademik
            </h3>
            <nav className="flex flex-col gap-0.5">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                href="/not-bankasi"
              >
                <i className="bi bi-journal-bookmark text-xl"></i>
                <span className="text-sm font-normal">Not Bankası</span>
              </a>
            </nav>
          </div>

          {/* Campus Life / Kampüs Hayatı */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark px-3 py-2">
              Kampüs Hayatı
            </h3>
            <nav className="flex flex-col gap-0.5">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                href="/itiraflar"
              >
                <i className="hgi-stroke hgi-anonymous text-xl"></i>
                <span className="text-sm font-normal">İtiraflar</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                href="/kulupler"
              >
                <i className="bi bi-people text-xl"></i>
                <span className="text-sm font-normal">Kulüpler & Topluluklar</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                href="/etkinlikler"
              >
                <i className="hgi-stroke hgi-calendar-01 text-xl"></i>
                <span className="text-sm font-normal">Etkinlik Takvimi</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                href="https://sks.omu.edu.tr/gunun-yemegi/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="hgi-stroke hgi-restaurant-02 text-xl"></i>
                <span className="text-sm font-normal">Yemekhane Menüsü</span>
              </a>
            </nav>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light/50 dark:border-border-dark/50 mt-auto">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
            <a href="#" className="hover:underline">Hakkımızda</a>
            <a href="#" className="hover:underline">İletişim</a>
            <a href="#" className="hover:underline">Kurallar</a>
          </div>
          <p className="text-[11px] text-text-secondary-light/60 dark:text-text-secondary-dark/60 leading-normal">
            &copy; 2026 OMÜForum. <br/> Tüm hakları saklıdır.
          </p>
        </div>
      </aside>
    </>
  )
}
