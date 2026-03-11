import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Switch, Typography } from "@mui/material";

import { DefaultSettings } from "@interfaces/UserSettings";
import Loading from "@components/ui/Loading";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useUserContext } from "@context/users/UserContext";

const SettingsDialog = () => {
  const { settingsDialogOpen, toggleSettingsDialog } = useDialogProvider();
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  if (isLoading) return <Loading />;
  
  const settings = getCurrentUserSettings() ?? DefaultSettings;

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentUserSettings({
      ...settings,
      pricePerPlayValue: e.target.checked
    });
  };

  return (
    <Dialog 
      open={settingsDialogOpen} 
      onClose={toggleSettingsDialog}
      aria-labelledby="settings-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="settings-dialog-title">Settings</DialogTitle>
      
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography 
            variant="caption" 
            display="block" 
            textAlign="center" 
            gutterBottom 
            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Statistics Calculation Mode
          </Typography>

          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid sx={{ width: 80, textAlign: 'right' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: !settings.pricePerPlayValue ? 'primary.main' : 'text.disabled',
                  fontWeight: !settings.pricePerPlayValue ? 600 : 400,
                  transition: '0.2s'
                }}
              >
                You
              </Typography>
            </Grid>

            <Grid>
              <Switch
                checked={settings.pricePerPlayValue}
                onChange={handleToggle}
                color="primary"
              />
            </Grid>

            <Grid sx={{ width: 80, textAlign: 'left' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: settings.pricePerPlayValue ? 'primary.main' : 'text.disabled',
                  fontWeight: settings.pricePerPlayValue ? 600 : 400,
                  transition: '0.2s'
                }}
              >
                Collection
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={toggleSettingsDialog} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;