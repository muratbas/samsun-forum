import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import PostFeed from '@/components/PostFeed'
import SortControls from '@/components/SortControls'

export default function Home() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Feed */}
        <div className="col-span-12 lg:col-span-6">
          <div className="flex flex-col gap-4">
            {/* Sorting Controls */}
            <SortControls />

            {/* Post Feed */}
            <PostFeed />
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </main>
  )
}

