"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AdminNav from "./AdminNav";
export default function NavWrapper() {
  const path = usePathname();

  const isAdmin = path?.startsWith("/admin");

  return isAdmin ? <AdminNav /> : <Navbar />;
}
