"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(8);

  const paymentId = searchParams.get("payment_id") ?? searchParams.get("paymentId");
  const subscriptionId = searchParams.get("subscription_id") ?? searchParams.get("subscriptionId");

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/settings");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-dark-300 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl shadow-lg">
          ✓
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">You&apos;re now Pro!</h1>
          <p className="text-light-200">
            Welcome to Prepify Pro — unlimited AI interviews and resume reviews are now unlocked.
          </p>
        </div>

        {(paymentId || subscriptionId) && (
          <div className="bg-dark-400 rounded-lg px-4 py-3 text-xs text-light-300 w-full text-left space-y-1">
            {paymentId && (
              <p>
                <span className="text-light-200">Payment ID:</span>{" "}
                <span className="font-mono">{paymentId}</span>
              </p>
            )}
            {subscriptionId && (
              <p>
                <span className="text-light-200">Subscription ID:</span>{" "}
                <span className="font-mono">{subscriptionId}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <Link href="/settings" passHref>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
              View Subscription
            </Button>
          </Link>
          <Link href="/interviews/create" passHref>
            <Button variant="outline" className="w-full border-light-400 text-light-100">
              Start an Interview
            </Button>
          </Link>
        </div>

        <p className="text-xs text-light-300">
          Redirecting to settings in {countdown}s…
        </p>
      </div>
    </div>
  );
}
