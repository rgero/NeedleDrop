import { createContext, useContext } from "react";

import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFetching: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthenticationContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthenticationContext must be used within an AuthenticationProvider");
  }
  return context;
};
