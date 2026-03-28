import PaginatedSection from "@components/stats/ui/PaginatedSection"
import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion"

const TopPlayDates = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Top Play Days" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <PaginatedSection data={stats.topPlayDays} descriptor="Date"/>
    </StatsAccordion>
  )
}

export default TopPlayDates
