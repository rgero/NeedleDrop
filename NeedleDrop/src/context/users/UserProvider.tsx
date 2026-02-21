import { getUsers, updateUserSettings } from "@services/apiUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {User as SupabaseUser} from '@supabase/supabase-js';
import type { User } from "@interfaces/User";
import { DefaultSettings, type UserSettings } from "@interfaces/UserSettings";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { UserContext } from "./UserContext";
import { useCallback } from "react";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user }: { user: SupabaseUser | null } = useAuthenticationContext();
  const { data: users = [], error, isLoading, isFetching } = useQuery({queryKey: ["users"], queryFn: getUsers});

  const getCurrentUserSettings = useCallback((): UserSettings => {
    const currentUser = users.find(u => u.id === user?.id);
    return currentUser?.settings ?? DefaultSettings;
  }, [users, user?.id]);

  const updateSettingsMutation = useMutation<User, Error, UserSettings>({
    mutationFn: async (newSettings) => {
      if (!user) throw new Error("Not authenticated");
      return updateUserSettings(user.id, newSettings);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(["users"], (old) => {
        if (!old) return old;
        return old.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );
      });
    }
  });


  const updateCurrentUserSettings = (updates: Partial<UserSettings>) => {
    const current = getCurrentUserSettings();
    updateSettingsMutation.mutate({
      ...current,
      ...updates
    });
  };

  return (
    <UserContext.Provider
      value={{
        users,
        error,
        getCurrentUserSettings,
        updateCurrentUserSettings,
        isLoading,
        isFetching
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
