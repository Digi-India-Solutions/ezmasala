"use client";

import { useRouter } from "next/navigation";
import SpiceForm from "@/components/SpiceForm";

export default function CreateSpicePage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-8 text-black">Create Spice</h1>

      <SpiceForm
        onSuccess={() => router.push("/spices")}
        onCancel={() => router.push("/spices")}
      />
    </div>
  );
}
