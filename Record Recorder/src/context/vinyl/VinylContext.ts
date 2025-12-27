import { createContext, useContext } from "react";

import type { Vinyl } from "@interfaces/Vinyl";

export interface VinylContextType {
  vinyls : Vinyl[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export const VinylContext = createContext<VinylContextType | null>(null);

export const useVinylContext = () => {
  const context = useContext(VinylContext);
  if (!context) {
    throw new Error("useVinylContext must be used within a VinylProvider");
  }
  return context;
};