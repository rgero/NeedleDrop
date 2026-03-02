import { Box } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {attributes,listeners,setNodeRef,transform,transition,isDragging} = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    position: "relative" as const,
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      sx={{ 
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        mb: 0.5 
      }}
    >
      {children}
    </Box>
  );
};

export default SortableItem
