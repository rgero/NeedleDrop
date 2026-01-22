import type { Vinyl } from "@interfaces/Vinyl";

export const checkIsComplete = (v: Vinyl): boolean => {
  return !!(
    v.artist && 
    v.album && 
    v.purchaseDate && 
    v.purchaseLocation && 
    v.owners?.length > 0
  );
};