import type { UserSettings } from "./settings/UserSettings";

export interface User 
{
  id: string,
  name: string,
  editor: boolean,
  settings: UserSettings
}