import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

interface StatsSettingBaseProps {
  title: string,
  children: React.ReactNode
}

const StatsSettingBase = ({title, children}: StatsSettingBaseProps) => {
  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default StatsSettingBase