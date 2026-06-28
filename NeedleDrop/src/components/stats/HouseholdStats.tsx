import BaseStatsContainer from "./BaseStatsContainer"
import SuspenseStatsWrapper from "@components/ui/SuspenseStatsWrapper"
import { useHouseholdStats } from "./hooks/useHouseholdStats"

const HouseholdStats = () => {
  const stats = useHouseholdStats()
  return (
    <SuspenseStatsWrapper>
      <BaseStatsContainer 
        title="House Stats" 
        stats={stats} 
        settingsKeys={{
          expanded: 'houseStatsExpandedSections',
          order: 'houseStatsSectionOrder'
        }}
      />
    </SuspenseStatsWrapper>
  )
}

export default HouseholdStats