'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    priority: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await api.get('/deals');
      setDeals(data.deals || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDeal) {
        await api.put(`/deals/${editingDeal._id}`, formData);
        toast.success('Deal updated!');
      } else {
        await api.post('/deals', formData);
        toast.success('Deal created!');
      }
      resetForm();
      fetchDeals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save deal');
    }
  };

  const handleEdit = (deal: any) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      priority: deal.priority,
      isActive: deal.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      await api.delete(`/deals/${id}`);
      toast.success('Deal deleted');
      fetchDeals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete deal');
    }
  };

  const toggleActive = async (deal: any) => {
    try {
      await api.put(`/deals/${deal._id}`, { isActive: !deal.isActive });
      toast.success(deal.isActive ? 'Deal deactivated' : 'Deal activated');
      fetchDeals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update deal');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      priority: 0,
      isActive: true,
    });
    setEditingDeal(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-black">Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-black">Manage Deals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800"
        >
          {showForm ? 'Cancel' : 'Create New Deal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-black">
            {editingDeal ? 'Edit Deal' : 'Create New Deal'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-semibold block mb-2 text-black">
                Announcement Text (This will scroll across the top of the page)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border p-3 rounded-xl w-full text-black"
                placeholder="e.g., 🎉 FLASH SALE! 50% OFF ALL SPICES - Limited Time Only"
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-2 text-black">Priority (Higher shows first)</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                className="border p-3 rounded-xl w-full text-black"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label className="text-black">Active (Show in announcement banner)</label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-300 text-black p-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-black text-white p-3 rounded-xl font-semibold">
              {editingDeal ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className={`bg-white border-2 rounded-2xl p-6 ${deal.isActive ? 'border-green-500' : 'border-gray-200'
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">{deal.title}</h3>
                <p className="text-xs text-gray-500">Priority: {deal.priority}</p>
              </div>

              <div className={`px-4 py-2 rounded-full font-semibold ${deal.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                {deal.isActive ? '● Active' : '● Inactive'}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(deal)}
                className={`flex-1 py-2 rounded-xl font-semibold ${deal.isActive
                    ? 'bg-gray-300 text-black hover:bg-gray-400'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {deal.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleEdit(deal)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(deal._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deals.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No deals yet. Create your first deal!</p>
      )}
    </div>
  );
}
