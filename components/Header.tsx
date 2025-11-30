import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import NavLinks from "@/components/NavLinks";
import MobileMenu from "@/components/MobileMenu";
import UserDropdown from "@/components/UserDropdown";
import NotificationsButton from "@/components/NotificationsButton";

const Header = async () => {
  const user = await getCurrentUser();

  // Main navigation links (max 6)
  const mainNavLinks = [
    { href: "/interviews", label: "Interviews" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resume", label: "Resume" },
    { href: "/home#pricing", label: "Pricing" },
  ];

  // Tools dropdown items
  const toolsLinks = [
    { href: "/coding", label: "Coding" },
    { href: "/feed", label: "Feed" },
    { href: "/ideas", label: "Ideas" },
  ];

  // Resources dropdown items
  const resourcesLinks = [
    { href: "/jobs", label: "Jobs" },
    { href: "/companies", label: "Companies" },
    { href: "/insights", label: "Insights" },
    { href: "/roadmaps", label: "Roadmaps" },
    { href: "/courses", label: "Courses" },
  ];

  // Pages that are NOT in the bottom navigation bar (for mobile menu)
  const sidebarNavLinks = [
    ...toolsLinks,
    ...resourcesLinks,
  ];

  return (
    <header className="border-b border-dark-300 bg-dark-100/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-24">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/logo.svg" alt="Prepify Logo" height={40} width={48} />
            <h2 className="text-primary-100 text-2xl font-semibold">Prepify</h2>
          </Link>

          {/* Desktop Navigation Links - only show for authenticated users */}
          {user && (
            <NavLinks 
              navLinks={mainNavLinks.filter(link => link.label !== 'Pricing')}
              toolsLinks={toolsLinks}
              resourcesLinks={resourcesLinks}
            />
          )}

          {/* Desktop User Info and Mobile Sidebar */}
          <div className="flex items-center gap-4 ml-auto">
            {user ? (
              <>
                <Link
                  href="/home#pricing"
                  className="hidden md:block text-light-100 hover:text-primary-200 transition-colors font-medium text-lg"
                >
                  Pricing
                </Link>
                <div className="flex items-center gap-2">
                  <NotificationsButton />
                  <div className="hidden md:block">
                    <UserDropdown user={user} />
                  </div>
                </div>
                {/* Mobile Sidebar for additional pages */}
                <MobileMenu navLinks={sidebarNavLinks} user={user} />
              </>
            ) : (
              /* Show navigation for landing page */
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="#features"
                    className="text-light-400 hover:text-primary-200 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-light-400 hover:text-primary-200 transition-colors"
                  >
                    How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="text-light-400 hover:text-primary-200 transition-colors"
                  >
                    Pricing
                  </a>
                </nav>
                <Link
                  href="/signin"
                  className="text-light-400 hover:text-primary-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-200 text-white px-4 py-2 rounded-lg hover:bg-primary-300 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
