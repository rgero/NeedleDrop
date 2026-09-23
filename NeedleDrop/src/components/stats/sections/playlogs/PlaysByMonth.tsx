import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion"
import TwoColumnPaginatedTable from "@components/ui/tables/TwoColumnPaginatedTable";

interface MonthCountRow {
  name: string;
  count: number;
}

const MONTH_ORDER = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const PlaysByMonths = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  const rows: MonthCountRow[] = Object.entries(stats.playsByMonths)
                                      .map(([name, count]) => ({ name, count }))
                                      .sort((a,b) => MONTH_ORDER.indexOf(a.name) - MONTH_ORDER.indexOf(b.name))

  return (
    <StatsAccordion title="Plays By Month" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <TwoColumnPaginatedTable
        data={rows}
        primaryKey="name"
        secondaryKey="count"
        primaryHeader="Month"
        secondaryHeader="Count"
        getRowKey={(item) => item.name}
        primaryColumnSize={10}
        paginate={false}
        containerSx={{ width: { sm: "80%", lg: "50%" }, maxWidth: '100%' }}
      />
    </StatsAccordion>
  );
}

export default PlaysByMonths
