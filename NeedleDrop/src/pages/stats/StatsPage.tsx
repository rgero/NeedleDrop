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
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings, isEditor } = useUserContext();
  
  const [value, setValue] = useState(() => {
    if (!isEditor) {
      return TABS.HOUSEHOLD;
    }

    return getCurrentUserSettings()?.currentStatsTab ?? TABS.USER;
  });

  useEffect(() => {
    if (!isEditor) {
      if (value !== TABS.HOUSEHOLD) {
        setValue(TABS.HOUSEHOLD);
      }
      return;
    }

    const savedTab = getCurrentUserSettings()?.currentStatsTab;
    if (savedTab && savedTab !== value) {
      setValue(savedTab);
    }
  }, [getCurrentUserSettings, isEditor, value]);

  if (isLoading) return <Loading />;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
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
            variant="fullWidth"
          >
            {isEditor && <Tab label="User" value={TABS.USER} />}
            <Tab label="Household" value={TABS.HOUSEHOLD} />
          </Tabs>
        </Box>

        <Box>
          {isEditor && value === TABS.USER && <UserStats />}
          {value === TABS.HOUSEHOLD && <HouseholdStats />}
        </Box>
      </Container>
    </Paper>
  );
};

export default StatsPage;