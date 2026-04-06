/**
 * Normalize Dodo API / webhook timestamps to Unix seconds for Firestore and the subscription UI.
 */
export function toUnixSeconds(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    if (value > 1e12) return Math.floor(value / 1000);
    return Math.floor(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return toUnixSeconds(Number(trimmed));
    }
    const ms = Date.parse(trimmed);
    if (!Number.isNaN(ms)) return Math.floor(ms / 1000);
  }
  return null;
}
