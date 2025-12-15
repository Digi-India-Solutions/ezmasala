"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import DescriptionBuilder from "@/components/DescriptionBuilder";
import api from "@/lib/api";

interface SpiceFormProps {
    spice?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function SpiceForm({ spice, onSuccess, onCancel }: SpiceFormProps) {
    const [icons, setIcons] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        image: "",
        images: [] as string[],
        category: [] as string[],
        stock: "",
        icons: [] as string[],
    });

    const [categoryInput, setCategoryInput] = useState("");

    const [preview, setPreview] = useState("");
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        loadIcons();
        if (spice) {
            // Handle both string and array categories (for backward compatibility)
            let categories: string[] = [];
            if (Array.isArray(spice.category)) {
                categories = spice.category;
            } else if (typeof spice.category === 'string') {
                categories = [spice.category];
            }

            setFormData({
                title: spice.title || "",
                description: spice.description || "",
                price: spice.price ? spice.price.toString() : "",
                originalPrice: spice.originalPrice ? spice.originalPrice.toString() : "",
                image: spice.image || "",
                images: spice.images || [],
                category: categories,
                stock: spice.stock ? spice.stock.toString() : "",
                icons: spice.icons || [],
            });
            setPreview(spice.image);
            setPreviews(spice.images || []);
        }
    }, [spice]);

    const loadIcons = async () => {
        try {
            const data = await api.get("/icons");
            setIcons(data.filter((i: any) => i.isActive));
        } catch (err) {
            console.error("Failed to load icons", err);
        }
    };

    const handleImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setFormData((prev) => ({ ...prev, image: base64 }));
            setPreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleMultipleImagesChange = (files: FileList) => {
        const fileArray = Array.from(files);
        const newPreviews: string[] = [];
        const newImages: string[] = [];

        let processedCount = 0;
        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                newImages.push(base64);
                newPreviews.push(base64);

                processedCount++;
                if (processedCount === fileArray.length) {
                    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
                    setPreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleIcon = (iconId: string) => {
        setFormData((prev) => ({
            ...prev,
            icons: prev.icons.includes(iconId)
                ? prev.icons.filter((i) => i !== iconId)
                : [...prev.icons, iconId],
        }));
    };

    const addCategory = () => {
        const trimmedCategory = categoryInput.trim();
        if (trimmedCategory && !formData.category.includes(trimmedCategory)) {
            setFormData((prev) => ({
                ...prev,
                category: [...prev.category, trimmedCategory],
            }));
            setCategoryInput("");
        }
    };

    const removeCategory = (categoryToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            category: prev.category.filter((cat) => cat !== categoryToRemove),
        }));
    };

    const handleCategoryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCategory();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (formData.category.length === 0) {
            toast.error("Please add at least one category");
            return;
        }

        setIsSubmitting(true);

        // Convert numeric strings to numbers before sending
        const bodyToSend = {
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
            stock: Number(formData.stock),
        };

        try {
            if (spice) {
                await api.put(`/spices/${spice._id}`, bodyToSend);
                toast.success("Spice updated!");
            } else {
                await api.post("/spices", bodyToSend);
                toast.success("Spice created!");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Failed to save spice");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
            {/* TITLE */}
            <div>
                <label className="font-semibold block mb-2">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border p-3 rounded-xl w-full"
                    required
                />
            </div>

            {/* DESCRIPTION BUILDER */}
            <div>
                <DescriptionBuilder
                    value={formData.description}
                    onChange={(text: string) =>
                        setFormData({ ...formData, description: text })
                    }
                />
            </div>

            {/* PRICING */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold block mb-2">Sale Price (₹)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                        className="border p-3 rounded-xl w-full"
                        required
                    />
                </div>

                <div>
                    <label className="font-semibold block mb-2">Original Price (₹) - Optional</label>
                    <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                            setFormData({ ...formData, originalPrice: e.target.value })
                        }
                        className="border p-3 rounded-xl w-full"
                    />
                </div>
            </div>

            {/* STOCK */}
            <div>
                <label className="font-semibold block mb-2">Stock</label>
                <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                    }
                    className="border p-3 rounded-xl w-full"
                    required
                />
            </div>

            {/* CATEGORIES */}
            <div>
                <label className="font-semibold block mb-2">Categories</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyPress={handleCategoryKeyPress}
                        placeholder="Type a category and press Enter or click Add"
                        className="border p-3 rounded-xl flex-1"
                    />
                    <button
                        type="button"
                        onClick={addCategory}
                        className="bg-black text-white px-6 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        Add
                    </button>
                </div>

                {/* Display added categories */}
                {formData.category.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {formData.category.map((cat) => (
                            <div
                                key={cat}
                                className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm"
                            >
                                <span>{cat}</span>
                                <button
                                    type="button"
                                    onClick={() => removeCategory(cat)}
                                    className="hover:text-red-300 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-sm text-gray-600 mt-2">
                    Add multiple categories to help users find this spice. At least one category is required.
                </p>
            </div>

            {/* MAIN IMAGE */}
            <div>
                <label className="font-semibold block mb-2">Main Image</label>
                <div className="mb-2 p-3 bg-yellow-50 border border-yellow-300 rounded-xl">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">Image Dimension Recommendation</p>
                            <p className="text-xs text-yellow-700 mt-1">
                                For best display on the frontend, please use <strong>square images (1:1 ratio)</strong> such as 800x800px, 1000x1000px, or 1200x1200px. Non-square images will be cropped to fit.
                            </p>
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageChange(file);
                    }}
                    className="border p-3 rounded-xl w-full"
                    required={!spice}
                />

                {preview && (
                    <img
                        src={preview}
                        className="w-32 h-32 mt-4 rounded-xl object-cover"
                        alt="Main preview"
                    />
                )}
            </div>

            {/* MULTIPLE IMAGES */}
            <div>
                <label className="font-semibold block mb-2">Additional Images</label>
                <div className="mb-2 p-3 bg-yellow-50 border border-yellow-300 rounded-xl">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">Image Dimension Recommendation</p>
                            <p className="text-xs text-yellow-700 mt-1">
                                For best display on the frontend, please use <strong>square images (1:1 ratio)</strong> such as 800x800px, 1000x1000px, or 1200x1200px. Non-square images will be cropped to fit.
                            </p>
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) handleMultipleImagesChange(files);
                    }}
                    className="border p-3 rounded-xl w-full"
                />

                {previews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {previews.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img}
                                    className="w-full h-32 rounded-xl object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ICONS */}
            <div>
                <label className="font-semibold block mb-2">Product Icons</label>

                <div className="grid grid-cols-3 gap-4">
                    {icons.map((icon) => {
                        const active = formData.icons.includes(icon.id);

                        return (
                            <button
                                key={icon.id}
                                type="button"
                                onClick={() => toggleIcon(icon.id)}
                                className={`relative border rounded-xl p-4 flex flex-col items-center gap-2 transition ${active
                                    ? "border-black bg-black/5 scale-105 shadow-md"
                                    : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {active && (
                                    <div className="absolute top-2 right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        ✓
                                    </div>
                                )}

                                <img src={icon.icon} className="w-10 h-10 object-contain" />
                                <span className="text-sm text-center">{icon.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-black p-3 rounded-xl"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting
                        ? spice
                            ? "Updating..."
                            : "Creating..."
                        : spice
                            ? "Update Spice"
                            : "Create Spice"}
                </button>
            </div>
        </form>
    );
}
