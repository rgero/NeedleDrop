import { useEffect, useState } from "react"

export const useExpandedSections = <T extends { [K in keyof T]: boolean }>(initialState: T, onPersist?: (updated: T) => void) => {
  const [expandedSections, setExpandedSections] = useState<T>(initialState)

  // sync if initial changes
  useEffect(() => {
    setExpandedSections(initialState)
  }, [initialState])

  const handleToggle = (key: keyof T, expanded: boolean) => {
    const updated = { ...expandedSections, [key]: expanded }
    setExpandedSections(updated)
    onPersist?.(updated)
  }

  return { expandedSections, handleToggle }
}