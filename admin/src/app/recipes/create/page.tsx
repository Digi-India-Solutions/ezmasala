'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CreateRecipePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    ingredients: [''],
    steps: [''],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'recipes');

      const data = await api.upload('/upload/file', formData);
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/cooks', formData);
      toast.success('Recipe created successfully!');
      router.push('/recipes');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8 text-black">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black disabled:opacity-50"
            required
          />
          {uploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
          {formData.image && <img src={formData.image} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />}
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none mb-2 text-black"
              placeholder={`Ingredient ${index + 1}`}
              required
            />
          ))}
          <button type="button" onClick={addIngredient} className="text-black font-semibold hover:underline">
            + Add Ingredient
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Steps</label>
          {formData.steps.map((step, index) => (
            <textarea
              key={index}
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none mb-2 text-black"
              placeholder={`Step ${index + 1}`}
              required
            />
          ))}
          <button type="button" onClick={addStep} className="text-black font-semibold hover:underline">
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}
