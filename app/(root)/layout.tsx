import React from "react";
import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const RootLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const user = await getCurrentUser();

  // Get the current pathname to determine if authentication is required
  // Note: We'll handle authentication check in individual pages that need it
  // The home page should be accessible to everyone

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <MobileBottomNav user={user} />
    </div>
  );
}
export default RootLayout;