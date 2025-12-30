"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { logoutUser } from "@/store/slices/authSlice";
import { clearWishlist } from "@/store/slices/wishlistSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch(logoutUser());
    dispatch(clearWishlist());
    setShowUserDropdown(false);
    router.push("/");
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const data = await api.get(
            `/search?q=${encodeURIComponent(searchQuery)}`
          );
          setSearchResults(data);
          setShowResults(true);
        } catch (error) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(`/product/${productId}`);
  };

  return (
    <header className="border-b border-gray-200 bg-white relative z-[100]">
      <div className="container mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-6">
        <div className="lg:hidden flex items-center justify-between w-full">
          <button
            onClick={() =>
              document.dispatchEvent(new Event("toggle-mobile-menu"))
            }
            className="p-2 text-gray-700 hover:text-black transition"
          >
            <svg
              className="w-7 h-7"
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
          </button>

          {/* <Link href="/" className="flex items-center transition shrink-0">
            <Image src="/logo.png" alt="EZ Masala" width={160} height={70} className="h-12 w-auto" priority />
          </Link> */}
          <Link href="/" className="flex items-center transition shrink-0">
            <img
              src="/logo.png"
              alt="EZ Masala"
              className="h-12 w-auto"
              loading="eager"
            />
          </Link>

          <div className="w-8"></div>
        </div>

        <Link
          href="/"
          className="hidden lg:flex items-center hover:opacity-80 transition shrink-0"
        >
          <Image
            src="/logo.png"
            alt="EZ Masala"
            width={260}
            height={90}
            className="h-14 md:h-16 w-auto"
            priority
          />
        </Link>

        <div
          className="flex-1 max-w-lg relative hidden md:block"
          ref={searchRef}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for masalas, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-black">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-bold text-black">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 md:gap-3 shrink-0 relative z-50">
          {/* User Account Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => !user && setShowUserDropdown(true)}
            onMouseLeave={() => !user && setShowUserDropdown(false)}
          >
            {user ? (
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="group relative flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-all duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-semibold hidden lg:inline">
                  {user.firstName}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <Link
                href="/account"
                className="group relative flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-all duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-semibold hidden lg:inline">Profile</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            )}

            {/* Dropdown Menu - Shows on hover for non-logged-in, on click for logged-in */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full pt-2 z-[9999]">
                <div className="w-56 rounded-xl shadow-2xl border border-gray-200 py-2 bg-white">
                  {user ? (
                    <>
                      <Link
                        href={`/${user.firstName.toLowerCase()}`}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <Link
                        href={`/${user.firstName.toLowerCase()}?tab=orders`}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span className="font-medium">Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="font-medium">Wishlist</span>
                        {wishlistItems.length > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition w-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">Login/Signup</span>
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span className="font-medium">Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="font-medium">Wishlist</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center absolute -top-2 -right-2">
                  {wishlistItems.length}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700">Wishlist</span>
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItemsCount > 0 && (
                <span className="bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center absolute -top-2 -right-2">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
