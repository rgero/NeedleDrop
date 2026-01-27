import { createContext, useContext } from "react";

import type { User } from "@interfaces/User";
import type { UserSettings } from "@interfaces/UserSettings";

export interface UserContextType {
  users : User[];
  getCurrentUserSettings: () => UserSettings|null,
  updateCurrentUserSettings: (updates: Partial<UserSettings>) => void,
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};