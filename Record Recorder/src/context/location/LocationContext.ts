import { createContext, useContext } from "react";

import type { Location } from "@interfaces/Location";

export interface LocationContextType {
  locations : Location[];
  getLocationById: (id: number) => Location | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  updateLocation: (id: number, updatedItem: Partial<Location>) => void;
}

export const LocationContext = createContext<LocationContextType | null>(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};