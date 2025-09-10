"use client";

import { useState } from "react";
import { toast } from "sonner";
import Script from "next/script";
import { Button } from "@/components/ui/button";

export default function PaymentPopup({ showPopup, setShowPopup }: { showPopup: boolean; setShowPopup: (value: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const closePopup = () => setShowPopup(false);

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      // Create subscription
      const res = await fetch("/api/razorpay/createSubscription", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create subscription");
      }

      const data = await res.json();

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "Prepify Pro Subscription",
        description: "Monthly subscription for unlimited interviews and resume reviews",
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verifySubscription", {
              method: "POST",
              body: JSON.stringify({
                subscriptionId: response.razorpay_subscription_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const verifyData = await verifyRes.json();

            if (verifyData.isOk) {
              toast.success("Subscription activated successfully! Welcome to Prepify Pro!");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              toast.error("Subscription verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Subscription verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          }
        }
      };

      const payment = new (window as any).Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to create subscription");
      setIsLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 w-96 relative animate-fadeIn scale-100 transform transition-all duration-300">
          <button
            onClick={closePopup}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold mb-4 text-center text-white">Upgrade to Prepify Pro</h3>

          <div className="mb-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">₹199<span className="text-lg text-gray-400">/month</span></div>
            <p className="text-gray-300 text-sm">Unlimited interviews and resume reviews</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>✓</span>
              <span>Unlimited AI interviews</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>✓</span>
              <span>Unlimited resume reviews</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>✓</span>
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>✓</span>
              <span>Advanced analytics</span>
            </div>
          </div>

          <Button
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            onClick={handleSubscription}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Subscribe to Pro - ₹199/month"}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Cancel anytime. No long-term commitments.
          </p>
        </div>
      </div>
    </>
  );
}
