import PaginatedSection from "../ui/PaginatedSection";
import type { Stats } from "@interfaces/Stats";
import StatsAccordion from "../StatsAccordion";

type LocationSectionKeys = "locations"

interface LocationStatsProps<T extends Record<LocationSectionKeys, boolean>> {
  stats: Stats
  expandedSections: T
  onToggle: (key: keyof T, expanded: boolean) => void
}

const LocationStats = <T extends Record<LocationSectionKeys, boolean>>({stats, expandedSections, onToggle}: LocationStatsProps<T>) => {
  return (
    <StatsAccordion title="Locations" expanded={expandedSections.locations as boolean} onChange={(_, isExpanded) => onToggle("locations" as keyof T, isExpanded)}>
      <PaginatedSection data={stats.topLocations} descriptor="Location"/>
    </StatsAccordion>
  )
}

export default LocationStats
