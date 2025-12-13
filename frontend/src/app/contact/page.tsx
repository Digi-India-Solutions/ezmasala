"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

interface ContactInfo {
  companyName: string;
  tagline?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  businessHours: string;
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [queryType, setQueryType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await api.get('/contact-info');
        if (data.success && data.contactInfo) {
          setContactInfo(data.contactInfo);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post("/contacts", { name, email, mobile, city, queryType, message });

      if (data.success) {
        toast.success("Thank you for reaching out. Your message has been received. We will respond at the earliest during working hours.");
        setName("");
        setEmail("");
        setMobile("");
        setCity("");
        setQueryType("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      console.error("Contact form error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fullAddress = contactInfo
    ? `${contactInfo.address}, ${contactInfo.city}-${contactInfo.pincode}`
    : 'B1-236, Naraina Industrial Area, Phase-I, New Delhi-110028';

  return (
    <div className="py-4 md:py-8 text-black bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">

        <Breadcrumb items={[{ label: "Contact & Support" }]} />

        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-black">Contact & Support</h1>
        <p className="text-center text-gray-600 mb-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          Have a question about EZ Masala? We're here to help.
        </p>
        <p className="text-center text-gray-700 mb-8 md:mb-12 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Cooking support samajhne mein agar kabhi bhi confusion ho, ya aapko bulk / HoReCa, distribution ya online orders ke baare mein baat karni ho, aap seedha humse contact kar sakte hain.<br />
          Prefer a quick call or WhatsApp? You're welcome. Prefer email or form? We'll reply there too.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr,1.2fr] gap-8 md:gap-10">
          {/* CONTACT DETAILS CARD */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="font-bold text-xl md:text-2xl mb-6 text-black flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {contactInfo?.companyName || 'Shine Exports (India)'}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">{contactInfo?.tagline || 'Makers of EZ Masala J & EZ Masala M'}</p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email:
                </h4>
                <p className="text-gray-700 ml-7">{contactInfo?.email || 'info@ezmasalaa.com'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone / WhatsApp:
                </h4>
                <p className="text-gray-700 ml-7">{contactInfo?.phone || contactInfo?.whatsapp || '+91-XXXXXXXXXX'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address:
                </h4>
                <p className="text-gray-700 ml-7">{fullAddress}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Business Hours:
                </h4>
                <p className="text-gray-700 ml-7">{contactInfo?.businessHours || 'Mon – Sat, 10:00 AM to 6:00 PM (IST)'}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 mt-6">
                <p className="text-sm text-gray-700 italic">
                  If we are unable to respond immediately, we will get back to you as soon as possible during working hours.
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-black">Write to Us</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Please share your details and query. Our team will get back to you with guidance or next steps.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City & State</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Query Type</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="">Select query type</option>
                  <option value="general">General Question</option>
                  <option value="how-to-use">How to Use EZ Masala</option>
                  <option value="order-delivery">Online Order / Delivery</option>
                  <option value="bulk">Bulk / HoReCa / Distributor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message / Your Question</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="Please describe your query in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? "Sending..." : "Submit Query"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
