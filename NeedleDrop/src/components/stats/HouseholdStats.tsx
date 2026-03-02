import BaseStats from "./BaseStats";
import type { HouseStatsExpandedSections } from "@interfaces/UserSettings";
import { useHouseholdStats } from "./hooks/useHouseholdStats";

const HouseholdStats = () => {
  const stats = useHouseholdStats();

  return (
    <BaseStats<HouseStatsExpandedSections>
      title="House Stats"
      stats={stats}
      orderKey="houseStatsOrder"
      expandedKey="houseStatsExpandedSections"
    />
  );
};

export default HouseholdStats;