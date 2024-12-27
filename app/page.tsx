import { HabiticaStats } from "@/components/habitica-stats"

export default function Home() {
  return (
    <>
      <main className="min-h-screen p-4 flex items-center justify-center bg-[#1B1B1B]">
        <HabiticaStats />
      </main>
      <div className="hidden">
        {/* This generates the image during build time */}
        <HabiticaStats />
      </div>
    </>
  )
}