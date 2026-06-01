import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'

export default function Search() {
  return (
    <div className="min-h-screen bg-temple-ivory pb-16">
      <TopBar title="Search" />
      <main className="px-4 py-4">
        <p className="text-stone text-sm">Search — coming soon</p>
      </main>
      <BottomNav />
    </div>
  )
}
