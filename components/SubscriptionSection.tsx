"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PaymentPopup from "./PaymentPopup";

interface Subscription {
    id: string;
    status: string;
    planId: string;
    currentStart?: number;
    currentEnd?: number;
    startAt?: number;
    endAt?: number;
    totalCount?: number;
    paidCount?: number;
    remainingCount?: number;
    shortUrl?: string;
}

interface SubscriptionData {
    hasSubscription: boolean;
    isProSubscriber: boolean;
    subscription?: Subscription;
}

export default function SubscriptionSection() {
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            const response = await fetch('/api/razorpay/subscription');
            if (response.ok) {
                const data = await response.json();
                setSubscriptionData(data);
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        setCancelling(true);
        try {
            const response = await fetch('/api/razorpay/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'cancel' }),
            });

            if (response.ok) {
                toast.success('Subscription cancelled successfully. You will retain Pro benefits until the end of your current billing cycle.');
                fetchSubscriptionData();
            } else {
                toast.error('Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            toast.error('Failed to cancel subscription');
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-400';
            case 'cancelled':
                return 'text-yellow-400';
            case 'expired':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'cancelled':
                return 'Cancelled';
            case 'expired':
                return 'Expired';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-light-100 mb-4">Subscription</h2>
                <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-light-200">Loading subscription information...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-light-100 mb-4">Subscription</h2>

                {subscriptionData?.hasSubscription ? (
                    <div className="bg-dark-300 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-primary-200">Prepify Pro</h3>
                                <p className={`text-sm font-medium ${getStatusColor(subscriptionData.subscription?.status || '')}`}>
                                    {getStatusText(subscriptionData.subscription?.status || '')}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">₹199</div>
                                <div className="text-sm text-light-200">per month</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-light-200">Current Period</p>
                                <p className="text-light-100">
                                    {formatDate(subscriptionData.subscription?.currentStart)} - {formatDate(subscriptionData.subscription?.currentEnd)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-light-200">Subscription ID</p>
                                <p className="text-light-100 font-mono text-xs">
                                    {subscriptionData.subscription?.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-light-200 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Unlimited AI interviews</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Unlimited resume reviews</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Priority support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Advanced analytics</span>
                            </div>
                        </div>

                        {subscriptionData.subscription?.status === 'active' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelSubscription}
                                disabled={cancelling}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="bg-dark-300 rounded-lg p-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-light-100 mb-2">No Active Subscription</h3>
                            <p className="text-light-200 mb-4">
                                Upgrade to Prepify Pro for unlimited interviews and resume reviews.
                            </p>
                            <Button
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                                onClick={() => setShowUpgradePopup(true)}
                            >
                                Upgrade to Pro - ₹199/month
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <PaymentPopup showPopup={showUpgradePopup} setShowPopup={setShowUpgradePopup} />
        </>
    );
}
