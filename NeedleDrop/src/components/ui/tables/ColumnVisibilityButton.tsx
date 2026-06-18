import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FormControlLabel, IconButton, Stack, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import { useUserContext } from "@context/users/UserContext";

type TableKeys = Extract<keyof UserSettings, "locations" | "playlogs" | "vinyls" | "wantedItems">;

interface ColumnVisibilityButtonProps<T> {
  columns: ColumnDef<T, any>[];
  settingsColumn: TableKeys;
}

interface VisibilityOption {
  id: string;
  label: string;
}

const prettifyColumnId = (value: string) => {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const ColumnVisibilityButton = <T,>({ columns, settingsColumn }: ColumnVisibilityButtonProps<T>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const { getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const visibilityOptions = useMemo<VisibilityOption[]>(() => {
    return columns
      .map((columnDef) => {
        const rawId = typeof columnDef.id === "string" ? columnDef.id : "accessorKey" in columnDef && typeof columnDef.accessorKey === "string" ? columnDef.accessorKey : null;
        if (!rawId) {
          return null;
        }

        const rawHeader = columnDef.header;
        const label = typeof rawHeader === "string" ? rawHeader : prettifyColumnId(rawId);

        return {
          id: rawId,
          label,
        };
      })
      .filter((option): option is VisibilityOption => Boolean(option));
  }, [columns]);

  const visibilityModel =
    getCurrentUserSettings()?.[settingsColumn] ??
    DefaultSettings[settingsColumn];

  const handleToggle = (columnId: string) => {
    updateCurrentUserSettings({
      [settingsColumn]: {
        ...visibilityModel,
        [columnId]: !(visibilityModel[columnId] ?? true),
      },
    });
  };

  const handleResetToDefaults = () => {
    updateCurrentUserSettings({
      [settingsColumn]: {
        ...DefaultSettings[settingsColumn],
      },
    });
  };

  return (
    <>
      <Tooltip title="Table columns">
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Configure visible columns"
          sx={{ mr: 1 }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        fullScreen={isMobile}
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        slots={{ transition: Fade }}
        transitionDuration={{ enter: 300, exit: 200 }}
      >
        <DialogTitle>Visible Columns</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={0.5}>
            {visibilityOptions.map((option, index) => (
              <Fade
                key={option.id}
                in={open}
                timeout={{ enter: 180 + index * 45, exit: 120 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibilityModel[option.id] ?? true}
                      onChange={() => handleToggle(option.id)}
                    />
                  }
                  label={option.label}
                />
              </Fade>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetToDefaults}>Reset</Button>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnVisibilityButton;