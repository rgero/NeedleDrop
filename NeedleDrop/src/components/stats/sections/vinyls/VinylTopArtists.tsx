import PaginatedSection from "@components/stats/ui/PaginatedSection"
import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/StatsAccordion"

const VinylTopArtists = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Top Artists" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <PaginatedSection data={stats.topArtists} descriptor="Artist"/>
    </StatsAccordion>
  )
}

export default VinylTopArtists
