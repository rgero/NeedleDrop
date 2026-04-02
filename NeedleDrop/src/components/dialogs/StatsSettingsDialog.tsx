import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from "@mui/material";

import OrderSettings from "./stats_settings/OrderSettings";
import { useDialogProvider } from "@context/dialog/DialogContext";

const StatsSettingsDialog = () => {
  const theme = useTheme();
  const { statsOrderDialogOpen, toggleStatsOrderDialog, statsOrderKey } = useDialogProvider();


  if (!statsOrderKey) return null;

  return (
    <Dialog 
      open={statsOrderDialogOpen} 
      onClose={() => toggleStatsOrderDialog(false)} 
      fullWidth 
      maxWidth="xs"
      disableEnforceFocus 
      slotProps={{
        paper: { 
          sx: { 
            backgroundColor: theme.palette.common.black,
            minHeight: '75%',
            display: 'flex',
            flexDirection: 'column'
          } 
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Stats Options
      </DialogTitle>
      <DialogContent>
        <OrderSettings />
      </DialogContent>

      <DialogActions sx={{ px: 2, pb:2 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => toggleStatsOrderDialog(false)}
          color="success"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatsSettingsDialog;