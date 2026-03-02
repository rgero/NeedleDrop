import BaseStatsContainer from "./BaseStatsContainer"
import { useUserStats } from "./hooks/useUserStats"

const UserStats = () => {
  const stats = useUserStats()
  return (
    <BaseStatsContainer 
      title="User Stats" 
      stats={stats} 
      settingsKeys={{
        expanded: 'userStatsExpandedSections',
        order: 'userStatsSectionOrder'
      }}
    />
  )
}

export default UserStats