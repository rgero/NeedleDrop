import React, { useEffect } from "react";
import { getCurrentUser, logout, signInWithGoogle } from "@services/apiAuthentication";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "./AuthenticationContext";
import supabase from "../../services/supabase";

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      queryClient.setQueryData(["authUser"], session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isFetching,
        isLoading,
        loginWithGoogle: signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
