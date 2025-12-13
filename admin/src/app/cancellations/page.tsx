'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';

interface CancellationRequest {
  _id: string;
  orderId: string;
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  total: number;
  status: string;
  cancellationReason: string;
  cancellationStatus: string;
  cancellationRequestedAt: string;
  createdAt: string;
}

export default function CancellationsPage() {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchCancellationRequests();
  }, []);

  const fetchCancellationRequests = async () => {
    try {
      const data = await api.get('/orders/cancellation-requests');
      if (data.success) {
        setRequests(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch cancellation requests:', error);
      toast.error('Failed to load cancellation requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this cancellation?')) return;

    setProcessing(id);
    try {
      const data = await api.post(`/orders/${id}/approve-cancellation`);
      if (data.success) {
        toast.success('Cancellation approved');
        fetchCancellationRequests();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to approve cancellation');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this cancellation request?')) return;

    setProcessing(id);
    try {
      const data = await api.post(`/orders/${id}/reject-cancellation`);
      if (data.success) {
        toast.success('Cancellation rejected');
        fetchCancellationRequests();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reject cancellation');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Cancellation Requests</h1>
        <p className="text-gray-600 mt-1">Manage order cancellation requests from customers</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No pending cancellation requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl border p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/orders/${request._id}`}
                      className="font-bold text-lg text-black hover:underline"
                    >
                      {request.orderId}
                    </Link>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {request.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Customer:</span>{' '}
                      {request.userId
                        ? `${request.userId.firstName} ${request.userId.lastName} (${request.userId.email})`
                        : 'Guest'}
                    </p>
                    <p>
                      <span className="font-medium">Order Total:</span> ₹{request.total}
                    </p>
                    <p>
                      <span className="font-medium">Order Date:</span> {formatDate(request.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Requested:</span> {formatDate(request.cancellationRequestedAt)}
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-800 mb-1">Cancellation Reason:</p>
                    <p className="text-sm text-red-700">{request.cancellationReason}</p>
                  </div>
                </div>

                <div className="flex gap-3 md:flex-col">
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={processing === request._id}
                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing === request._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={processing === request._id}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing === request._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
