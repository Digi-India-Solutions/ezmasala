"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import api from "@/lib/api";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const contentDropdownRef = useRef<HTMLLIElement>(null);
  const adminDropdownRef = useRef<HTMLLIElement>(null);

  const mainNavItems = [
    { label: "Dashboard", href: "/admin" },
  ];

  const contentNavItems = [
    { label: "Spices", href: "/admin/spices" },
    { label: "Blogs", href: "/admin/blogs" },
    { label: "Recipes", href: "/admin/recipes" },
    { label: "Videos", href: "/admin/videos" },
    { label: "Banners", href: "/admin/banners" },
    { label: "Deals", href: "/admin/deals" },
    { label: "Reviews", href: "/admin/reviews" },
    { label: "Icons", href: "/admin/icons" },
  ];

  const adminNavItems = [
    { label: "Orders", href: "/admin/orders" },
    { label: "Users", href: "/admin/users" },
    { label: "Contacts", href: "/admin/contacts" },
  ];

  const allNavItems = [...mainNavItems, ...contentNavItems, ...adminNavItems];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentDropdownRef.current && !contentDropdownRef.current.contains(event.target as Node)) {
        setContentDropdownOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (href: string) => {
    setNavigatingTo(href);
    setIsOpen(false);
    setContentDropdownOpen(false);
    setAdminDropdownOpen(false);
    startTransition(() => {
      router.push(href);
    });
    setTimeout(() => setNavigatingTo(null), 1000);
  };

  const handleLogout = async () => {
    setNavigatingTo("logout");
    try {
      await api.post("/auth/admin/logout");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const isContentActive = contentNavItems.some(item => pathname === item.href);
  const isAdminActive = adminNavItems.some(item => pathname === item.href);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between py-4">
          <span className="text-xl font-black text-black">Admin Panel</span>

          <ul className="flex items-center gap-6">
            {/* Dashboard */}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    disabled={navigatingTo === item.href}
                    className={`
                      group font-semibold text-base cursor-pointer relative transition-all duration-200
                      ${isActive ? "text-black" : "text-gray-600 hover:text-black"}
                      ${navigatingTo === item.href ? "opacity-50" : ""}
                    `}
                  >
                    {item.label}
                    {navigatingTo === item.href && (
                      <span className="ml-2 inline-block">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                      </span>
                    )}
                    <span
                      className={`
                        absolute -bottom-1 left-0 h-[2px] w-full bg-black rounded-full
                        transition-transform duration-300 ease-out
                        ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                      `}
                    ></span>
                  </button>
                </li>
              );
            })}

            {/* Content Management Dropdown */}
            <li className="relative" ref={contentDropdownRef}>
              <button
                onClick={() => setContentDropdownOpen(!contentDropdownOpen)}
                className={`
                  group font-semibold text-base cursor-pointer relative transition-all duration-200 flex items-center gap-1
                  ${isContentActive ? "text-black" : "text-gray-600 hover:text-black"}
                `}
              >
                Content
                <svg
                  className={`w-4 h-4 transition-transform ${contentDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span
                  className={`
                    absolute -bottom-1 left-0 h-[2px] w-full bg-black rounded-full
                    transition-transform duration-300 ease-out
                    ${isContentActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                ></span>
              </button>

              {contentDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                  {contentNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={`
                          w-full text-left px-4 py-2.5 text-sm font-semibold transition
                          ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>

            {/* Admin Management Dropdown */}
            <li className="relative" ref={adminDropdownRef}>
              <button
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                className={`
                  group font-semibold text-base cursor-pointer relative transition-all duration-200 flex items-center gap-1
                  ${isAdminActive ? "text-black" : "text-gray-600 hover:text-black"}
                `}
              >
                Manage
                <svg
                  className={`w-4 h-4 transition-transform ${adminDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span
                  className={`
                    absolute -bottom-1 left-0 h-[2px] w-full bg-black rounded-full
                    transition-transform duration-300 ease-out
                    ${isAdminActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                ></span>
              </button>

              {adminDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                  {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={`
                          w-full text-left px-4 py-2.5 text-sm font-semibold transition
                          ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          </ul>

          <button
            onClick={handleLogout}
            disabled={navigatingTo === "logout"}
            className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50"
          >
            {navigatingTo === "logout" ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <span className="text-lg font-black">Admin Panel</span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              disabled={navigatingTo === "logout"}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition text-xs disabled:opacity-50"
            >
              {navigatingTo === "logout" ? "Logging out..." : "Logout"}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-black focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 animate-slideDown">
            <ul className="py-2">
              {allNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition
                        ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}
                      `}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
