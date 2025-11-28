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
        category: "",
        stock: "",
        icons: [] as string[],
    });

    const [preview, setPreview] = useState("");
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        loadIcons();
        if (spice) {
            setFormData({
                title: spice.title,
                description: spice.description,
                price: spice.price.toString(),
                originalPrice: spice.originalPrice?.toString() || "",
                image: spice.image,
                images: spice.images || [],
                category: spice.category,
                stock: spice.stock.toString(),
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

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
            } else {
                await api.post("/spices", bodyToSend);
            }
            toast.success(spice ? "Spice updated!" : "Spice created!");
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
                <label className="font-semibold block mb-2">Product Description</label>

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

            {/* CATEGORY */}
            <div>
                <label className="font-semibold block mb-2">Category</label>
                <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }
                    className="border p-3 rounded-xl w-full"
                    required
                />
            </div>

            {/* MAIN IMAGE */}
            <div>
                <label className="font-semibold block mb-2">Main Image</label>
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
