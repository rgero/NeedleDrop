import { createContext, useContext } from "react";

import type { Location } from "@interfaces/Location";

export interface LocationContextType {
  locations : Location[];
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export const LocationContext = createContext<LocationContextType | null>(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};