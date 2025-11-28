'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated, clearAdminAuth, getAdminData } from '@/utils/adminAuth';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const adminData = getAdminData();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    clearAdminAuth();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  if (!isAdminAuthenticated()) {
    return null;
  }

  return (
    <div className="w-full min-h-screen text-black px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">Admin Dashboard</h1>
            {adminData && (
              <p className="text-gray-600 mt-1">Welcome, {adminData.username}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          <AdminCard title="Manage Spices" desc="Add, edit, or delete spices" href="/admin/spices" />
          <AdminCard title="Manage Blogs" desc="Add, edit, or delete blog posts" href="/admin/blogs" />
          <AdminCard title="Manage Recipes" desc="Add, edit, or delete recipes" href="/admin/recipes" />
          <AdminCard title="Manage Orders" desc="View and update order status" href="/admin/orders" />
          <AdminCard title="Manage Icons" desc="Add, edit, or remove product icons" href="/admin/icons" />
          <AdminCard title="Manage Users" desc="View registered users" href="/admin/users" />
          <AdminCard title="Contact Submissions" desc="View customer inquiries" href="/admin/contacts" />

          {/* NEW PAGES */}
          <AdminCard title="Manage Banners" desc="Add or edit homepage banners" href="/admin/banners" />
          <AdminCard title="Manage Videos" desc="Upload and edit videos" href="/admin/videos" />
          <AdminCard title="Manage Deals" desc="Create and manage deals & offers" href="/admin/deals" />
          <AdminCard title="Manage Reviews" desc="View and moderate product reviews" href="/admin/reviews" />

        </div>
      </div>
    </div>
  );
}

interface AdminCardProps {
  href: string;
  title: string;
  desc: string;
}

function AdminCard({ href, title, desc }: AdminCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-black">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-black">{title}</h2>
        <p className="text-sm sm:text-base text-black">{desc}</p>
      </div>
    </Link>
  );
}
