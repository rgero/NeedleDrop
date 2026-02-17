import PlayStats from "./playlogs/PlayStats"
import PlaysByDays from "./playlogs/PlaysByDays"
import PlaysByTimelineChart from "./playlogs/PlaysByTimelineChart"
import type { Stats } from "@interfaces/Stats"
import TopPlayDates from "./playlogs/TopPlayDates"

type PlaylogSectionKeys = "playlogs" | "topPlayDays" | "playsByDays" | "playsByTimelineChart"

interface PlaylogStatsProps<T extends Record<PlaylogSectionKeys, boolean>> {
  stats: Stats
  expandedSections: T
  onToggle: (key: keyof T, expanded: boolean) => void
}

const PlaylogStats = <T extends Record<PlaylogSectionKeys, boolean>>({stats, expandedSections, onToggle}: PlaylogStatsProps<T>) => {
  return (
    <>
      <PlayStats
        stats={stats}
        expanded={expandedSections.playlogs}
        onToggle={(expanded) => onToggle("playlogs", expanded)}
      />
      <TopPlayDates
        stats={stats}
        expanded={expandedSections.topPlayDays}
        onToggle={(expanded) => onToggle("topPlayDays", expanded)}
      />
      <PlaysByDays
        stats={stats}
        expanded={expandedSections.playsByDays}
        onToggle={(expanded) => onToggle("playsByDays", expanded)}
      />
      <PlaysByTimelineChart
        stats={stats}
        expanded={expandedSections.playsByTimelineChart}
        onToggle={(expanded) => onToggle("playsByTimelineChart", expanded)}
      />
    </>
  )
}

export default PlaylogStats