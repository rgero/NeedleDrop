import { Box } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from "dayjs";
import StatsSettingBase from "./StatsSettingBase"
import dayjs from "dayjs";
import { useState } from "react";
import { useUserContext } from "@context/users/UserContext";

const StatDatePicker = () => {

  const {getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();

  const [startDate, setStartDate] = useState<Dayjs | null>(() => {
    const settings = getCurrentUserSettings();
    return settings?.statsStartDate ? dayjs(settings.statsStartDate) : null;
  })

  const handleDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue) {
      const isoString = newValue.format('YYYY-MM-DD');
      updateCurrentUserSettings({
        statsStartDate: isoString
      });
    }
  };

  return (
    <StatsSettingBase title="Display Order">
      <Box sx={{ px: 2, overflow: 'visible'}}>
        <DatePicker label="Select Start Date" value={startDate} onChange={handleDateChange} />
      </Box>
    </StatsSettingBase>
  )
}

export default StatDatePicker
