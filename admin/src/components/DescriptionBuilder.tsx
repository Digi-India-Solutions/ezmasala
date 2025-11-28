"use client";

import { useState, useEffect } from "react";

export default function DescriptionBuilder({ value, onChange }: any) {
    const [sections, setSections] = useState<any[]>([]);

    // Parse initial description if editing
    useEffect(() => {
        if (!value) return;
        if (sections.length > 0) return; // Prevent overwriting after first load

        const parsed: any[] = [];
        const blocks = value.split(/\n\s*\d+\.\s+/).filter(Boolean);

        blocks.forEach((block: any, idx: any) => {
            const [titleLine, ...rest] = block.trim().split("\n");
            parsed.push({
                title: idx === 0 ? titleLine.replace(/^\d+\.\s*/, "") : titleLine,
                content: rest.join("\n").trim(),
            });
        });

        setSections(parsed);
    }, [value]);

    const updateFinalString = (updated: any[]) => {
        const finalString = updated
            .map((sec: any, i: number) => {
                return `${i + 1}. ${sec.title}\n${sec.content}`;
            })
            .join("\n\n");

        onChange(finalString);
    };

    const addSection = () => {
        const updated = [...sections, { title: "", content: "" }];
        setSections(updated);
        updateFinalString(updated);
    };

    const updateSection = (index: number, field: string, val: string) => {
        const updated = [...sections];
        updated[index][field] = val;
        setSections(updated);
        updateFinalString(updated);
    };

    const removeSection = (index: number) => {
        const updated = sections.filter((_, i) => i !== index);
        setSections(updated);
        updateFinalString(updated);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Structured Description</h2>
                <button
                    type="button"
                    onClick={addSection}
                    className="bg-black text-white px-4 py-2 rounded-xl"
                >
                    + Add Section
                </button>
            </div>

            {/* Sections */}
            {sections.map((sec, i) => (
                <div key={i} className="border bg-gray-50 p-4 rounded-xl space-y-4">

                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Section {i + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeSection(i)}
                            className="text-red-600 font-bold"
                        >
                            Delete
                        </button>
                    </div>

                    {/* Title */}
                    <input
                        placeholder="Section Title (e.g., Overview)"
                        value={sec.title}
                        onChange={(e) => updateSection(i, "title", e.target.value)}
                        className="border p-3 w-full rounded-xl"
                    />

                    {/* Content */}
                    <textarea
                        rows={5}
                        placeholder="Content (supports bullet points: ● Item)"
                        value={sec.content}
                        onChange={(e) => updateSection(i, "content", e.target.value)}
                        className="border p-3 w-full rounded-xl"
                    />
                </div>
            ))}
        </div>
    );
}
