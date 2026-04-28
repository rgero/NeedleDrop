import { Box, Fade, Grid, Switch, Typography } from "@mui/material"

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import StatsSettingBase from "./StatsSettingBase"
import { useUserContext } from "@context/users/UserContext";

const PricePerPlaySettings = () => {
  const { getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();
  const settings = getCurrentUserSettings() ?? DefaultSettings;

  const label = settings.pricePerPlayValue ? "Collection" : "You";
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentUserSettings({
      ...settings,
      pricePerPlayValue: e.target.checked
    });
  };

  return (
    <StatsSettingBase title="Price Per Play">
      <Box sx={{ px: 2, overflow: 'visible'}}>
        <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
          <Grid sx={{ textAlign: 'right', minWidth: '80px' }}>            
            <Fade in={true} key={label} timeout={1000} appear={false}>
              <Typography>
                {label}
              </Typography>
            </Fade>
          </Grid>

          <Grid>
            <Switch
              checked={settings.pricePerPlayValue}
              onChange={handleToggle}
              color="primary"
            />
          </Grid>
        </Grid>
      </Box>
    </StatsSettingBase>
  );
};

export default PricePerPlaySettings
