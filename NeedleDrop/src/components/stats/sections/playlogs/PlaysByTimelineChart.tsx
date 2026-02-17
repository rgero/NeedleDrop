import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {Button, ButtonGroup, Container, Grid, useMediaQuery, useTheme} from "@mui/material"
import { subDays, subMonths } from "date-fns"
import { useEffect, useState } from "react"

import type { PlayLog } from "@interfaces/PlayLog"
import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/StatsAccordion"

type Duration = "30d" | "3m" | "6m" | "1y" | "all"

const PlaysByTimelineChart = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  const [duration, setDuration] = useState<Duration>("30d")
  const [data, setData] = useState<{name: string, plays: number}[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    let targetDate: Date | null = null
    switch(duration)
    {
      case "30d":
        targetDate = subDays(new Date(), 30)
        break;
      case "3m":
        targetDate = subMonths(new Date(), 3)
        break;
      case "6m":
        targetDate = subMonths(new Date(), 6)
        break;
      case "1y":
        targetDate = subMonths(new Date(), 12)
        break;
      default:
        targetDate = null
        break;
    }

    const filtered = targetDate ? stats.playlogs.filter(pl => new Date(pl.date) >= targetDate!) : stats.playlogs
    const groupedByDate: Record<string, PlayLog[]> = filtered.reduce((acc: Record<string, PlayLog[]>, pl) => {
      const dateKey = new Date(pl.date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(pl);
      return acc;
    }, {});

    // To Array of Objects for Recharts
    const sortedData = Object.entries(groupedByDate)
      .map(([date, logs]) => ({ name: date, plays: logs.length }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    setData(sortedData)
  }, [duration, stats])

  return (
    <StatsAccordion title="Plays By Timeline" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container sx={{width: {sm: "100%", lg:"75%"}}}>
        <Grid container direction="column" spacing={1} alignContent="center">
          <Grid size={12}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
              <AreaChart
                data={data}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                onContextMenu={(_, e) => e.preventDefault()}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(str) => isMobile ? "" : str.substring(5)} />
                <YAxis width="auto" />
                <Tooltip />
                <Area type="monotone" dataKey="plays" stroke="#8884d8" fill={theme.palette.primary.main} />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>
          <Grid>
            <ButtonGroup variant="outlined" aria-label="duration button group">
              <Button onClick={() => setDuration("30d")} variant={duration === "30d" ? "contained" : "outlined"}>30d</Button>
              <Button onClick={() => setDuration("3m")} variant={duration === "3m" ? "contained" : "outlined"}>3m</Button>
              <Button onClick={() => setDuration("6m")} variant={duration === "6m" ? "contained" : "outlined"}>6m</Button>
              <Button onClick={() => setDuration("1y")} variant={duration === "1y" ? "contained" : "outlined"}>1y</Button>
              <Button onClick={() => setDuration("all")} variant={duration === "all" ? "contained" : "outlined"}>All</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
    </StatsAccordion>
  )
}

export default PlaysByTimelineChart
