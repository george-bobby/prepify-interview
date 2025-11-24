"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
            {/* Mobile Menu Button - Show only on mobile */}
            <Button
                variant="ghost"
                className="md:hidden text-light-100 p-2"
                onClick={toggleMenu}
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-black/70" onClick={toggleMenu} />
                    <div className="fixed top-0 right-0 h-full w-72 bg-[#1a1a2e] border-l border-dark-300 shadow-xl">{/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-dark-300 bg-[#1a1a2e]">
                            <h3 className="text-primary-100 font-semibold text-lg">More Pages</h3>
                            <Button variant="ghost" onClick={toggleMenu} className="text-light-100 p-2">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="bg-[#1a1a2e] h-[calc(100vh-145px)] overflow-y-auto overflow-x-hidden pb-4">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={toggleMenu}
                                        className={`flex items-center justify-between p-6 border-b border-dark-300 bg-[#1a1a2e] transition-colors ${isActive
                                                ? 'text-primary-200 font-semibold'
                                                : 'text-light-100 hover:text-primary-100'
                                            }`}
                                    >
                                        <h3 className={`text-lg ${isActive ? 'font-semibold' : 'font-medium'}`}>{link.label}</h3>
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
