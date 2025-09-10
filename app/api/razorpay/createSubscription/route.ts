import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { planId } = await req.json();
        
        // Use the provided plan ID or default to the Pro plan
        const subscriptionPlanId = planId || process.env.RAZORPAY_PRO_PLAN_ID;
        
        if (!subscriptionPlanId) {
            return NextResponse.json(
                { error: "Plan ID not configured" },
                { status: 500 }
            );
        }

        // Create subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: subscriptionPlanId,
            customer_notify: true,
            quantity: 1,
            total_count: 12, // 12 months
            notes: {
                user_id: user.id,
                user_email: user.email || "",
                plan_type: "pro"
            }
        });

        return NextResponse.json({
            subscriptionId: subscription.id,
            planId: subscription.plan_id,
            status: subscription.status,
            shortUrl: subscription.short_url
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
        );
    }
}
