import { DefaultSettings } from "@interfaces/UserSettings"
import Loading from "@components/ui/Loading"
import LocationStats from "./sections/LocationStats"
import PlaylogStats from "./sections/PlaylogStats"
import StatsAccordion from "./StatsAccordion"
import type { UserStatsExpandedSections } from "@interfaces/UserSettings"
import VinylStats from "./sections/VinylStats"
import { useExpandedSections } from "./hooks/useExpandedSections"
import { useUserContext } from "@context/users/UserContext"
import { useUserStats } from "./hooks/useUserStats"

const UserStats = () => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext()
  const stats = useUserStats()

  const initial: UserStatsExpandedSections = getCurrentUserSettings()?.userStatsExpandedSections ?? DefaultSettings.userStatsExpandedSections
  const { expandedSections, handleToggle } = useExpandedSections<UserStatsExpandedSections>(initial, (updated) => updateCurrentUserSettings({userStatsExpandedSections: updated}))

  if (isLoading) return <Loading />

  return (
    <StatsAccordion
      title="Your Stats"
      size="h4"
      expanded={expandedSections.userStats}
      onChange={(_, isExpanded) => handleToggle("userStats", isExpanded)}
    >
      <VinylStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
      <LocationStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
      <PlaylogStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
    </StatsAccordion>
  )
}

export default UserStats