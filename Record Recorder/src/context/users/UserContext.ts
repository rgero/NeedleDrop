import { createContext, useContext } from "react";

import type { User } from "@interfaces/User";

export interface UserContextType {
  users : User[];
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