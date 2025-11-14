'use client'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 sm:px-6 lg:px-8 py-3">
      {/* Logo and Brand */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            forum
          </span>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Samsun Forum
          </h1>
          <h1 className="text-xl font-bold tracking-tight sm:hidden">
            SF
          </h1>
        </div>
      </div>

      {/* Search Bar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex flex-1 justify-center px-8">
        <label className="flex flex-col w-full max-w-lg h-10">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-background-light dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal"
              placeholder="Samsun'da Ara..."
              type="text"
            />
          </div>
        </label>
      </div>

      {/* Right Actions */}
      <div className="flex flex-1 justify-end gap-2 sm:gap-4">
        <button className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90">
          <span className="truncate">Yeni Gönderi</span>
        </button>
        
        {/* Mobile: Only icon */}
        <button className="flex sm:hidden cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-primary text-white hover:bg-primary/90">
          <span className="material-symbols-outlined">add</span>
        </button>

        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-text-secondary-light dark:text-text-secondary-dark gap-2 text-sm font-bold leading-normal min-w-0 px-2.5 hover:bg-black/5 dark:hover:bg-white/5">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-text-secondary-light dark:text-text-secondary-dark gap-2 text-sm font-bold leading-normal min-w-0 px-2.5 hover:bg-black/5 dark:hover:bg-white/5">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>

        {/* User Avatar */}
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-primary"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnqhsGp5t0wkjfXQ-UZi6SeNiWYwudOKz1oPQDMRtkIzBmaIF6dtAv1qHOCBi8NGEArimpF2q05dwtySINaI4UavySwvsOk3FmdOOXZIq0va_3WkQgtvQAn_47bu0tNlUIbQlhvo9Py4KsFJqtGO0AHK12k0pmZMWyQisuKvCIYfjj3EJOo7kja0VZ1M8Pa7wSdfQRpn3HAH5Pe08tA1xe0hdGopcGv7fijGHGI3Ed20lx1lrY7YsE-e8gb8Bz433cjalwyJVU6oE")',
          }}
          title="Profil"
        />
      </div>
    </header>
  )
}

