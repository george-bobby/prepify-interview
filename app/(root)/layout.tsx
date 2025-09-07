import React from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated()
  if (!isUserAuthenticated) {
    redirect('/signin')
  }
  return (
    <div className="min-h-screen bg-dark-100">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
export default RootLayout;