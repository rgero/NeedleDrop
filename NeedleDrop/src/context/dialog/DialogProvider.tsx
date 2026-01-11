import React, { useState } from "react";

import { DialogContext, type ConfirmAction, type DialogDetails } from "./DialogContext";
import DeleteDialog from "@components/dialogs/DeleteDialog";

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(
    () => () => {}
  );

  const [dialogDetails, setDialogDetails] = useState<DialogDetails | null>(null);

  const openDeleteDialog = (details: DialogDetails, action: ConfirmAction) => {
    setDialogDetails(details);
    setConfirmAction(() => action);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  return (
    <DialogContext.Provider
      value={{
        deleteDialogOpen,
        dialogDetails,
        setDialogDetails,
        openDeleteDialog,
        closeDeleteDialog,
        confirmAction,
      }}
    >
      <DeleteDialog />
      {children}
    </DialogContext.Provider>
  );
};
