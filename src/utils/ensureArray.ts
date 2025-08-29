export const ensureArray = <T>(x: T | T[] | null | undefined): T[] =>
  Array.isArray(x) ? x : x ? [x] : [];