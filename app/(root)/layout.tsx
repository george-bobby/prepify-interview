import React from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RootLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const isUserAuthenticated = await isAuthenticated();

  // Get the current pathname to determine if authentication is required
  // Note: We'll handle authentication check in individual pages that need it
  // The home page should be accessible to everyone

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
export default RootLayout;