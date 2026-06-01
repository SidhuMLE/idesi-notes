import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-temple-ivory pb-16">
      <TopBar title="Idesi Notes" />
      <main className="px-4 py-4">
        <p className="text-stone text-sm">Home — coming soon</p>
      </main>
      <BottomNav />
    </div>
  )
}
