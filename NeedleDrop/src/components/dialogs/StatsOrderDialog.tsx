import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemText } from "@mui/material";

import { DefaultSettings } from "@interfaces/UserSettings";
import { useDialogProvider } from "@context/dialog/DialogContext"
import { useUserContext } from "@context/users/UserContext";

const StatsOrderDialog = () => {
  const { statsOrderDialogOpen, toggleStatsOrderDialog, statsOrderKey } = useDialogProvider();
  const { getCurrentUserSettings } = useUserContext();

  if (!statsOrderKey) return null;

  const settings = getCurrentUserSettings();
  const currentOrder = settings?.[statsOrderKey] ?? DefaultSettings[statsOrderKey];

  return (
    <Dialog 
        open={statsOrderDialogOpen} 
        onClose={() => toggleStatsOrderDialog(false)}
        aria-labelledby="stats-order-dialog-title"
        fullWidth
    >
      <DialogTitle id="stats-order-dialog-title">
        Reorder {statsOrderKey.includes('house') ? 'House' : 'User'} Sections
      </DialogTitle>
      <List>
        {currentOrder.map((key: string) => (
          <ListItem key={key}>
            <ListItemText primary={key.replace(/([A-Z])/g, ' $1').trim()} sx={{ textTransform: 'capitalize' }} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={() => toggleStatsOrderDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default StatsOrderDialog;