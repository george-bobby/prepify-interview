import DodoPayments from "dodopayments";

type DodoEnvironment = "test_mode" | "live_mode";

export function getDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error("Missing DODO_PAYMENTS_API_KEY");
  }
  const env = (process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode") as DodoEnvironment;

  return new DodoPayments({
    bearerToken,
    environment: env,
  });
}