import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatedSignature = (
    razorpaySubscriptionId: string,
    razorpayPaymentId: string
) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
    const sig = crypto
        .createHmac("sha256", keySecret)
        .update(razorpaySubscriptionId + "|" + razorpayPaymentId)
        .digest("hex");
    return sig;
};

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId, razorpayPaymentId, razorpaySignature } = await request.json();
        
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({
                message: "Unauthorized",
                isOk: false
            }, { status: 401 });
        }

        // Verify signature
        const signature = generatedSignature(subscriptionId, razorpayPaymentId);
        if (signature !== razorpaySignature) {
            return NextResponse.json({
                message: "Payment verification failed",
                isOk: false
            }, { status: 400 });
        }

        // Fetch subscription details from Razorpay
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        
        // Update user in Firebase with subscription information
        const userRef = db.collection("users").doc(user.id);
        const now = new Date();
        
        await userRef.update({
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionPlanId: subscription.plan_id,
            subscriptionStartAt: new Date(subscription.start_at * 1000).toISOString(),
            subscriptionEndAt: subscription.end_at ? new Date(subscription.end_at * 1000).toISOString() : null,
            subscriptionCurrentStart: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : null,
            subscriptionCurrentEnd: subscription.current_end ? new Date(subscription.current_end * 1000).toISOString() : null,
            subscriptionUpdatedAt: now.toISOString(),
            isProSubscriber: true,
            // Pro subscribers get unlimited credits (represented as 999)
            credits: 999,
            resumeCredits: 999,
            lastCreditRenewalAt: now.toISOString(),
            lastResumeCreditRenewalAt: now.toISOString(),
        });

        return NextResponse.json({
            message: "Subscription verified successfully",
            isOk: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                planId: subscription.plan_id
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error verifying subscription:", error);
        return NextResponse.json({
            message: "Subscription verification failed",
            isOk: false
        }, { status: 500 });
    }
}
