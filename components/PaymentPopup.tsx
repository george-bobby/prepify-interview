"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getDodoProductIdForPlan } from "@/lib/dodo-products";

export default function PaymentPopup({ showPopup, setShowPopup }: { showPopup: boolean; setShowPopup: (value: boolean) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const closePopup = () => setShowPopup(false);

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      const productId = getDodoProductIdForPlan("pro");
      const trialDaysRaw = process.env.NEXT_PUBLIC_DODO_TRIAL_DAYS || "0";
      const trialDays = Number.isNaN(parseInt(trialDaysRaw)) ? 0 : parseInt(trialDaysRaw, 10);

      if (!productId) {
        throw new Error("Missing NEXT_PUBLIC_DODO_PRO_PRODUCT_ID");
      }

      // Create a Dodo Checkout Session (recommended)
      const body: any = {
        product_cart: [{ product_id: productId, quantity: 1 }],
        // Optional: pass subscription trial configuration
        ...(trialDays > 0 ? { subscription_data: { trial_period_days: trialDays } } : {}),
        // You can add metadata or customer prefill here if desired
        // metadata: { source: "prepify-app" }
      };

      const res = await fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create checkout session: ${res.status} ${text}`);
      }

      const data = await res.json();
      const checkoutUrl = data.checkout_url || data.url;
      if (!checkoutUrl) {
        throw new Error("No checkout_url returned from Dodo checkout route");
      }

      // Redirect to hosted checkout; return_url will bring the user back.
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start checkout");
      setIsLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <>
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
