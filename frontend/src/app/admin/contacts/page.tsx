'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from "@/lib/api";

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
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
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
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete contact');
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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Name</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Email</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Message</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No contact submissions yet
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact: any) => (
                    <tr key={contact._id} className="border-t">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{contact.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{contact.email}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base max-w-xs truncate" title={contact.message}>
                        {contact.message}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{new Date(contact.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          disabled={deletingId === contact._id}
                          className="bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === contact._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
