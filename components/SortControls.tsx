'use client'

import { useState } from 'react'

type SortType = 'popular' | 'new' | 'top'

export default function SortControls() {
  const [activeSort, setActiveSort] = useState<SortType>('popular')

  return (
    <div className="flex gap-3 p-3 flex-wrap bg-surface-light dark:bg-surface-dark rounded-xl">
      <button
        onClick={() => setActiveSort('popular')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'popular'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <span className="material-symbols-outlined text-base">
          local_fire_department
        </span>
        <p className={`text-sm ${activeSort === 'popular' ? 'font-bold' : 'font-medium'} leading-normal`}>
          Popüler
        </p>
      </button>

      <button
        onClick={() => setActiveSort('new')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'new'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <span className="material-symbols-outlined text-base">new_releases</span>
        <p className={`text-sm ${activeSort === 'new' ? 'font-bold' : 'font-medium'} leading-normal`}>
          Yeni
        </p>
      </button>

      <button
        onClick={() => setActiveSort('top')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'top'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <span className="material-symbols-outlined text-base">arrow_upward</span>
        <p className={`text-sm ${activeSort === 'top' ? 'font-bold' : 'font-medium'} leading-normal`}>
          En Çok Oylanan
        </p>
      </button>
    </div>
  )
}

