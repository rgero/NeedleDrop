import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import Loading from "@components/ui/Loading";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useUserContext } from "@context/users/UserContext";

const SettingsDialog = () => {
  const { settingsDialogOpen, toggleSettingsDialog } = useDialogProvider();
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  if (isLoading) return <Loading />;
  
  const settings = getCurrentUserSettings() ?? DefaultSettings;
  const supportedTimeZones = typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : [];
  const timeZones = [...new Set(["UTC", settings.timeZone, ...supportedTimeZones])].sort();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentUserSettings({
      ...settings,
      pricePerPlayValue: e.target.checked
    });
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentUserSettings({ ...settings, timeZone: e.target.value });
  };

  return (
    <Dialog 
      open={settingsDialogOpen} 
      onClose={toggleSettingsDialog}
      aria-labelledby="settings-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="settings-dialog-title"
      >
        Settings
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ py: 1 }}>
          <Paper
            variant="outlined"
            sx={(theme) => ({
              p: 2,
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.divider,
            })}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Statistics Calculation Mode
            </Typography>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  textAlign: "right",
                  color: !settings.pricePerPlayValue ? "primary.main" : "text.disabled",
                  fontWeight: !settings.pricePerPlayValue ? 600 : 400,
                }}
              >
                Bought
              </Typography>
              <Switch
                checked={settings.pricePerPlayValue}
                onChange={handleToggle}
                color="primary"
              />
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  color: settings.pricePerPlayValue ? "primary.main" : "text.disabled",
                  fontWeight: settings.pricePerPlayValue ? 600 : 400,
                }}
              >
                Collection
              </Typography>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={(theme) => ({
              p: 2,
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.divider,
            })}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Time zone
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={settings.timeZone}
              onChange={handleTimeZoneChange}
              sx={(theme) => ({
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.background.paper,
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": { borderColor: theme.palette.primary.light },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                },
              })}
            >
              {timeZones.map((timeZone) => (
                <MenuItem key={timeZone} value={timeZone}>{timeZone}</MenuItem>
              ))}
            </TextField>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={(theme) => ({ p: 2, borderTop: `1px solid ${theme.palette.divider}` })}>
        <Button onClick={toggleSettingsDialog} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;