import PaginatedSection from "../ui/PaginatedSection";
import type { Stats } from "@interfaces/Stats";
import StatsAccordion from "../StatsAccordion";

const LocationStats = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Locations" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <PaginatedSection data={stats.topLocations} descriptor="Location"/>
    </StatsAccordion>
  )
}

export default LocationStats
