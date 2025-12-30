import { createContext, useContext } from "react";

import type { WantedItem } from "@interfaces/WantedItem";

export interface WantedItemContextType {
  wanteditems : WantedItem[];
  getWantedItemById: (id: number) => WantedItem | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export const WantedItemContext = createContext<WantedItemContextType | null>(null);

export const useWantedItemContext = () => {
  const context = useContext(WantedItemContext);
  if (!context) {
    throw new Error("useWantedItemContext must be used within a WantedItemProvider");
  }
  return context;
};