"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, X, Check, Trash2, CheckCheck } from "lucide-react";
import { socialAPI } from "@/lib/services/social-api";
import { Notification } from "@/lib/schemas/social";
import { toast } from "sonner";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
  buttonRef,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate position based on button location
  useEffect(() => {
    if (isOpen && buttonRef?.current && !isMobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen, buttonRef, isMobile]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await socialAPI.getNotifications({
        limit: 50,
        offset: 0,
      });
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      onUnreadCountChange?.(response.unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to load notifications";
      if (error instanceof Error) {
        if (error.message.includes("Authentication required")) {
          errorMessage = "Please sign in to view notifications";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error - please check your connection";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await socialAPI.markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      const newUnreadCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newUnreadCount);
      onUnreadCountChange?.(newUnreadCount);
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await socialAPI.markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      onUnreadCountChange?.(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await socialAPI.deleteNotification(notificationId);
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  const panelContent = (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown panel */}
      <div
        className={`fixed bg-dark-200 border border-dark-300 flex flex-col shadow-2xl z-50 ${
          isMobile
            ? 'left-4 right-4 top-16 max-h-[calc(100vh-8rem)] rounded-lg'
            : 'w-96 max-h-[80vh] rounded-lg'
        }`}
        style={!isMobile ? {
          top: `${position.top}px`,
          right: `${position.right}px`,
        } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-dark-300">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary-200" />
            <h3 className="text-base md:text-lg font-semibold text-light-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-destructive-100 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-light-400 hover:text-light-100 p-2 rounded-lg hover:bg-dark-300 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-light-400 hover:text-light-100 p-2 rounded-lg hover:bg-dark-300 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-200"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-light-400">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-300">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 md:p-4 hover:bg-dark-300 transition-colors ${!notification.isRead
                      ? "bg-dark-300/50 border-l-4 border-primary-200"
                      : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-xs md:text-sm font-medium text-light-100 truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-200 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-light-300 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] md:text-xs text-light-500">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-0.5 md:space-x-1 ml-1 md:ml-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id!)}
                          className="text-light-400 hover:text-success-100 p-1 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id!)
                        }
                        className="text-light-400 hover:text-destructive-100 p-1 rounded transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return typeof window !== 'undefined' ? createPortal(panelContent, document.body) : null;
};
