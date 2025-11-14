import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import SortControls from '@/components/SortControls'
import PostFeed from '@/components/PostFeed'

export default function Home() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Sol Sidebar */}
        <LeftSidebar />

        {/* Ana Feed - Ortada */}
        <div className="col-span-12 lg:col-span-6">
          <div className="flex flex-col gap-4">
            {/* Sıralama Kontrolleri */}
            <SortControls />

            {/* Post Feed */}
            <PostFeed />
          </div>
        </div>

        {/* Sağ Sidebar */}
        <RightSidebar />
      </div>
    </main>
  )
}