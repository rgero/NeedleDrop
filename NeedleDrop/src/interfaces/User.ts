import type { UserSettings } from "./settings/UserSettings";

export interface User 
{
  id: string,
  name: string,
  editor: boolean,
  discord_id?: string | null,
  settings: UserSettings
}