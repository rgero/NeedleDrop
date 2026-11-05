export const normalizeColumnOrder = (order: string[], defaults: string[]) => {
  const seen = new Set<string>();
  const normalized = order.filter((id) => {
    if (!defaults.includes(id) || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });

  return [...normalized, ...defaults.filter((id) => !seen.has(id))];
};
