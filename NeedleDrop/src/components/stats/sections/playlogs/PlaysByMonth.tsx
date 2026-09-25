import { Box, IconButton, Typography } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import { useMemo, useState } from "react"

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion"
import TwoColumnPaginatedTable from "@components/ui/tables/TwoColumnPaginatedTable";

interface MonthCountRow {
  name: string;
  count: number;
}

interface MonthView {
  label: string;
  rows: MonthCountRow[];
}

type SlideDirection = "left" | "right";

const MONTH_ORDER = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const ROW_HEIGHT = 36
const SLIDE_DURATION_MS = 220

const tableSx = { width: { sm: "80%", lg: "50%" }, maxWidth: '100%', mx: "auto" }
const tableContainerSx = { width: "100%", maxWidth: '100%' }
const navigationSx = { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }
const titleSx = { fontWeight: "bold" }

const animationContainerSx = {
  minHeight: `${(MONTH_ORDER.length + 1) * ROW_HEIGHT}px`,
  overflow: "hidden",
  position: "relative",
  width: "100%",
  "@keyframes playsByMonthSlideOutLeft": {
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(-100%)" }
  },
  "@keyframes playsByMonthSlideOutRight": {
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(100%)" }
  },
  "@keyframes playsByMonthSlideInFromLeft": {
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0)" }
  },
  "@keyframes playsByMonthSlideInFromRight": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" }
  }
}

const getPreviousTableSx = (direction: SlideDirection) => ({
  animation: `${direction === "left" ? "playsByMonthSlideOutLeft" : "playsByMonthSlideOutRight"} ${SLIDE_DURATION_MS}ms ease-in forwards`,
  inset: 0,
  position: "absolute",
  width: "100%",
  zIndex: 1
})

const getCurrentTableSx = (direction: SlideDirection | null) => ({
  animation: direction
    ? `${direction === "left" ? "playsByMonthSlideInFromRight" : "playsByMonthSlideInFromLeft"} ${SLIDE_DURATION_MS}ms ease-out`
    : undefined,
  width: "100%"
})

const sortMonthRows = (rows: MonthCountRow[]) => [...rows].sort((a,b) => MONTH_ORDER.indexOf(a.name) - MONTH_ORDER.indexOf(b.name))

const getAvailableYears = (stats: Stats) => {
  const uniqueYears = new Set(
    stats.playlogs
      .map((playlog) => new Date(playlog.date).getFullYear())
      .filter((year) => Number.isFinite(year))
  )

  return Array.from(uniqueYears).sort((a,b) => b - a)
}

const getAllMonthsView = (stats: Stats): MonthView => ({
  label: "All",
  rows: sortMonthRows(Object.entries(stats.playsByMonths).map(([name, count]) => ({ name, count })))
})

const getYearMonthView = (stats: Stats, year: number): MonthView => {
  const rowsByMonth = stats.playlogs.reduce<Record<string, number>>((acc, playlog) => {
    const playDate = new Date(playlog.date)

    if (playDate.getFullYear() !== year) return acc;

    const month = playDate.toLocaleString('default', { month: 'long' })
    acc[month] = (acc[month] ?? 0) + 1
    return acc
  }, {})

  return {
    label: String(year),
    rows: sortMonthRows(Object.entries(rowsByMonth).map(([name, count]) => ({ name, count })))
  }
}

const getMonthView = (stats: Stats, years: number[], selectedViewIndex: number) => {
  const selectedYear = years[selectedViewIndex - 1]
  return selectedYear ? getYearMonthView(stats, selectedYear) : getAllMonthsView(stats)
}

const MonthTable = ({ rows }: { rows: MonthCountRow[] }) => (
  <TwoColumnPaginatedTable
    data={rows}
    primaryKey="name"
    secondaryKey="count"
    primaryHeader="Month"
    secondaryHeader="Count"
    getRowKey={(item) => item.name}
    primaryColumnSize={10}
    paginate={false}
    rowHeight={ROW_HEIGHT}
    containerSx={tableContainerSx}
  />
)

const PlaysByMonths = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  const [selectedViewIndex, setSelectedViewIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<SlideDirection | null>(null)
  const [previousView, setPreviousView] = useState<MonthView | null>(null)

  const years = useMemo(() => getAvailableYears(stats), [stats])
  const currentView = useMemo<MonthView>(() => getMonthView(stats, years, selectedViewIndex), [selectedViewIndex, stats, years])

  const handleNavigate = (nextIndex: number, direction: SlideDirection) => {
    setPreviousView(currentView)
    setSlideDirection(direction)
    setSelectedViewIndex(nextIndex)
  }

  const handlePrevious = () => handleNavigate(selectedViewIndex - 1, "right")
  const handleNext = () => handleNavigate(selectedViewIndex + 1, "left")

  const canMovePrevious = selectedViewIndex > 0
  const canMoveNext = selectedViewIndex < years.length

  return (
    <StatsAccordion title="Plays By Month" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Box sx={tableSx}>
        <Box sx={navigationSx}>
          <IconButton
            aria-label="View previous play month grouping"
            disabled={!canMovePrevious}
            onClick={handlePrevious}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1" sx={titleSx}>
            {currentView.label}
          </Typography>
          <IconButton
            aria-label="View next play month grouping"
            disabled={!canMoveNext}
            onClick={handleNext}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <Box sx={animationContainerSx}>
          {previousView && slideDirection && (
            <Box
              aria-hidden="true"
              onAnimationEnd={() => setPreviousView(null)}
              sx={getPreviousTableSx(slideDirection)}
            >
              <MonthTable rows={previousView.rows} />
            </Box>
          )}

          <Box
            key={currentView.label}
            data-slide-direction={slideDirection ?? "none"}
            data-testid="plays-by-month-current-view"
            sx={getCurrentTableSx(slideDirection)}
          >
            <MonthTable rows={currentView.rows} />
          </Box>
        </Box>
      </Box>
    </StatsAccordion>
  );
}

export default PlaysByMonths
