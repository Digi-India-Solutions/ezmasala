"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import NavWrapper from "./NavWrapper";
import Footer from "./Footer";
import DealsBanner from "./DealsBanner";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin pages only get their content (AdminNav is in admin layout)
    return <>{children}</>;
  }

  // Regular pages get header, nav, and footer
  return (
    <>
      <DealsBanner />
      <Header />
      <NavWrapper />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
