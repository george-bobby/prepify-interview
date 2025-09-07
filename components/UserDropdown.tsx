'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth.action';

interface UserDropdownProps {
    user: {
        name: string;
        email?: string;
        id: string;
    };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const result = await signOut();
            if (result.success) {
                router.push('/signin');
                router.refresh();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-light-100 hover:opacity-80 transition-opacity"
            >
                <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center hover:bg-primary-300 transition-colors">
                    <span className="text-dark-100 text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                    </span>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-200 border border-dark-300 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-dark-300">
                            <p className="text-sm font-medium text-light-100">{user.name}</p>
                            {user.email && (
                                <p className="text-xs text-light-200 truncate">{user.email}</p>
                            )}
                        </div>

                        {/* Menu Items */}
                        <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-light-100 hover:bg-dark-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Account Settings
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-light-100 hover:bg-dark-300 transition-colors"
                        >
                            <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
