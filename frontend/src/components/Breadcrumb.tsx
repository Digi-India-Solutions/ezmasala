"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-6 text-sm font-medium text-gray-600 flex items-center gap-2">
      <Link href="/" className="hover:text-black transition">
        Home
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-black transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
