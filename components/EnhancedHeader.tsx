import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/auth.action";
import NavLinks from "@/components/NavLinks";
import MobileMenu from "@/components/MobileMenu";
import UserDropdown from "@/components/UserDropdown";
import { EnhancedButton } from "@/components/ui/enhanced-button";

const EnhancedHeader = async () => {
  const user = await getCurrentUser();

  const navLinks = [
    { href: "/interviews", label: "Interviews", icon: "🎯" },
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/project", label: "P & R", icon: "🛠️" },
    { href: "/courses", label: "Courses", icon: "📚" },
    { href: "/coding", label: "Coding", icon: "💻" },
    { href: "/roadmaps", label: "Roadmaps", icon: "🗺️" },
    { href: "/resume", label: "Resume", icon: "📄" },
    { href: "/jobs", label: "Jobs", icon: "💼" },
    { href: "/insights", label: "Insights", icon: "📈" },
    { href: "/companies", label: "Companies", icon: "🏢" },
  ];

  return (
    <header className="border-b border-dark-300/50 bg-dark-100/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/home" className="flex items-center gap-3 group">
            <div className="relative">
              <Image src="/logo.svg" alt="Prepify Logo" height={36} width={42} className="group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-200"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-primary-100 text-xl font-bold tracking-tight group-hover:text-primary-200 transition-colors">
                Prepify
              </h2>
              <span className="text-xs text-light-400 -mt-1">AI Interview Prep</span>
            </div>
          </Link>

          {/* Desktop Navigation Links - only show for authenticated users */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              <NavLinks navLinks={navLinks} />
            </div>
          )}

          {/* Desktop User Info and Mobile Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Credits Display for Desktop */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full border border-primary-400/30">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-primary-200 text-sm font-medium">
                      {user.credits || 0} credits
                    </span>
                  </div>
                  <UserDropdown user={user} />
                </div>
                {/* Mobile Menu */}
                <MobileMenu navLinks={navLinks} user={user} />
              </>
            ) : (
              /* Enhanced Landing Page Navigation */
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="#features"
                    className="text-light-400 hover:text-primary-200 transition-all duration-200 relative group"
                  >
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-200 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-light-400 hover:text-primary-200 transition-all duration-200 relative group"
                  >
                    How It Works
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-200 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                  <a
                    href="#pricing"
                    className="text-light-400 hover:text-primary-200 transition-all duration-200 relative group"
                  >
                    Pricing
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-200 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                </nav>
                
                <div className="flex items-center gap-3">
                  <EnhancedButton
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-light-400 hover:text-primary-200"
                  >
                    <Link href="/signin">Sign In</Link>
                  </EnhancedButton>
                  
                  <EnhancedButton
                    asChild
                    variant="gradient"
                    size="sm"
                    shape="rounded"
                    className="shadow-lg hover:shadow-xl"
                  >
                    <Link href="/signup">
                      Get Started Free
                    </Link>
                  </EnhancedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Bottom Border with Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"></div>
    </header>
  );
};

export default EnhancedHeader;