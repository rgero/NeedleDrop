import BaseStatsContainer from "./BaseStatsContainer"
import { useHouseholdStats } from "./hooks/useHouseholdStats"

const HouseholdStats = () => {
  const stats = useHouseholdStats()
  return (
    <BaseStatsContainer 
      title="House Stats" 
      stats={stats} 
      settingsKeys={{
        expanded: 'houseStatsExpandedSections',
        order: 'houseStatsSectionOrder'
      }}
    />
  )
}

export default HouseholdStats