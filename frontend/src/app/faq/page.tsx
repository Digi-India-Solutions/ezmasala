"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import React from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What exactly is EZ Masala?",
    answer: (
      <>
        <p className="mb-4">
          EZ Masala is a ready cooking support, not just a dry masala powder and not a ready-to-eat curry. It works as a flavour base for your dishes so that you can cook dal, gravies and curries with less confusion and more consistency.
        </p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li><strong>EZ Masala J</strong> – North Indian style support</li>
          <li><strong>EZ Masala M</strong> – South Indian style support</li>
        </ul>
        <p>You still control oil, water, main ingredients and final taste.</p>
      </>
    ),
  },
  {
    question: "Is EZ Masala only for experts or can beginners also use it?",
    answer: (
      <>
        <p className="mb-4">
          Beginners can use EZ Masala very comfortably.
        </p>
        <p className="mb-4">The basic steps are simple:</p>
        <ol className="list-decimal ml-6 mb-4 space-y-2">
          <li>Heat oil or ghee.</li>
          <li>Add EZ Masala (J or M) and sauté lightly.</li>
          <li>Add water + your main ingredients (dal, vegetables, paneer, etc.) and cook.</li>
        </ol>
        <p>All packs carry easy printed guidance, so even a first-time cook can follow.</p>
      </>
    ),
  },
  {
    question: "Is EZ Masala ready-to-eat?",
    answer: (
      <>
        <p className="mb-4">
          <strong>No.</strong> EZ Masala is not a ready-to-eat product.
        </p>
        <p className="mb-4">
          It is a support base to help you cook your food faster and better. You must still add:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Dal, vegetables, pulses, paneer or other main ingredients</li>
          <li>Water and salt</li>
          <li>Optional extras like coriander, chilli, lemon, etc.</li>
        </ul>
      </>
    ),
  },
  {
    question: "What is the difference between EZ Masala J and EZ Masala M?",
    answer: (
      <>
        <ul className="list-disc ml-6 space-y-3">
          <li>
            <strong>EZ Masala J</strong> is designed for North Indian style dishes such as dal tadka, rajma, chole, paneer gravies and everyday sabzis.
          </li>
          <li>
            <strong>EZ Masala M</strong> is designed for South Indian style dishes such as sambar, rasam, South Indian dal and vegetable curries that go with idli, dosa, vada and rice.
          </li>
        </ul>
        <p className="mt-4">Both follow the same simple usage logic, but the flavour profile is different.</p>
      </>
    ),
  },
  {
    question: "How do I know how much EZ Masala to use?",
    answer: (
      <>
        <p className="mb-4">
          Start with a small quantity and adjust over time:
        </p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>For home cooking, start with 1–2 spoons for a family-sized portion.</li>
          <li>Taste the final dish and note whether you want more or less next time.</li>
        </ul>
        <p className="mb-2">Masala level and flavour strength depend on:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Your personal taste</li>
          <li>The quantity of dish you are cooking</li>
          <li>Whether you like mild or strong flavours</li>
        </ul>
      </>
    ),
  },
  {
    question: "Do I still need to add salt?",
    answer: (
      <>
        <p className="mb-4"><strong>Yes.</strong></p>
        <p>EZ Masala supports flavour, but salt should be added separately as per your taste and health preference.</p>
      </>
    ),
  },
  {
    question: "Can I add my own favourite ingredients with EZ Masala?",
    answer: (
      <>
        <p className="mb-4"><strong>Absolutely.</strong></p>
        <p className="mb-4">
          EZ Masala is meant to support your cooking, not restrict it. You can freely add:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Ginger, garlic, onion (if you use them)</li>
          <li>Fresh coriander, green chillies</li>
          <li>Lemon, cream, butter, coconut, etc.</li>
        </ul>
        <p className="mt-4">You can create your own signature dishes using EZ Masala as a base.</p>
      </>
    ),
  },
  {
    question: "Is EZ Masala suitable for daily home use?",
    answer: (
      <>
        <p className="mb-4">
          <strong>Yes,</strong> it is made especially for daily home use as well as small commercial kitchens. It helps:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Save time on busy days</li>
          <li>Maintain a more consistent taste in daily dishes</li>
          <li>Reduce confusion over "how much masala to add"</li>
        </ul>
        <p className="mt-4">You can choose the pack size based on your frequency of cooking.</p>
      </>
    ),
  },
  {
    question: "Can EZ Masala be used in restaurants, tiffin services and cloud kitchens?",
    answer: (
      <>
        <p className="mb-4"><strong>Yes.</strong></p>
        <p className="mb-4">
          Many aspects of EZ Masala are useful for HoReCa and tiffin services:
        </p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>Standardised base for repeated batches</li>
          <li>Easier training for new staff or helpers</li>
          <li>Less dependence on one expert cook</li>
        </ul>
        <p>For larger or recurring requirements, you can fill the form on our Bulk & HoReCa page.</p>
      </>
    ),
  },
  {
    question: "How should I store EZ Masala?",
    answer: (
      <>
        <ul className="list-disc ml-6 space-y-2">
          <li>Keep the pack in a cool, dry place, away from direct sunlight and moisture.</li>
          <li>Ensure the pouch/container is tightly closed after each use.</li>
          <li>Use a clean, dry spoon every time you take out the masala.</li>
        </ul>
      </>
    ),
  },
  {
    question: "How long does one pack last?",
    answer: (
      <>
        <p className="mb-4">This depends on:</p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>How often you cook</li>
          <li>How much masala you use per dish</li>
          <li>The size of your family or kitchen</li>
        </ul>
        <p className="mb-2">As a rough idea:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>125 g packs are good for trial and light use.</li>
          <li>250 g packs suit regular family cooking.</li>
          <li>500 g packs are better for large families, tiffin services or small restaurants.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Do you deliver EZ Masala all over India?",
    answer: (
      <>
        <p className="mb-4">
          We aim to cover as many locations as possible through our online and logistics partners.
        </p>
        <p className="mb-4">
          During checkout, you can enter your pin code and check if delivery is available for your area.
        </p>
        <p>
          For bulk or distributor inquiries in specific regions, you can contact us through the Bulk & HoReCa page or the Contact page.
        </p>
      </>
    ),
  },
  {
    question: "Can I return or exchange the product?",
    answer: (
      <>
        <p className="mb-4">
          Food products are normally subject to strict return policies.
        </p>
        <p>
          Our exact return / replacement / damage policy will be mentioned on the checkout and policy pages of the website, as per current regulations and courier conditions.
        </p>
      </>
    ),
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Breadcrumb items={[{ label: "FAQ" }]} />

        {/* PAGE HEADING */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answers to common questions about EZ Masala, usage and suitability.
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  Q{index + 1}. {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-[2000px]" : "max-h-0"
                }`}
              >
                <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CLOSING CTA */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Didn't find your question here?
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            You can reach us directly through our Contact page or WhatsApp / email.
            <br />
            We are happy to guide you on how to use EZ Masala in your kitchen.
          </p>
          <Link href="/contact">
            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
              Contact Us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
