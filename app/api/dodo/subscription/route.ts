import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Subscription, SubscriptionChangePlanParams } from "dodopayments/resources/subscriptions";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import { getDodoClient } from "@/lib/dodo";
import { toUnixSeconds } from "@/lib/dodo-datetime";
import { logDodoError } from "@/lib/dodo-monitoring";

function periodUnixFromDodoSubscription(sub: Subscription): { start: number | null; end: number | null } {
  const startRaw =
    (sub as unknown as { current_period_start?: string }).current_period_start ?? sub.previous_billing_date;
  const endRaw =
    (sub as unknown as { current_period_end?: string }).current_period_end ?? sub.next_billing_date;
  return {
    start: toUnixSeconds(startRaw),
    end: toUnixSeconds(endRaw),
  };
}

// Shape returned to the frontend SubscriptionSection component (dates as unix seconds)
function buildResponseFromDoc(userData: Record<string, unknown>) {
  const hasSubscription = Boolean(userData?.subscriptionId);
  return {
    hasSubscription,
    isProSubscriber: Boolean(userData?.isProSubscriber),
    subscription: hasSubscription
      ? {
          id: userData.subscriptionId as string,
          status: (userData.subscriptionStatus as string | undefined) ?? null,
          planId: (userData.subscriptionPlanId as string | undefined) ?? null,
          currentStart: (userData.subscriptionCurrentStart as number | undefined) ?? null,
          currentEnd: (userData.subscriptionCurrentEnd as number | undefined) ?? null,
        }
      : undefined,
  };
}

const prorationModes = z.enum([
  "prorated_immediately",
  "full_immediately",
  "difference_immediately",
  "do_not_bill",
]);

const postBodySchema = z.union([
  z.object({ action: z.literal("cancel") }),
  z.object({
    action: z.literal("change_plan"),
    productId: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
    prorationBillingMode: prorationModes,
    effectiveAt: z.enum(["immediately", "next_billing_date"]).optional(),
    onPaymentFailure: z.enum(["prevent_change", "apply_change"]).optional(),
    discountCode: z.string().optional(),
    preview: z.boolean().optional().default(false),
  }),
]);

// GET - Fetch user's subscription details (prefer live from Dodo; fallback to Firestore doc)
export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userDoc = await db.collection("users").doc(user.id).get();
    const userData = userDoc.data() || {};

    if (!userData?.subscriptionId) {
      return NextResponse.json({
        hasSubscription: false,
        isProSubscriber: false,
      });
    }

    try {
      const client = getDodoClient();
      const sub = await client.subscriptions.retrieve(userData.subscriptionId as string);
      const { start: periodStart, end: periodEnd } = periodUnixFromDodoSubscription(sub);

      await db.collection("users").doc(user.id).set(
        {
          subscriptionStatus: sub.status ?? userData.subscriptionStatus ?? null,
          subscriptionPlanId: sub.product_id ?? userData.subscriptionPlanId ?? null,
          subscriptionCurrentStart: periodStart ?? userData.subscriptionCurrentStart ?? null,
          subscriptionCurrentEnd: periodEnd ?? userData.subscriptionCurrentEnd ?? null,
          subscriptionUpdatedAt: new Date().toISOString(),
          isProSubscriber: (sub.status ?? "").toLowerCase() === "active",
        },
        { merge: true }
      );

      const merged = {
        ...userData,
        subscriptionStatus: sub.status ?? userData.subscriptionStatus,
        subscriptionPlanId: sub.product_id ?? userData.subscriptionPlanId,
        subscriptionCurrentStart: periodStart ?? userData.subscriptionCurrentStart,
        subscriptionCurrentEnd: periodEnd ?? userData.subscriptionCurrentEnd,
        isProSubscriber: (sub.status ?? "").toLowerCase() === "active",
      };

      return NextResponse.json(buildResponseFromDoc(merged as Record<string, unknown>));
    } catch (liveErr) {
      logDodoError("retrieve subscription failed, falling back to Firestore", liveErr);
      return NextResponse.json(buildResponseFromDoc(userData as Record<string, unknown>));
    }
  } catch (error) {
    logDodoError("GET subscription", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// POST — cancel at period end, or change plan (with optional preview)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.json();
    const parsed = postBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.flatten() }, { status: 400 });
    }

    const body = parsed.data;

    const userDoc = await db.collection("users").doc(user.id).get();
    const userData = userDoc.data() || {};

    if (!userData?.subscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const subscriptionId = userData.subscriptionId as string;
    const client = getDodoClient();

    if (body.action === "cancel") {
      const updated = await client.subscriptions.update(subscriptionId, {
        cancel_at_next_billing_date: true,
      });

      await db.collection("users").doc(user.id).set(
        {
          subscriptionStatus: updated.status ?? "cancelled",
          subscriptionUpdatedAt: new Date().toISOString(),
          isProSubscriber: (updated.status ?? "").toLowerCase() === "active",
        },
        { merge: true }
      );

      return NextResponse.json({
        message: "Subscription cancellation scheduled at period end",
        subscription: {
          id: subscriptionId,
          status: updated.status ?? "cancelled",
        },
      });
    }

    const changeBody: SubscriptionChangePlanParams = {
      product_id: body.productId,
      quantity: body.quantity,
      proration_billing_mode: body.prorationBillingMode,
    };
    if (body.effectiveAt) changeBody.effective_at = body.effectiveAt;
    if (body.onPaymentFailure) changeBody.on_payment_failure = body.onPaymentFailure;
    if (body.discountCode) changeBody.discount_code = body.discountCode;

    if (body.preview) {
      const preview = await client.subscriptions.previewChangePlan(subscriptionId, changeBody);
      return NextResponse.json({ preview });
    }

    await client.subscriptions.changePlan(subscriptionId, changeBody);

    const sub = await client.subscriptions.retrieve(subscriptionId);
    const { start: periodStart, end: periodEnd } = periodUnixFromDodoSubscription(sub);

    await db.collection("users").doc(user.id).set(
      {
        subscriptionPlanId: sub.product_id ?? null,
        subscriptionStatus: sub.status ?? null,
        subscriptionCurrentStart: periodStart,
        subscriptionCurrentEnd: periodEnd,
        subscriptionUpdatedAt: new Date().toISOString(),
        isProSubscriber: (sub.status ?? "").toLowerCase() === "active",
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Plan change applied",
      subscription: {
        id: subscriptionId,
        status: sub.status,
        planId: sub.product_id,
      },
    });
  } catch (error) {
    logDodoError("POST subscription", error);
    return NextResponse.json({ error: "Failed to manage subscription" }, { status: 500 });
  }
}
