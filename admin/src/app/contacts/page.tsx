'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await api.get('/contacts');
      setContacts(data);
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error);
      toast.error(error.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete contact');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">Contact Submissions</h1>
          <div className="text-gray-600 font-semibold">Total: {contacts.length}</div>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
            No contact submissions yet
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <div key={contact._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header with name and query type */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-black">{contact.name}</h3>
                      {contact.queryType && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contact.queryType === 'bulk' ? 'bg-orange-100 text-orange-700' :
                          contact.queryType === 'order-delivery' ? 'bg-blue-100 text-blue-700' :
                          contact.queryType === 'how-to-use' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.queryType === 'bulk' ? 'Bulk / HoReCa' :
                           contact.queryType === 'order-delivery' ? 'Order / Delivery' :
                           contact.queryType === 'how-to-use' ? 'How to Use' :
                           contact.queryType === 'general' ? 'General' :
                           contact.queryType}
                        </span>
                      )}
                    </div>

                    {/* Contact details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 font-medium">Email:</span>
                        <p className="text-black">{contact.email}</p>
                      </div>
                      {contact.mobile && (
                        <div>
                          <span className="text-gray-500 font-medium">Mobile:</span>
                          <p className="text-black">{contact.mobile}</p>
                        </div>
                      )}
                      {contact.city && (
                        <div>
                          <span className="text-gray-500 font-medium">City:</span>
                          <p className="text-black">{contact.city}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500 font-medium">Date:</span>
                        <p className="text-black">{new Date(contact.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-gray-500 font-medium text-sm">Message:</span>
                      <p className="text-black mt-1 whitespace-pre-wrap">{contact.message}</p>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === contact._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
