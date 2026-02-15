import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

interface StatsAccordionProps {
  title: string
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: React.ReactNode
  expanded: boolean
  onChange: (_: React.SyntheticEvent, expanded: boolean) => void
}

const StatsAccordion = ({title, size = "h6", children, expanded, onChange}: StatsAccordionProps) => {
  return (
    <Accordion disableGutters expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title.toLowerCase().replace(/\s+/g, '-')}-stats`}
      >
        <Typography variant={size}>{title}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default StatsAccordion