'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface ContactInfo {
  companyName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await api.get('/contact-info');
        if (data.success && data.contactInfo) {
          setContactInfo(data.contactInfo);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-300 mt-24">
      <div className="container mx-auto px-6 md:px-12 py-20">

        {/* SINGLE ROW: LOGO + QUICK LINKS + LEGAL + CONTACT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-16">

          {/* LOGO + DESCRIPTION */}
          <div>
            <Link href="/" className="inline-block mb-8">
              <img
                src="/logo.png"
                alt="EZ Masala"
                className="w-auto h-14"
              />
            </Link>

            <p className="text-gray-700 text-lg leading-relaxed max-w-sm font-inter">
              Our products are made with ethically sourced ingredients and contain
              no added chemicals, flavours, colours or preservatives.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-xl font-poppins">
              Quick Links
            </h4>

            <ul className="space-y-1 text-base text-black font-inter">
              <li><Link href="/collections" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Shop All</Link></li>
              <li><Link href="/about" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">About Us</Link></li>
              <li><Link href="/cook" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Cooking With EZ Masala</Link></li>
              <li><Link href="/blog" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Know Your Masala</Link></li>
              <li><Link href="/faq" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">FAQ</Link></li>
              <li><Link href="/bulk-horeca" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Bulk & HoReCa</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-xl font-poppins">
              Legal
            </h4>

            <ul className="space-y-1 text-base text-black font-inter">
              <li><Link href="/shipping" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Shipping Information</Link></li>
              <li><Link href="/refund" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Refund Policy</Link></li>
              <li><Link href="/privacy" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="underline underline-offset-4 decoration-black hover:text-green-600 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-xl font-poppins">
              Contact Us
            </h4>

            <ul className="space-y-2 text-base text-gray-700 font-inter">
              <li className="text-lg">Phone: {contactInfo?.phone || '+91 9082730822'}</li>
              <li className="text-lg">
                Email:
                <a href={`mailto:${contactInfo?.email || 'hello@ezmasala.com'}`} className="ml-1 underline underline-offset-4 decoration-black hover:text-green-600 transition">
                  {contactInfo?.email || 'hello@ezmasala.com'}
                </a>
              </li>
              
            </ul>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-8">
              <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white rounded-full transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white rounded-full transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white rounded-full transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.60a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* HYGIENE & TRUST NOTE */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 md:p-8 mb-8 border-l-4 border-green-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Our Commitment to Quality & Hygiene</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                We understand how important food products are for your family. We aim to follow clean and careful handling practices and provide clear guidance so that EZ Masala is used correctly in your kitchen.
              </p>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p className="text-[14px]">&copy; 2025 EZ Masala.</p>
        </div>
      </div>
    </footer>
  );
}
