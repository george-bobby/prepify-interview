"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
    navLinks: { href: string; label: string }[];
    user: any;
}

const MobileMenu = ({ navLinks, user }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                className="md:hidden text-light-100"
                onClick={toggleMenu}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={toggleMenu} />
                    <div className="fixed top-0 right-0 h-full w-64 bg-dark-100 border-l border-dark-300 p-6">
                        {/* Close Button */}
                        <div className="flex justify-end mb-6">
                            <Button variant="ghost" onClick={toggleMenu} className="text-light-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>

                        {/* User Info */}
                        {user && (
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-dark-300">
                                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                                    <span className="text-dark-100 font-medium">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-primary-100 font-medium">{user.name}</p>
                                    <p className="text-light-400 text-sm">Credits: {user.credits || 0}</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={toggleMenu}
                                        className={`block px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-primary-200/10 text-primary-200 font-medium'
                                                : 'text-light-100 hover:bg-dark-200 hover:text-primary-100'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileMenu;
