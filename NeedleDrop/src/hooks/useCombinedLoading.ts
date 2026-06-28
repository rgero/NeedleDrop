/**
 * Custom hook to combine multiple loading states from different contexts.
 * Useful for forms that depend on data from multiple providers.
 * Eliminates the need for verbose multi-state checks: `if (isLoading || isUsersLoading || isLocationsLoading)`
 */
export const useCombinedLoading = (loadingStates: boolean[]): boolean => {
  return loadingStates.some(isLoading => isLoading);
};

export default useCombinedLoading;
