import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HouseholdStats from "@components/stats/HouseholdStats";
import UserStats from "@components/stats/UserStats";

const StatsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stats!
      </Typography>

      {/* User Stats Accordion */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="user-stats-content"
          id="user-stats-header"
        >
          <Typography variant="h5">User Stats</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UserStats />
        </AccordionDetails>
      </Accordion>
      
      {/* Household Stats Accordion */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="household-stats-content"
          id="household-stats-header"
        >
          <Typography variant="h5">Household Stats</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HouseholdStats />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default StatsPage;
