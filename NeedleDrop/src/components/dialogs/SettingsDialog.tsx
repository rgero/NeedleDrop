import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import Loading from "@components/ui/Loading";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useUserContext } from "@context/users/UserContext";

interface SettingsDialogFormProps {
  open: boolean;
  onClose: () => void;
  initialSettings: UserSettings;
  initialDiscordId: string | null;
  updateCurrentUserProfile: (settings: UserSettings, discordId: string | null) => Promise<void>;
}

const SettingsDialogForm = ({
  open,
  onClose,
  initialSettings,
  initialDiscordId,
  updateCurrentUserProfile,
}: SettingsDialogFormProps) => {
  const savedDiscordId = initialDiscordId ?? "";
  const [draftSettings, setDraftSettings] = useState(initialSettings);
  const [discordId, setDiscordId] = useState(savedDiscordId);
  const [isDiscordIdFocused, setIsDiscordIdFocused] = useState(false);
  const [isDiscardConfirmationOpen, setIsDiscardConfirmationOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDiscordIdValid = discordId === "" || /^\d+$/.test(discordId);
  const hasUnsavedChanges =
    draftSettings.pricePerPlayValue !== initialSettings.pricePerPlayValue ||
    draftSettings.timeZone !== initialSettings.timeZone ||
    discordId !== savedDiscordId;

  const supportedTimeZones = typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : [];
  const timeZones = [...new Set(["UTC", draftSettings.timeZone, ...supportedTimeZones])].sort();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDiscordIdValid || !hasUnsavedChanges || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await updateCurrentUserProfile(draftSettings, discordId === "" ? null : discordId);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to update user profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestClose = () => {
    if (isSaving) return;
    if (hasUnsavedChanges) {
      setIsDiscardConfirmationOpen(true);
      return;
    }
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleRequestClose}
        aria-labelledby="settings-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <DialogTitle id="settings-dialog-title">
            Settings
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ py: 1 }}>
              {saveError && <Alert severity="error">{saveError}</Alert>}

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
                      color: !draftSettings.pricePerPlayValue ? "primary.main" : "text.disabled",
                      fontWeight: !draftSettings.pricePerPlayValue ? 600 : 400,
                    }}
                  >
                    Bought
                  </Typography>
                  <Switch
                    checked={draftSettings.pricePerPlayValue}
                    onChange={(e) => setDraftSettings((current) => ({
                      ...current,
                      pricePerPlayValue: e.target.checked,
                    }))}
                    color="primary"
                    slotProps={{ input: { "aria-label": "Statistics calculation mode" } }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      color: draftSettings.pricePerPlayValue ? "primary.main" : "text.disabled",
                      fontWeight: draftSettings.pricePerPlayValue ? 600 : 400,
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
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">
                    Discord ID
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={isDiscordIdFocused ? "text" : "password"}
                    autoComplete="off"
                    value={discordId}
                    onFocus={() => setIsDiscordIdFocused(true)}
                    onBlur={() => setIsDiscordIdFocused(false)}
                    onChange={(e) => {
                      setDiscordId(e.target.value);
                      setSaveError(null);
                    }}
                    error={!isDiscordIdValid}
                    helperText={isDiscordIdValid
                      ? "Leave blank to remove the linked ID."
                      : "Enter a Discord ID using digits only."}
                    slotProps={{ htmlInput: { inputMode: "numeric", "aria-label": "Discord ID" } }}
                  />
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
                  value={draftSettings.timeZone}
                  onChange={(e) => setDraftSettings((current) => ({
                    ...current,
                    timeZone: e.target.value,
                  }))}
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
            <Button type="button" onClick={handleRequestClose} disabled={isSaving}>
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!hasUnsavedChanges || !isDiscordIdValid || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={isDiscardConfirmationOpen}
        onClose={() => setIsDiscardConfirmationOpen(false)}
        aria-labelledby="discard-settings-title"
      >
        <DialogTitle id="discard-settings-title">Discard unsaved changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your changes will be lost if you close the settings without saving.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDiscardConfirmationOpen(false)}>
            Keep editing
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setIsDiscardConfirmationOpen(false);
              onClose();
            }}
          >
            Discard changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const SettingsDialog = () => {
  const { settingsDialogOpen, toggleSettingsDialog } = useDialogProvider();
  const { isLoading, currentUser, getCurrentUserSettings, updateCurrentUserProfile } = useUserContext();

  if (isLoading) return <Loading />;

  return (
    <SettingsDialogForm
      key={`${currentUser?.id ?? "no-current-user"}:${settingsDialogOpen}`}
      open={settingsDialogOpen}
      onClose={toggleSettingsDialog}
      initialSettings={getCurrentUserSettings() ?? DefaultSettings}
      initialDiscordId={currentUser?.discord_id ?? null}
      updateCurrentUserProfile={updateCurrentUserProfile}
    />
  );
};

export default SettingsDialog;