import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET - Fetch user's subscription details
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userDoc = await db.collection("users").doc(user.id).get();
        const userData = userDoc.data();

        if (!userData?.subscriptionId) {
            return NextResponse.json({
                hasSubscription: false,
                isProSubscriber: false
            });
        }

        // Fetch latest subscription status from Razorpay
        try {
            const subscription = await razorpay.subscriptions.fetch(userData.subscriptionId);
            
            // Update local data with latest status
            await db.collection("users").doc(user.id).update({
                subscriptionStatus: subscription.status,
                subscriptionCurrentStart: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
                subscriptionCurrentEnd: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
                subscriptionUpdatedAt: new Date().toISOString(),
            });

            return NextResponse.json({
                hasSubscription: true,
                isProSubscriber: subscription.status === 'active',
                subscription: {
                    id: subscription.id,
                    status: subscription.status,
                    planId: subscription.plan_id,
                    currentStart: subscription.current_start,
                    currentEnd: subscription.current_end,
                    startAt: subscription.start_at,
                    endAt: subscription.end_at,
                    totalCount: subscription.total_count,
                    paidCount: subscription.paid_count,
                    remainingCount: subscription.remaining_count,
                    shortUrl: subscription.short_url
                }
            });
        } catch (razorpayError) {
            console.error("Error fetching subscription from Razorpay:", razorpayError);
            // Return local data if Razorpay fetch fails
            return NextResponse.json({
                hasSubscription: true,
                isProSubscriber: userData.subscriptionStatus === 'active',
                subscription: {
                    id: userData.subscriptionId,
                    status: userData.subscriptionStatus,
                    planId: userData.subscriptionPlanId,
                    startAt: userData.subscriptionStartAt,
                    endAt: userData.subscriptionEndAt,
                    currentStart: userData.subscriptionCurrentStart,
                    currentEnd: userData.subscriptionCurrentEnd
                }
            });
        }
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscription" },
            { status: 500 }
        );
    }
}

// POST - Cancel subscription
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action } = await request.json();

        if (action === 'cancel') {
            const userDoc = await db.collection("users").doc(user.id).get();
            const userData = userDoc.data();

            if (!userData?.subscriptionId) {
                return NextResponse.json(
                    { error: "No active subscription found" },
                    { status: 404 }
                );
            }

            // Cancel subscription at Razorpay (at cycle end)
            const cancelledSubscription = await razorpay.subscriptions.cancel(
                userData.subscriptionId,
                { cancel_at_cycle_end: true }
            );

            // Update user data
            await db.collection("users").doc(user.id).update({
                subscriptionStatus: cancelledSubscription.status,
                subscriptionUpdatedAt: new Date().toISOString(),
                // Keep pro benefits until end of current cycle
                isProSubscriber: cancelledSubscription.status === 'active',
            });

            return NextResponse.json({
                message: "Subscription cancelled successfully",
                subscription: {
                    id: cancelledSubscription.id,
                    status: cancelledSubscription.status
                }
            });
        }

        return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
        );

    } catch (error) {
        console.error("Error managing subscription:", error);
        return NextResponse.json(
            { error: "Failed to manage subscription" },
            { status: 500 }
        );
    }
}
