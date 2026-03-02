import BaseStats from "./BaseStats";
import type { UserStatsExpandedSections } from "@interfaces/UserSettings";
import { useUserStats } from "./hooks/useUserStats";

const UserStats = () => {
  const stats = useUserStats();

  return (
    <BaseStats<UserStatsExpandedSections>
      title="User Stats"
      stats={stats}
      orderKey="userStatsOrder"
      expandedKey="userStatsExpandedSections"
    />
  );
};

export default UserStats;