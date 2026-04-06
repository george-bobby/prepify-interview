/**
 * Internal plan keys → Dodo product IDs (configure in the Dodo dashboard per environment).
 *
 * Mapping:
 * - `pro` → NEXT_PUBLIC_DODO_PRO_PRODUCT_ID (monthly Pro; test_mode vs live_mode uses the same env name with different values per deployment)
 *
 * Add more keys (e.g. `proAnnual`) and env vars when you add tiers.
 */
export type DodoPlanKey = "pro";

export function getDodoProductIdForPlan(plan: DodoPlanKey): string | undefined {
  if (plan === "pro") {
    return process.env.NEXT_PUBLIC_DODO_PRO_PRODUCT_ID;
  }
  return undefined;
}
