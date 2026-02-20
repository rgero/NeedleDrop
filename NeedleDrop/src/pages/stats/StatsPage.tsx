import { Box, Container, Paper, Tab, Tabs } from "@mui/material";

import HouseholdStats from "@components/stats/HouseholdStats";
import UserStats from "@components/stats/UserStats";
import { useState } from "react";

const StatsPage = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <Container disableGutters maxWidth="lg">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="User Stats" value="1" />
          <Tab label="Household Stats" value="2" />
        </Tabs>

        <Box>
          {value === "1" && <UserStats />}
          {value === "2" && <HouseholdStats />}
        </Box>
      </Container>
    </Paper>
  );
};

export default StatsPage;