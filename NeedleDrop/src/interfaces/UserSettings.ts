import type { GridColumnVisibilityModel } from "@mui/x-data-grid"

export interface LocationSettings {
  name: boolean,
  address: boolean,
  recommended: boolean,
  purchaseCount: boolean,
  notes: boolean
}

export interface PlaylogsSettings  {
  date: boolean,
  listeners: boolean,
  artist: boolean,
  album: boolean
}

export interface VinylSettings extends GridColumnVisibilityModel {
  purchaseNumber: boolean,
  artist: boolean,
  album: boolean,
  color: boolean,
  purchaseDate: boolean,
  purchaseLocation: boolean,
  owners: boolean,
  purchasedBy: boolean,
  likedBy: boolean,
  notes: boolean,
  doubleLP: boolean,
  isComplete: boolean,
  length: boolean,
  playCount: boolean,
  price: boolean
}

export interface WantItemSettings {
  artist: boolean,
  album: boolean,
  imageUrl: boolean,
  searcher: boolean,
  created_at: boolean,
  weight: boolean,
  notes: boolean,
}

export interface UserSettings {
  locations: LocationSettings,
  playlogs: PlaylogsSettings,
  vinyls: VinylSettings,
  wantedItems: WantItemSettings
}

export const DefaultSettings: UserSettings = {
  locations: {
    name: true,
    address: true,
    recommended: true,
    purchaseCount: true,
    notes: false
  },
  playlogs: {
    date: true,
    listeners: true,
    artist: true,
    album: true
  },
  vinyls: {
    purchaseNumber: true,
    artist: true,
    album: true,
    color: false,
    purchaseDate: false,
    purchaseLocation: false,
    owners: true,
    purchasedBy: false,
    likedBy: false,
    notes: false,
    doubleLP: false,
    isComplete: false,
    length: false,
    playCount: false,
    price: false
  },
  wantedItems: {
    artist: true,
    album: true,
    imageUrl: true,
    searcher: true,
    created_at: false,
    weight: true,
    notes: false
  }
}