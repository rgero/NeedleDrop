import type { UserSettings } from "./UserSettings";

export interface User 
{
  id: string,
  name: string,
  settings: UserSettings
}