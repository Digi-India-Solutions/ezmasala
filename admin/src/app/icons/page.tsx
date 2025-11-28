'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminIconsPage() {
    const [icons, setIcons] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIcon, setEditingIcon] = useState<any>(null);
    const [formData, setFormData] = useState({
        id: '',
        label: '',
        icon: '',
        isActive: true
    });

    useEffect(() => {
        fetchIcons();
    }, []);

    const fetchIcons = async () => {
        try {
            const data = await api.get('/icons');
            setIcons(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch icons');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingIcon) {
                await api.put(`/icons/${editingIcon._id}`, formData);
                toast.success('Icon updated!');
            } else {
                await api.post('/icons', formData);
                toast.success('Icon created!');
            }
            fetchIcons();
            closeModal();
        } catch (error: any) {
            toast.error(error.message || 'Error saving icon');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;

        try {
            await api.delete(`/icons/${id}`);
            toast.success('Icon deleted!');
            fetchIcons();
        } catch (error: any) {
            toast.error(error.message || 'Error deleting icon');
        }
    };

    const openModal = (icon?: any) => {
        if (icon) {
            setEditingIcon(icon);
            setFormData({
                id: icon.id,
                label: icon.label,
                icon: icon.icon,
                isActive: icon.isActive
            });
        } else {
            setEditingIcon(null);
            setFormData({
                id: '',
                label: '',
                icon: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIcon(null);
        setFormData({
            id: '',
            label: '',
            icon: '',
            isActive: true
        });
    };

    return (
        <div className="p-8">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Icon Management</h1>
                <button onClick={() => openModal()} className="bg-black text-white px-6 py-3 rounded-lg">
                    Add New Icon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {icons.map((icon) => (
                    <div key={icon._id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src={icon.icon} className="w-10 h-10 object-contain" />
                                <div>
                                    <h3 className="font-bold text-lg">{icon.label}</h3>
                                    <p className="text-sm text-gray-500">ID: {icon.id}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${icon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {icon.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => openModal(icon)} className="flex-1 bg-blue-500 text-white py-2 rounded">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(icon._id)} className="flex-1 bg-red-500 text-white py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingIcon ? 'Edit Icon' : 'Add Icon'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">ID (unique)</label>
                                <input
                                    type="text"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    className="border p-2 w-full rounded"
                                    required
                                    disabled={!!editingIcon}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Icon URL</label>
                                <input
                                    type="url"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="border p-2 w-full rounded"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span>Active</span>
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 rounded py-2">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-black text-white rounded py-2">
                                    {editingIcon ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
