export default function LeftSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-[61px] bg-surface-light dark:bg-surface-dark border-r border-border-light/50 dark:border-border-dark/50">
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-custom px-4 py-4">
        
        {/* Main Feeds / Ana Akışlar */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider px-3 py-2">
            Ana Akışlar
          </h3>
          <nav className="flex flex-col gap-0.5">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary"
              href="/"
            >
              <i className="bi bi-house-door-fill text-lg"></i>
              <span className="text-sm font-medium">Anasayfa</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/popular"
            >
              <i className="bi bi-star-fill text-lg"></i>
              <span className="text-sm font-normal">Popüler</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/fresh"
            >
              <i className="bi bi-lightning-fill text-lg"></i>
              <span className="text-sm font-normal">Taze</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/subscriptions"
            >
              <i className="bi bi-rss-fill text-lg"></i>
              <span className="text-sm font-normal">Aboneliklerim</span>
            </a>
          </nav>
        </div>

        {/* Academic Hub / Akademik */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider px-3 py-2">
            Akademik
          </h3>
          <nav className="flex flex-col gap-0.5">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/notes"
            >
              <i className="bi bi-journal-bookmark-fill text-lg"></i>
              <span className="text-sm font-normal">Not Bankası</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/professors"
            >
              <i className="bi bi-mortarboard-fill text-lg"></i>
              <span className="text-sm font-normal">Hoca Değerlendirmeleri</span>
            </a>
          </nav>
        </div>

        {/* Campus Life / Kampüs Hayatı */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider px-3 py-2">
            Kampüs Hayatı
          </h3>
          <nav className="flex flex-col gap-0.5">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/confessions"
            >
              <i className="bi bi-incognito text-lg"></i>
              <span className="text-sm font-normal">İtiraflar</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/clubs"
            >
              <i className="bi bi-people-fill text-lg"></i>
              <span className="text-sm font-normal">Kulüpler & Topluluklar</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/events"
            >
              <i className="bi bi-calendar-event-fill text-lg"></i>
              <span className="text-sm font-normal">Etkinlik Takvimi</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/cafeteria"
            >
              <i className="bi bi-cup-hot-fill text-lg"></i>
              <span className="text-sm font-normal">Yemekhane Menüsü</span>
            </a>
          </nav>
        </div>

        {/* Marketplace / Pazar Yeri */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider px-3 py-2">
            Pazar Yeri
          </h3>
          <nav className="flex flex-col gap-0.5">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/marketplace/books"
            >
              <i className="bi bi-book-half text-lg"></i>
              <span className="text-sm font-normal">İkinci El Kitaplar</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/marketplace/housing"
            >
              <i className="bi bi-house-door-fill text-lg"></i>
              <span className="text-sm font-normal">Yurt / Ev</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              href="/marketplace/lost-found"
            >
              <i className="bi bi-search-heart text-lg"></i>
              <span className="text-sm font-normal">Kayıp & Bulundu</span>
            </a>
          </nav>
        </div>

      </div>
    </aside>
  )
}
