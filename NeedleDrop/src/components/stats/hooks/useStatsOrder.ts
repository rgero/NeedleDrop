import { useEffect, useState } from "react";

import type { DropResult } from "@hello-pangea/dnd";

export const useStatsOrder = (initialOrder: string[], onPersist?: (updated: string[]) => void) => {
  const [localOrder, setLocalOrder] = useState<string[]>(initialOrder);
  const initialSerialized = JSON.stringify(initialOrder);
  useEffect(() => {
    setLocalOrder(initialOrder);
  }, [initialOrder, initialSerialized]);

  const handleReorder = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalOrder(items);
    onPersist?.(items);
  };

  return { localOrder, handleReorder };
};