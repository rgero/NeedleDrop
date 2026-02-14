import type { Stats } from "@interfaces/Stats"
import VinylOwnership from "./vinyls/VinylOwnership"
import VinylTopArtists from "./vinyls/VinylTopArtists"

type VinylSectionKeys = "vinyls" | "topArtists"

interface VinylStatsProps<T extends Record<VinylSectionKeys, boolean>> {
  stats: Stats
  expandedSections: T
  onToggle: (key: keyof T, expanded: boolean) => void
}


const VinylStats = <T extends Record<VinylSectionKeys, boolean>>({ stats, expandedSections, onToggle }: VinylStatsProps<T>) => {
  return (
    <>
      <VinylOwnership stats={stats} expanded={expandedSections.vinyls as boolean} onToggle={(expanded) => onToggle("vinyls" as keyof T, expanded)}/>
      <VinylTopArtists stats={stats} expanded={expandedSections.topArtists as boolean} onToggle={(expanded) => onToggle("topArtists" as keyof T, expanded)}/>
    </>
  )
}

export default VinylStats