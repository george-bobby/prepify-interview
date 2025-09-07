"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
    navLinks: { href: string; label: string }[];
}

const NavLinks = ({ navLinks }: NavLinksProps) => {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-colors duration-200 font-medium ${isActive
                                ? 'text-primary-200 border-b-2 border-primary-200 pb-1'
                                : 'text-light-100 hover:text-primary-100'
                            }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavLinks;
