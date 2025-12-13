'use client'

import { useState } from 'react'

type SortType = 'popular' | 'new' | 'top'

interface SortControlsProps {
  onSortChange?: (sort: SortType) => void
}

export default function SortControls({ onSortChange }: SortControlsProps) {
  const [activeSort, setActiveSort] = useState<SortType>('new')

  const handleSortClick = (sort: SortType) => {
    setActiveSort(sort)
    onSortChange?.(sort)
  }

  return (
    <div className="flex gap-3 p-3 flex-wrap bg-surface-light dark:bg-surface-dark rounded-xl">
      <button
        onClick={() => handleSortClick('new')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'new'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <i className="hgi-stroke hgi-fire text-base"></i>
        <p className={`text-sm ${activeSort === 'new' ? 'font-bold' : 'font-medium'} leading-normal`}>
          Yeni
        </p>
      </button>

      <button
        onClick={() => handleSortClick('popular')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'popular'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <i className="bi bi-star text-lg"></i>
        <p className={`text-sm ${activeSort === 'popular' ? 'font-bold' : 'font-medium'} leading-normal`}>
          Popüler
        </p>
      </button>

      <button
        onClick={() => handleSortClick('top')}
        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
          activeSort === 'top'
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <i className="hgi-stroke hgi-thumbs-up text-base"></i>
        <p className={`text-sm ${activeSort === 'top' ? 'font-bold' : 'font-medium'} leading-normal`}>
          En Beğenilen
        </p>
      </button>
    </div>
  )
}
