import type { Vinyl } from "@interfaces/Vinyl";

/**
 * Equal split of recorded price across co-owners (matches collection valuation in VinylProvider).
 */
export function vinylPriceOwnerShare(vinyl: Vinyl): number {
  if (!vinyl.price) return 0;
  const n = vinyl.owners.length;
  if (n <= 0) return vinyl.price;
  return vinyl.price / n;
}
