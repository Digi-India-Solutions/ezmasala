"use client";

import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

export default function BulkHorecaPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [interestedVariant, setInterestedVariant] = useState("");
  const [packSize, setPackSize] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post("/contacts", {
        name,
        email,
        mobile,
        city,
        queryType: 'bulk',
        message: `Business: ${businessName}, Type: ${businessType}, Meals/Day: ${mealsPerDay}, Variant: ${interestedVariant}, Pack Size: ${packSize}. ${message}`,
      });

      if (data.success) {
        toast.success(
          "Thank you for your enquiry. Our team will get in touch with you shortly during working hours."
        );
        setName("");
        setBusinessName("");
        setBusinessType("");
        setCity("");
        setMealsPerDay("");
        setInterestedVariant("");
        setPackSize("");
        setEmail("");
        setMobile("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send enquiry. Please try again.");
      }
    } catch (err: any) {
      console.error("Bulk enquiry error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Bulk & HoReCa / Distributors" }]} />

        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-black">
          Bulk & HoReCa / Distributors
        </h1>
        <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          EZ Masala is not only for home kitchens. We also support restaurants,
          tiffin services, cloud kitchens, canteens and distribution partners.
        </p>

        {/* WHY EZ MASALA FOR PROFESSIONAL KITCHENS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Why EZ Masala for Professional Kitchens?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Running a tiffin service, cloud kitchen or small restaurant requires
            consistency and speed. EZ Masala helps you in multiple ways:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Standardized Taste
                </h3>
                <p className="text-sm text-gray-700">
                  Your dishes taste the same every day, no matter who is cooking.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-l-4 border-green-500">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Easier Staff Training
                </h3>
                <p className="text-sm text-gray-700">
                  New cooks and helpers can follow the same method easily.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Time Savings
                </h3>
                <p className="text-sm text-gray-700">
                  Less confusion about masalas, faster batch preparation.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Consistent Quality
                </h3>
                <p className="text-sm text-gray-700">
                  Build trust with your customers by maintaining quality batches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHO SHOULD USE EZ MASALA IN BULK */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Who Should Use EZ Masala in Bulk?
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Tiffin Services & Home Chef Businesses
                </h4>
                <p className="text-sm text-gray-700">
                  Deliver consistent taste to all your subscribers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Cloud Kitchens & QSRs
                </h4>
                <p className="text-sm text-gray-700">
                  Prepare multiple dishes with the same base masala support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Small Restaurants & Dhabas
                </h4>
                <p className="text-sm text-gray-700">
                  Maintain your signature taste even when helpers are cooking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Canteens, Hostels & Institutions
                </h4>
                <p className="text-sm text-gray-700">
                  Prepare large batches with reliable flavour.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Distributors & Retailers
                </h4>
                <p className="text-sm text-gray-700">
                  Interested in becoming a distributor or stocking EZ Masala in
                  your retail outlet? We welcome partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUGGESTED USAGE PATTERNS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Suggested Usage Patterns
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Business Type
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Meals Per Day
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Suggested Pack Size
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Small tiffin service
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    20–50 meals
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    500 g pack
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Medium tiffin / cloud kitchen
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    50–150 meals
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    1 kg or bulk pack
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Small restaurant / dhaba
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    50–100 meals
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    1 kg or bulk pack
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Canteen / hostel
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    150+ meals
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    Bulk pack (custom discussion)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600 italic mt-6">
            These are rough estimates. The actual quantity depends on the type of
            dishes you prepare and how strong you keep the flavour.
          </p>
        </div>

        {/* BULK PACK OPTIONS */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Bulk Pack Options
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            We offer larger pack sizes for regular business use. These are not
            always listed on the main website, so if you need:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span className="text-gray-700">
                1 kg, 2 kg or larger bulk packs
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span className="text-gray-700">Regular monthly supply</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span className="text-gray-700">
                Custom pricing or packaging for recurring orders
              </span>
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            Please fill the form below or contact us directly via phone / email.
          </p>
        </div>

        {/* DISTRIBUTOR INFORMATION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Distributor & Retail Partnership
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            We are open to working with distributors, wholesalers and retail
            partners who are interested in stocking EZ Masala in their regions.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            If you operate a grocery store, supermarket chain, kirana network or
            distribution channel, you can contact us through the form below.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We will discuss territory, pricing, minimum order quantity (MOQ) and
            support material.
          </p>
        </div>

        {/* ENQUIRY FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Bulk & HoReCa Enquiry Form
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Fill out this form and our team will respond with further details and
            pricing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Your business or restaurant name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                <option value="">Select business type</option>
                <option value="tiffin-service">Tiffin Service</option>
                <option value="cloud-kitchen">Cloud Kitchen</option>
                <option value="restaurant">Restaurant / Dhaba</option>
                <option value="canteen">Canteen / Hostel</option>
                <option value="distributor">Distributor / Wholesaler</option>
                <option value="retailer">Retailer / Store</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City & State
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Approximate Meals Per Day
                </label>
                <input
                  type="text"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="e.g., 50-100"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interested Variant
                </label>
                <select
                  value={interestedVariant}
                  onChange={(e) => setInterestedVariant(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="">Select variant</option>
                  <option value="masala-j">EZ Masala J (North Indian)</option>
                  <option value="masala-m">EZ Masala M (South Indian)</option>
                  <option value="both">Both Variants</option>
                  <option value="not-sure">Not Sure Yet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pack Size Needed
                </label>
                <select
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="">Select pack size</option>
                  <option value="500g">500 g</option>
                  <option value="1kg">1 kg</option>
                  <option value="2kg">2 kg</option>
                  <option value="custom">Custom / Larger</option>
                  <option value="discuss">Need to Discuss</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Message / Requirements
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Please describe your requirements, expected monthly quantity, or any other details..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? "Sending..." : "Submit Enquiry"}
            </button>
          </form>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Our team will review your enquiry and contact
              you during working hours (Mon – Sat, 10:00 AM to 6:00 PM IST) with
              pricing, pack options and delivery details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
