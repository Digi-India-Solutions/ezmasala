"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => {
    const toggle = () => setIsOpen(prev => !prev);
    document.addEventListener("toggle-mobile-menu", toggle);
    return () => document.removeEventListener("toggle-mobile-menu", toggle);
  }, []);

  const links = [
    { href: "/about", label: "About Us" },
    { href: "/cook", label: "Cooking With EZ Masala" },
    { href: "/blog", label: "Know Your Masala" },
    { href: "/faq", label: "FAQ" },
    { href: "/bulk-horeca", label: "Bulk & HoReCa" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:pl-12">

        <ul className="hidden lg:flex items-center gap-8 py-4">
          {/* Home Link */}
          <li>
            <Link
              href="/"
              prefetch={true}
              className={`font-semibold text-[1rem] transition-all duration-200 hover:text-black relative group ${pathname === "/" ? "text-black" : "text-gray-600"
                }`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-200 ${pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              ></span>
            </Link>
          </li>

          {/* Shop Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <button
              className={`font-semibold text-[1rem] transition-all duration-200 hover:text-black relative group flex items-center gap-1 ${pathname.startsWith("/collection") || pathname === "/collections" ? "text-black" : "text-gray-600"
                }`}
            >
              Shop
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isShopOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-200 ${pathname.startsWith("/collection") || pathname === "/collections" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              ></span>
            </button>

            {/* Dropdown Menu */}
            {isShopOpen && (
              <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <Link
                  href="/collections"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors"
                >
                  View All Products
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <Link
                  href="/collection/masala-j"
                  className="block px-4 py-3 text-gray-700 transition-colors"
                  style={{ backgroundColor: '#eae6d2' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">J</span>
                    </div>
                    <div>
                      <div className="font-semibold">EZ Masala J</div>
                      <div className="text-xs text-gray-500">North Indian Style</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/collection/masala-m"
                  className="block px-4 py-3 text-gray-700 transition-colors"
                  style={{ backgroundColor: '#eddee1' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">M</span>
                    </div>
                    <div>
                      <div className="font-semibold">EZ Masala M</div>
                      <div className="text-xs text-gray-500">South Indian Style</div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </li>

          {/* Other Links */}
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch={true}
                className={`font-semibold text-[1rem] transition-all duration-200 hover:text-black relative group ${pathname === link.href ? "text-black" : "text-gray-600"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-200 ${pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-black transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="py-2">
            <li>
              <Link
                href="/"
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 text-md font-semibold border-b border-gray-200 ${pathname === "/" ? "text-black bg-gray-100" : "text-gray-700"
                  }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/collections"
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 text-md font-semibold border-b border-gray-200 ${pathname === "/collections" ? "text-black bg-gray-100" : "text-gray-700"
                  }`}
              >
                Shop - View All
              </Link>
            </li>

            <li>
              <Link
                href="/collection/masala-j"
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 text-md font-semibold border-b border-gray-200 pl-10 ${pathname === "/collection/masala-j" ? "text-black bg-gray-100" : "text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">J</span>
                  </div>
                  EZ Masala J
                </div>
              </Link>
            </li>

            <li>
              <Link
                href="/collection/masala-m"
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 text-md font-semibold border-b border-gray-200 pl-10 ${pathname === "/collection/masala-m" ? "text-black bg-gray-100" : "text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">M</span>
                  </div>
                  EZ Masala M
                </div>
              </Link>
            </li>

            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-5 py-3 text-md font-semibold border-b border-gray-200 ${pathname === link.href ? "text-black bg-gray-100" : "text-gray-700"
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-md font-semibold text-gray-700 border-b border-gray-200"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
