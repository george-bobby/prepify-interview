"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { socialAPI } from "@/lib/services/social-api";
import { NotificationsPanel } from "./NotificationsPanel";

const NotificationsButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const response = await socialAPI.getNotifications({ limit: 1, offset: 0 });
                if (mounted) setUnreadCount(response.unreadCount || 0);
            } catch (error) {
                // silent fail for background badge
                console.error("Notifications badge load error:", error);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-light-400 hover:text-primary-100 transition-colors rounded-lg hover:bg-dark-200"
                title="Notifications"
                aria-label="Open notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive-100 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <NotificationsPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onUnreadCountChange={(c) => setUnreadCount(c)}
                buttonRef={buttonRef}
            />
        </div>
    );
};

export default NotificationsButton;
