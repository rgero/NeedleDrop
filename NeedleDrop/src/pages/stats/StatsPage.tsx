import { Box, Container, Paper, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";

import HouseholdStats from "@components/stats/HouseholdStats";
import Loading from "@components/ui/Loading";
import UserStats from "@components/stats/UserStats";
import { useUserContext } from "@context/users/UserContext";

// Constants for better maintainability
const TABS = {
  USER: "1",
  HOUSEHOLD: "2",
} as const;

const StatsPage = () => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();
  
  const [value, setValue] = useState(() => {
    return getCurrentUserSettings()?.currentStatsTab ?? TABS.USER;
  });

  useEffect(() => {
    const savedTab = getCurrentUserSettings()?.currentStatsTab;
    if (savedTab && savedTab !== value) {
      setValue(savedTab);
    }
  }, [getCurrentUserSettings, value]);

  if (isLoading) return <Loading />;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    updateCurrentUserSettings({
      currentStatsTab: newValue
    });
  };

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Container disableGutters maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="statistics categories"
            variant="fullWidth" // Optional: makes it look better on mobile
          >
            <Tab label="User Stats" value={TABS.USER} />
            <Tab label="Household Stats" value={TABS.HOUSEHOLD} />
          </Tabs>
        </Box>

        <Box sx={{ p: 1 }}>
          {value === TABS.USER && <UserStats />}
          {value === TABS.HOUSEHOLD && <HouseholdStats />}
        </Box>
      </Container>
    </Paper>
  );
};

export default StatsPage;