import BaseStatsContainer from "./BaseStatsContainer"
import SuspenseStatsWrapper from "@components/ui/SuspenseStatsWrapper"
import { useUserStats } from "./hooks/useUserStats"

const UserStats = () => {
  const stats = useUserStats()
  return (
    <SuspenseStatsWrapper>
      <BaseStatsContainer 
        title="User Stats" 
        stats={stats} 
        settingsKeys={{
          expanded: 'userStatsExpandedSections',
          order: 'userStatsSectionOrder'
        }}
      />
    </SuspenseStatsWrapper>
  )
}

export default UserStats