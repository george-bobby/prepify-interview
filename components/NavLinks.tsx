"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
    navLinks: { href: string; label: string }[];
    featuresLinks?: { href: string; label: string }[];
    toolsLinks?: { href: string; label: string }[];
    resourcesLinks?: { href: string; label: string }[];
}

const NavLinks = ({ navLinks, featuresLinks, toolsLinks, resourcesLinks }: NavLinksProps) => {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const isActiveDropdown = (links: { href: string; label: string }[]) => {
        return links.some(link => pathname === link.href || pathname.startsWith(link.href));
    };

    const renderDropdown = (label: string, links: { href: string; label: string }[]) => {
        const isOpen = openDropdown === label;
        const isActive = isActiveDropdown(links);

        return (
            <div 
                className="relative group"
                onMouseEnter={() => setOpenDropdown(label)}
                onMouseLeave={() => setOpenDropdown(null)}
            >
                <button
                    className={`transition-colors duration-200 font-medium flex items-center gap-1 text-lg ${
                        isActive
                            ? 'text-primary-200 border-b-2 border-primary-200 pb-1'
                            : 'text-light-100 hover:text-primary-100'
                    }`}
                >
                    {label}
                    <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {isOpen && (
                    <div 
                        className="absolute top-full left-0 pt-2 z-50"
                    >
                        <div className="w-52 bg-dark-200 border border-dark-300 rounded-lg shadow-xl py-2">
                            {links.map((link) => {
                                const isLinkActive = pathname === link.href || pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-4 py-3 transition-colors duration-200 text-base ${
                                            isLinkActive
                                                ? 'text-primary-200 bg-dark-300'
                                                : 'text-light-100 hover:text-primary-100 hover:bg-dark-300'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
            {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-colors duration-200 font-medium whitespace-nowrap text-lg ${
                            isActive
                                ? 'text-primary-200 border-b-2 border-primary-200 pb-1'
                                : 'text-light-100 hover:text-primary-100'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
            
            {/* Tools Dropdown */}
            {toolsLinks && toolsLinks.length > 0 && renderDropdown('Tools', toolsLinks)}
            
            {/* Resources Dropdown */}
            {resourcesLinks && resourcesLinks.length > 0 && renderDropdown('Resources', resourcesLinks)}
        </nav>
    );
};

export default NavLinks;
