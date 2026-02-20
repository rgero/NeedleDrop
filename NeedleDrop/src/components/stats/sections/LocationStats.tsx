import {Container, Grid, Typography} from "@mui/material"

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
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          <Grid container direction="row" key="header" justifyContent="space-between">
            <Grid>
              <Typography fontWeight="bold">Name</Typography>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.topLocations)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((item) => (
              <Grid container direction="row" key={item.name} justifyContent="space-between">
                <Grid>
                  <Typography>{item.name}</Typography>
                </Grid>
                <Grid>
                  <Typography>{item.count}</Typography>
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Container>
    </StatsAccordion>
  )
}

export default LocationStats
