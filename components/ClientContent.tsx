"use client";

import { useState } from "react";
import PaymentPopup from "./PaymentPopup";
import { Button } from "@/components/ui/button";

export default function ClientContent({ user }: { user: any }) {
  const [showPopup, setShowPopup] = useState(false);

  // Show upgrade option if user is not a pro subscriber
  if (user?.isProSubscriber) return null;

  return (
    <>
      <div className="flex flex-col gap-4">
        <Button className="btn-primary max-sm:w-full" onClick={() => setShowPopup(true)}>
          Upgrade to Pro - ₹199/month
        </Button>
        <p className="text-sm text-gray-500">
          Get unlimited interviews and resume reviews with Prepify Pro.
        </p>
      </div>

      <PaymentPopup showPopup={showPopup} setShowPopup={setShowPopup} />
    </>
  );
}
