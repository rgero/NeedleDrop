import { createContext, useContext } from "react";

import type { PlayLog } from "@interfaces/PlayLog";

export interface PlaylogContextType {
  playlogs : PlayLog[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export const PlaylogContext = createContext<PlaylogContextType | null>(null);

export const usePlaylogContext = () => {
  const context = useContext(PlaylogContext);
  if (!context) {
    throw new Error("usePlaylogContext must be used within a PlaylogProvider");
  }
  return context;
};