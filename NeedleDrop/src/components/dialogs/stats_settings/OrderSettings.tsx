import {Box, List, ListItem, ListItemIcon, ListItemText} from "@mui/material"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import { DragHandle } from "@mui/icons-material";
import StatsSettingBase from "./StatsSettingBase";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useMemo } from "react";
import { useStatsOrder } from "@components/stats/hooks/useStatsOrder";
import { useUserContext } from "@context/users/UserContext";

const OrderSettings = () => {
  const { statsOrderKey } = useDialogProvider();
  const { getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const settings = getCurrentUserSettings();
  const initialOrder = useMemo(() => {
    if (!statsOrderKey) return [];
    return settings?.[statsOrderKey] ?? DefaultSettings[statsOrderKey];
  }, [settings, statsOrderKey]);

  const { localOrder, handleReorder } = useStatsOrder(initialOrder, (updated) => {
    if (statsOrderKey) {
      updateCurrentUserSettings({ [statsOrderKey]: updated });
    }
  });

  return (
    <StatsSettingBase title="Display Order">
      <Box sx={{ px: 2, overflow: 'visible' }}>
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="stats-list" type="DEFAULT">
            {(provided) => (
              <List
                {...provided.droppableProps} 
                ref={provided.innerRef}
                sx={{ overflow: 'visible' }}
              >
                {localOrder.map((key, index) => (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                          mb: 0.5, 
                          border: '1px solid', 
                          borderColor: 'divider', 
                          borderRadius: 1,
                          boxShadow: snapshot.isDragging ? 3 : 0,
                          zIndex: snapshot.isDragging ? 9999 : 1
                        }}
                      >
                        <ListItemIcon {...provided.dragHandleProps}>
                          <DragHandle />
                        </ListItemIcon>
                        <ListItemText 
                          primary={key.replace(/([A-Z])/g, ' $1').trim()} 
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </StatsSettingBase>
  )
}

export default OrderSettings
