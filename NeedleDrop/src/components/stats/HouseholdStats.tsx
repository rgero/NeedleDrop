import { DefaultSettings, type HouseStatsExpandedSections } from "@interfaces/UserSettings";
import Loading from "@components/ui/Loading";
import LocationStats from "./sections/LocationStats";
import PlaylogStats from "./sections/PlaylogStats";
import VinylStats from "./sections/VinylStats";
import { useExpandedSections } from "./hooks/useExpandedSections";
import { useHouseholdStats } from "./hooks/useHouseholdStats";
import { useUserContext } from "@context/users/UserContext";
import StatsAccordion from "./StatsAccordion";

const HouseholdStats = () => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext()
  const stats = useHouseholdStats();

  const initial: HouseStatsExpandedSections = getCurrentUserSettings()?.houseStatsExpandedSections ?? DefaultSettings.houseStatsExpandedSections
  const { expandedSections, handleToggle } = useExpandedSections<HouseStatsExpandedSections>(initial, (updated) => updateCurrentUserSettings({houseStatsExpandedSections: updated}))

  if (isLoading) return <Loading />

  return (
    <StatsAccordion
      title="Household Stats"
      size="h4"
      expanded={expandedSections.houseStats}
      onChange={(_, isExpanded) => handleToggle("houseStats", isExpanded)}
    >
      <VinylStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
      <LocationStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
      <PlaylogStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
    </StatsAccordion>
  )
}

export default HouseholdStats
