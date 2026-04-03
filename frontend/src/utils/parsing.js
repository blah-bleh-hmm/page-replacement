export const parseReferenceString = (value) =>
  value
    .trim()
    .split(/[ ,]+/)
    .filter(Boolean)
    .map((p) => Number(p))
    .filter((p) => Number.isFinite(p));
