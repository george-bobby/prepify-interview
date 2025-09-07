import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/actions/auth.action';
import NavLinks from '@/components/NavLinks';
import MobileMenu from '@/components/MobileMenu';

const Header = async () => {
    const user = await getCurrentUser();

    const navLinks = [
        { href: '/interviews', label: 'Interviews' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/courses', label: 'Courses' },
        { href: '/coding', label: 'Coding' },
        { href: '/roadmaps', label: 'Roadmaps' },
        { href: '/resume', label: 'Resume' },
        { href: '/jobs', label: 'Jobs' },
        { href: '/insights', label: 'Insights' },
    ];

    return (
        <header className="border-b border-dark-300 bg-dark-100/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Prepify Logo" height={32} width={38} />
                        <h2 className="text-primary-100 text-xl font-semibold">Prepify</h2>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <NavLinks navLinks={navLinks} />

                    {/* Desktop User Info and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden sm:flex items-center gap-2 text-light-100">
                                <span className="text-sm">Welcome, {user.name}</span>
                                <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                                    <span className="text-dark-100 text-sm font-medium">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <MobileMenu navLinks={navLinks} user={user} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
