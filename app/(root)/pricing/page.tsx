"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getDodoProductIdForPlan } from "@/lib/dodo-products";

interface User {
  id: string;
  name: string;
  email?: string;
  isProSubscriber?: boolean;
  dodoCustomerId?: string;
}

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData as User | null);
      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handleSubscribePro = async () => {
    if (loadingCheckout) return;

    if (!user) {
      toast.error("Please sign in or create an account to subscribe.");
      window.location.href = "/signup";
      return;
    }

    if (user.isProSubscriber) {
      if (user.dodoCustomerId) {
        window.location.href = `/customer-portal?customer_id=${user.dodoCustomerId}`;
      } else {
        setLoadingCheckout(true);
        try {
          const res = await fetch("/api/dodo/subscription");
          if (res.ok) {
            const data = await res.json();
            if (data?.subscription?.customerId) {
              window.location.href = `/customer-portal?customer_id=${data.subscription.customerId}`;
              return;
            }
          }
        } catch (error) {
          console.error("Failed to fetch subscription for customer ID", error);
        } finally {
          setLoadingCheckout(false);
        }
        toast.error("Billing portal is unavailable. Missing billing account information.");
      }
      return;
    }

    setLoadingCheckout(true);
    try {
      const productId = getDodoProductIdForPlan("pro");
      const trialDaysRaw = process.env.NEXT_PUBLIC_DODO_TRIAL_DAYS || "0";
      const trialDays = Number.isNaN(parseInt(trialDaysRaw)) ? 0 : parseInt(trialDaysRaw, 10);

      if (!productId) {
        throw new Error("Dodo Payments Pro product configuration is missing.");
      }

      const body = {
        product_cart: [{ product_id: productId, quantity: 1 }],
        ...(trialDays > 0 ? { subscription_data: { trial_period_days: trialDays } } : {}),
      };

      const res = await fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to create checkout session", { status: res.status, body: text });
        throw new Error("Failed to create checkout session.");
      }

      const data = await res.json();
      const checkoutUrl = data.checkout_url || data.url;
      if (!checkoutUrl) {
        console.error("Checkout response data missing URL:", data);
        throw new Error("Invalid response received from checkout server.");
      }

      // Redirect to Dodo hosted checkout page
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to initiate subscription checkout.");
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="py-12 md:py-20 relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#c0fe72]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl w-full mx-auto relative z-10 px-4 md:px-6">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c0fe72]/10 text-[#c0fe72] text-xs font-semibold tracking-wide uppercase border border-[#c0fe72]/20 mb-4">
            Pricing Plans
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] via-[#d4ff8f] to-[#c0fe72]">Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Get lifetime career acceleration. Choose the plan that fits your interview preparation goals.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-5xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-gradient-to-b from-gray-900 to-black/80 rounded-3xl p-8 border border-gray-800/80 hover:border-gray-700/80 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#c0fe72] transition-colors">Free</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                Perfect for trying out Prepify and starting your prep journey.
              </p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">₹0</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>3 AI interviews per month</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Basic performance analytics</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>General interview questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-gray-500 font-semibold mt-0.5">✕</span>
                  <span className="text-gray-500 line-through">Resume optimization feedback</span>
                </li>
              </ul>
            </div>

            <Link
              href={user ? "/dashboard" : "/signup"}
              className="w-full text-center py-3.5 px-4 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:bg-white/5 hover:text-white transition-all text-sm mt-auto"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Pro Plan (Most Popular) */}
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-3xl p-8 border-2 border-[#c0fe72] relative flex flex-col justify-between shadow-[0_0_30px_rgba(192,254,114,0.15)] group">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f] text-black px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
              Most Popular
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-2xl font-bold text-white">Pro</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 min-h-[40px]">
                Unlock the full power of AI-powered mock interviews and feedback loops.
              </p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">₹199</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Unlimited AI interviews</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Company-specific questions</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Resume optimization reviews</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white font-medium">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Priority support channels</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubscribePro}
              disabled={loadingCheckout || loadingUser}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f] text-black font-extrabold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm mt-auto shadow-lg shadow-[#c0fe72]/20 disabled:opacity-50"
            >
              {loadingCheckout ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : user?.isProSubscriber ? (
                "Manage Subscription"
              ) : (
                "Subscribe to Pro"
              )}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gradient-to-b from-gray-900 to-black/80 rounded-3xl p-8 border border-gray-800/80 hover:border-gray-700/80 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#c0fe72] transition-colors">Enterprise</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                Tailored solutions for universities, placement cells, and recruiting agencies.
              </p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">Custom</span>
                <span className="text-gray-400 text-lg block mt-2">pricing plans</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Everything in Pro plan</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Dedicated dashboard & custom branding</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>Custom integrations & APIs</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#c0fe72] font-semibold mt-0.5">✓</span>
                  <span>SLA uptime guarantees</span>
                </li>
              </ul>
            </div>

            <Link
              href="/contact"
              className="w-full text-center py-3.5 px-4 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:bg-white/5 hover:text-white transition-all text-sm mt-auto"
            >
              Contact Sales
            </Link>
          </div>

        </div>

        {/* FAQs/Info section */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Have questions about billing or enterprise deployments? Visit our{" "}
            <Link href="/contact" className="text-[#c0fe72] underline hover:text-[#d4ff8f] transition-colors">
              contact support page
            </Link>{" "}
            or email us. Cancel your subscription anytime via the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
