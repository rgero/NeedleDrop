import PaginatedSection from "@components/stats/ui/PaginatedSection";
import type { Stats } from "@interfaces/Stats";
import StatsAccordion from "@components/stats/StatsAccordion";

const PlaysByAlbum = ({ stats, expanded, onToggle }: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion 
      title="Plays By Albums" 
      expanded={expanded} 
      onChange={(_, isExpanded) => onToggle(isExpanded)}
    >
      <PaginatedSection data={stats.playsByAlbum} descriptor="Album"/>
    </StatsAccordion>
  );
};

export default PlaysByAlbum;