"use client";

import { usePathname } from "next/navigation";
import ReduxProvider from "@/components/ReduxProvider";
import AdminNav from "@/components/AdminNav";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNav = pathname === "/login";

    return (
        <ReduxProvider>
            {!hideNav && (
                <>
                    <AdminNav />
                    <Sidebar />
                </>
            )}
            <Toaster position="top-right" richColors />
            <main className={`min-h-screen ${!hideNav ? "lg:ml-64 pt-0" : ""}`}>
                {children}
            </main>
        </ReduxProvider>
    );
}
