import { getHabiticaStats } from "../app/actions/habitica"
import { ProgressBar } from "./progress-bar"

export async function HabiticaStats() {
  const stats = await getHabiticaStats()

  // Habitica's official icon URL
  const habiticaIconUrl = "https://img.utdstc.com/icon/e99/6e9/e996e9fc7515afb60de11013c71209a2f12cf50d7ca67d88fb5fa280cf2f83c2:200"

  return (
    <div className="w-full max-w-md bg-[#2D1B47] rounded-lg overflow-hidden font-mono">
      <div className="flex gap-4 p-4">
        {/* Habitica Icon Section */}
        <div className="w-[100px] h-[100px] bg-[#3D2B57] rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={habiticaIconUrl}
            alt="Habitica Icon"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
        
        {/* Stats Section */}
        <div className="flex-1 py-2">
          <h2 className="text-white text-lg">@{stats.class.toLowerCase()}</h2>
          <p className="text-gray-300">Level {stats.lvl} {stats.class}</p>

          <div className="space-y-6 mt-4">
            {/* Health Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>❤️ Health</span>
                <span>{Math.floor(stats.hp)} / {stats.maxHealth}</span>
              </div>
              <ProgressBar
                value={stats.hp}
                max={stats.maxHealth}
                color="bg-[#F74E52]"
                backgroundColor="bg-[#4D3B67]"
              />
            </div>

            {/* Experience Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>⭐ Experience</span>
                <span>{Math.floor(stats.exp)} / {stats.toNextLevel}</span>
              </div>
              <ProgressBar
                value={stats.exp}
                max={stats.toNextLevel}
                color="bg-[#FFB445]"
                backgroundColor="bg-[#4D3B67]"
              />
            </div>

            {/* Mana Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>💎 Mana</span>
                <span>{Math.floor(stats.mp)} / {stats.maxMP}</span>
              </div>
              <ProgressBar
                value={stats.mp}
                max={stats.maxMP}
                color="bg-[#50B5E9]"
                backgroundColor="bg-[#4D3B67]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

