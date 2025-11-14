export default function RightSidebar() {
  return (
    <aside className="hidden lg:block col-span-3">
      <div className="sticky top-24 flex flex-col gap-6">
        {/* Samsun'da Gündem */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
          <h3 className="text-base font-bold mb-3">Samsun'da Gündem</h3>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                1 · #Yemek
              </p>
              <p className="font-semibold text-sm">En iyi dönerci nerede?</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                2 · #Etkinlik
              </p>
              <p className="font-semibold text-sm">Hafta sonu konserleri</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                3 · #Samsunspor
              </p>
              <p className="font-semibold text-sm">Yeni transfer dedikoduları</p>
            </div>
          </div>
        </div>

        {/* Yaklaşan Etkinlikler */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
          <h3 className="text-base font-bold mb-3">Yaklaşan Etkinlikler</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
                <span className="text-xs font-bold">HAZ</span>
                <span className="text-lg font-extrabold -mt-1">15</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Gençlik Festivali</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Doğu Park
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12 flex-shrink-0">
                <span className="text-xs font-bold">HAZ</span>
                <span className="text-lg font-extrabold -mt-1">22</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Samsunspor - Rizespor</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  19 Mayıs Stadyumu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

