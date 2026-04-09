import PaginatedSection from "@components/stats/ui/PaginatedSection";
import type { Stats } from "@interfaces/Stats";
import StatsAccordion from "@components/stats/ui/StatsAccordion";

const PlaysByArtist = ({ stats, expanded, onToggle }: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion 
      title="Plays By Artists" 
      expanded={expanded} 
      onChange={(_, isExpanded) => onToggle(isExpanded)}
    >
      <PaginatedSection data={stats.playsByArtist} descriptor="Artist"/>
    </StatsAccordion>
  );
};

export default PlaysByArtist;