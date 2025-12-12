'use client'

import { useState } from 'react'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import SortControls from '@/components/SortControls'
import PostFeed from '@/components/PostFeed'

export default function Home() {
  const [sortBy, setSortBy] = useState<'new' | 'popular' | 'top'>('popular')

  const handleSortChange = (sort: 'popular' | 'new' | 'top') => {
    setSortBy(sort)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sol Sidebar - Fixed */}
      <LeftSidebar />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            
            {/* Ana Feed - Sol */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-4">
                {/* Sıralama Kontrolleri */}
                <SortControls onSortChange={handleSortChange} />

                {/* Post Feed */}
                <PostFeed sortBy={sortBy} />
              </div>
            </div>

            {/* Sağ Sidebar - Static (scrolls with page) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
