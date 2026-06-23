import { Webhooks } from "@dodopayments/nextjs";
import { db } from "@/firebase/admin";
import { toUnixSeconds } from "@/lib/dodo-datetime";
import { logDodoInfo } from "@/lib/dodo-monitoring";

function periodFieldsFromSubscriptionPayload(s: Record<string, unknown>) {
  const startRaw = s.current_period_start ?? s.previous_billing_date;
  const endRaw = s.current_period_end ?? s.next_billing_date;
  return {
    subscriptionCurrentStart: toUnixSeconds(startRaw),
    subscriptionCurrentEnd: toUnixSeconds(endRaw),
  };
}

/**
 * Helper: create an idempotency key for webhook processing.
 * The Dodo header 'webhook-id' is not exposed by the adapter; fall back to type+timestamp.
 * This is acceptable for retries that preserve timestamp; you can enhance by hashing payload.
 */
function eventKeyFromPayload(payload: any) {
  return payload?.id || payload?.event_id || `${payload.type}:${payload.timestamp}`;
}

async function markProcessedOnce(key: string) {
  const ref = db.collection("webhook_events").doc(key);
  const snap = await ref.get();
  if (snap.exists) return false;
  await ref.set({
    processedAt: new Date().toISOString(),
  });
  return true;
}

async function upsertUserByEmail(email: string, updates: Record<string, any>) {
  if (!email) return;
  const snap = await db.collection("users").where("email", "==", email).limit(1).get();
  if (snap.empty) return;
  const doc = snap.docs[0];
  await doc.ref.set(
    {
      ...updates,
      subscriptionUpdatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
  // Generic fallback (optional)
  onPayload: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    // Use a different key namespace for payload logging so it doesn't conflict with main event processing
    const logKey = `payload:${key}`;
    const shouldProcess = await markProcessedOnce(logKey);
    if (!shouldProcess) return;

    logDodoInfo("webhook payload", { type: payload?.type, key });
    await db.collection("webhook_payloads").doc(key).set({
      receivedAt: new Date().toISOString(),
      type: payload?.type,
      business_id: payload?.business_id,
    });
  },

  // Payments
  onPaymentSucceeded: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const p = payload?.data;
    const email: string | undefined = p?.customer?.email;
    await db.collection("payments").doc(p?.payment_id ?? key).set(
      {
        paymentId: p?.payment_id,
        amountMinor: p?.total_amount,
        currency: p?.currency,
        status: p?.status ?? "succeeded",
        customerEmail: email,
        provider: "dodo",
        webhookKey: key,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Optional: mark last successful payment for the user
    if (email) {
      await upsertUserByEmail(email, {
        lastPaymentAt: new Date().toISOString(),
        lastPaymentAmountMinor: p?.total_amount,
        lastPaymentCurrency: p?.currency,
      });
    }
  },

  onPaymentFailed: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const p = payload?.data;
    const email: string | undefined = p?.customer?.email;
    await db.collection("payments").doc(p?.payment_id ?? key).set(
      {
        paymentId: p?.payment_id,
        amountMinor: p?.total_amount,
        currency: p?.currency,
        status: p?.status ?? "failed",
        customerEmail: email,
        provider: "dodo",
        webhookKey: key,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  },

  // Subscriptions
  onSubscriptionActive: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data as Record<string, unknown> | undefined;
    const email: string | undefined = (s?.customer as { email?: string } | undefined)?.email;

    const periods = s ? periodFieldsFromSubscriptionPayload(s) : { subscriptionCurrentStart: null, subscriptionCurrentEnd: null };
    await upsertUserByEmail(email!, {
      isProSubscriber: true,
      subscriptionStatus: (s?.status as string | undefined) ?? "active",
      subscriptionId: s?.subscription_id as string | undefined,
      subscriptionPlanId: (s?.product_id as string | undefined) ?? null,
      subscriptionCurrentStart: periods.subscriptionCurrentStart,
      subscriptionCurrentEnd: periods.subscriptionCurrentEnd,
    });
  },

  onSubscriptionOnHold: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data;
    const email: string | undefined = s?.customer?.email;
    await upsertUserByEmail(email!, {
      isProSubscriber: false, // lock features until payment method is updated
      subscriptionStatus: s?.status ?? "on_hold",
    });
  },

  onSubscriptionRenewed: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data as Record<string, unknown> | undefined;
    const email: string | undefined = (s?.customer as { email?: string } | undefined)?.email;
    const end = s ? toUnixSeconds(s.next_billing_date) : null;
    await upsertUserByEmail(email!, {
      isProSubscriber: true,
      subscriptionStatus: (s?.status as string | undefined) ?? "active",
      subscriptionCurrentEnd: end,
    });
  },

  onSubscriptionPlanChanged: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data as Record<string, unknown> | undefined;
    const email: string | undefined = (s?.customer as { email?: string } | undefined)?.email;
    await upsertUserByEmail(email!, {
      subscriptionPlanId: (s?.product_id as string | undefined) ?? null,
      subscriptionStatus: (s?.status as string | undefined) ?? "active",
    });
  },

  onSubscriptionCancelled: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data;
    const email: string | undefined = s?.customer?.email;
    // Keep isProSubscriber unchanged here; access ends on 'expired'
    await upsertUserByEmail(email!, {
      subscriptionStatus: s?.status ?? "cancelled",
    });
  },

  onSubscriptionExpired: async (payload: any) => {
    const key = eventKeyFromPayload(payload);
    const shouldProcess = await markProcessedOnce(key);
    if (!shouldProcess) return;

    const s = payload?.data;
    const email: string | undefined = s?.customer?.email;
    await upsertUserByEmail(email!, {
      isProSubscriber: false,
      subscriptionStatus: s?.status ?? "expired",
    });
  },
});