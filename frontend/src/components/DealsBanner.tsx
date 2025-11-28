'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DealsBanner() {
  const [deals, setDeals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await api.get('/deals');
      const activeDeals = (data.deals || []).filter((deal: any) => deal.isActive);
      setDeals(activeDeals);
    } catch (error) {
      console.error('Failed to fetch deals');
    }
  };

  const handleClick = () => {
    router.push('/collections');
  };

  if (deals.length === 0) return null;

  const announcementText = deals.map(deal => deal.title).join(' • ');

  return (
    <div
      className="sticky top-0 z-40 bg-gradient-to-r from-red-600 to-orange-500 text-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleClick}
    >
      <div className="relative h-10 flex items-center">
        <div className="animate-scroll-left whitespace-nowrap">
          <span className="inline-block px-4 text-sm md:text-base font-semibold">
            {announcementText} • {announcementText} • {announcementText}
          </span>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
