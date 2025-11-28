"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SpiceForm from "@/components/SpiceForm";
import api from "@/lib/api";

export default function EditSpicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [spice, setSpice] = useState<any>(null);

  useEffect(() => {
    api.get(`/spices/${id}`)
      .then((data) => setSpice(data));
  }, [id]);

  if (!spice) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-8 text-black">Edit Spice</h1>

      <SpiceForm
        spice={spice}
        onSuccess={() => router.push("/admin/spices")}
        onCancel={() => router.push("/admin/spices")}
      />
    </div>
  );
}
