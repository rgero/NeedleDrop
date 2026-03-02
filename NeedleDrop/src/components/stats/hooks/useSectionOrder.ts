import { useEffect, useState } from "react";

import { arrayMove } from "@dnd-kit/sortable";

/**
 * Hook to manage the order of sortable items
 * @param initialOrder The initial array of IDs
 * @param onPersist Optional callback to save the new order (e.g., to user settings)
 */
export const useSectionOrder = (initialOrder: string[], onPersist?: (updated: string[]) => void) => {
  const [order, setOrder] = useState<string[]>(initialOrder);

  // Sync state if initialOrder changes (e.g., after a reset or slow network load)
  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleReorder = (activeId: string, overId: string) => {
    if (activeId !== overId) {
      const oldIndex = order.indexOf(activeId);
      const newIndex = order.indexOf(overId);
      
      const newOrder = arrayMove(order, oldIndex, newIndex);
      setOrder(newOrder);
      onPersist?.(newOrder);
    }
  };

  return { order, handleReorder, setOrder };
};