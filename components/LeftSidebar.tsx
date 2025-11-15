import { TOPICS } from '@/lib/topics'

export default function LeftSidebar() {
    return (
      <aside className="hidden lg:block col-span-3">
        <div className="sticky top-24 flex h-full flex-col justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-xl">
          <div className="flex flex-col gap-4">
            {/* Ana Navigasyon */}
            <div className="flex flex-col gap-2">
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary"
                href="/"
              >
                <span className="material-symbols-outlined">home</span>
                <p className="text-sm font-bold leading-normal">Anasayfa</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                href="/popular"
              >
                <span className="material-symbols-outlined">trending_up</span>
                <p className="text-sm font-medium leading-normal">Popüler</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                href="/new"
              >
                <span className="material-symbols-outlined">new_releases</span>
                <p className="text-sm font-medium leading-normal">Yeni</p>
              </a>
            </div>
  
            {/* Ayırıcı Çizgi */}
            <div className="border-t border-border-light dark:border-border-dark my-2"></div>
  
            {/* Popüler Konular */}
            <div className="flex flex-col">
              <h2 className="text-base font-bold leading-normal px-3 pb-2">
                Konular
              </h2>
              {TOPICS.map((topic) => (
                <a
                  key={topic.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 group"
                  href={`/topic/${topic.slug}`}
                  title={topic.description}
                >
                  <span className="text-sm font-bold text-primary">#</span>
                  <p className="text-sm font-bold leading-normal group-hover:text-primary transition-colors">
                    {topic.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
  
          {/* Alt Kısım - Kurallar ve SSS */}
          <div className="flex flex-col gap-1 mt-8">
            <div className="border-t border-border-light dark:border-border-dark my-2"></div>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              href="/rules"
            >
              <span className="material-symbols-outlined text-sm">gavel</span>
              <p className="text-sm font-medium leading-normal">
                Topluluk Kuralları
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              href="/faq"
            >
              <span className="material-symbols-outlined text-sm">help</span>
              <p className="text-sm font-medium leading-normal">SSS</p>
            </a>
          </div>
        </div>
      </aside>
    )
  }