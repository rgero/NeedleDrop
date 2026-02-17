import type { GridColumnVisibilityModel } from "@mui/x-data-grid"

export interface LocationSettings extends GridColumnVisibilityModel {
  name: boolean,
  address: boolean,
  recommended: boolean,
  purchaseCount: boolean,
  notes: boolean
}

export interface PlaylogsSettings extends GridColumnVisibilityModel  {
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

export interface WantItemSettings extends GridColumnVisibilityModel {
  artist: boolean,
  album: boolean,
  imageUrl: boolean,
  searcher: boolean,
  created_at: boolean,
  weight: boolean,
  notes: boolean,
}

interface ExpandedSections {
  vinyls: boolean,
  topArtists: boolean,
  locations: boolean,
  playlogs: boolean,
  topPlayDays: boolean
  playsByDays: boolean,
  playsByTimelineChart: boolean
}

export interface UserStatsExpandedSections extends ExpandedSections {
  userStats: boolean
};

export interface HouseStatsExpandedSections extends ExpandedSections {
  houseStats: boolean
}

export interface UserSettings {
  locations: LocationSettings,
  playlogs: PlaylogsSettings,
  vinyls: VinylSettings,
  wantedItems: WantItemSettings,
  userStatsExpandedSections: UserStatsExpandedSections,
  houseStatsExpandedSections: HouseStatsExpandedSections
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
  },
  userStatsExpandedSections: {
    userStats: true,
    vinyls: true,
    topArtists: true,
    locations: true,
    playlogs: true,
    topPlayDays: true,
    playsByDays: true,
    playsByTimelineChart: true
  },
  houseStatsExpandedSections: {
    houseStats: true,
    vinyls: true,
    topArtists: true,
    locations: true,
    playlogs: true,
    topPlayDays: true,
    playsByDays: true,
    playsByTimelineChart: true
  }
}