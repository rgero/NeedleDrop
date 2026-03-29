import { Box, MenuItem, Select, Typography } from "@mui/material"

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import StatsSettingBase from "./StatsSettingBase";
import { useMemo } from "react";
import { useUserContext } from "@context/users/UserContext";

const DurationSettings = () => {

  const {getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();

  const settings = getCurrentUserSettings();
  const initialDuration = useMemo(() => {
      return settings?.statsDuration ?? DefaultSettings.statsDuration;
  }, [settings]);

  const handleDurationChange = (value: string) => {
    updateCurrentUserSettings({ statsDuration: value as "all" | "year" | "30" | "60" | "90" });
  };

  return (
    <StatsSettingBase title="Duration">
      <Box sx={{ px: 2, overflow: 'visible' }}>
        <Select
          fullWidth
          value={initialDuration}
          onChange={(e) => {
            handleDurationChange(e.target.value); 
          }}
        >
          <MenuItem value="all"><Typography align="right" paddingX={3}>All</Typography></MenuItem>
          <MenuItem value="year"><Typography align="right" paddingX={3}>Start of Year</Typography></MenuItem>
          <MenuItem value="30"><Typography align="right" paddingX={3}>30 Days</Typography></MenuItem>
          <MenuItem value="60"><Typography align="right" paddingX={3}>60 Days</Typography></MenuItem>
          <MenuItem value="90"><Typography align="right" paddingX={3}>90 Days</Typography></MenuItem>
      </Select>
      </Box>
    </StatsSettingBase>
  )
}

export default DurationSettings
