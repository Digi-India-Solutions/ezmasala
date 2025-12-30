"use client";

import { useRef, useState, useEffect } from "react";

const customerReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    text: "The turmeric powder is so fresh and aromatic! It has completely transformed my cooking. Highly recommend EZ Masala.",
    spiceImage: "/spice/1.jpg"
  },
  {
    id: 2,
    name: "Rahul Mehta",
    rating: 5,
    text: "Best garam masala I've ever used. The blend is perfect and the quality is exceptional. Will definitely order again!",
    spiceImage: "/spice/2.jpg"
  },
  {
    id: 3,
    name: "Anjali Desai",
    rating: 5,
    text: "Absolutely love the red chili powder! Perfect masala level and authentic taste. EZ Masala never disappoints.",
    spiceImage: "/spice/3.jpg"
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 5,
    text: "The coriander powder is incredibly fresh. You can tell the difference in quality immediately. Great product!",
    spiceImage: "/spice/4.jpg"
  },
  {
    id: 5,
    name: "Meera Patel",
    rating: 5,
    text: "Amazing quality and authentic flavors! The packaging is also great and keeps the masalas fresh. Very satisfied!",
    spiceImage: "/spice/5.jpg"
  },
  {
    id: 6,
    name: "Arjun Reddy",
    rating: 5,
    text: "EZ Masala has become my go-to brand for all masalas. The quality is consistent and the prices are reasonable.",
    spiceImage: "/spice/6.jpg"
  }
];

export default function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setMaxScroll(el.scrollWidth - el.clientWidth);
      setScrollPosition(el.scrollLeft);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector<HTMLDivElement>(".review-card");
    if (!card) return;

    const cardWidth = card.offsetWidth + 24;
    const newScroll =
      dir === "left"
        ? scrollRef.current.scrollLeft - cardWidth
        : scrollRef.current.scrollLeft + cardWidth;

    scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-montserrat font-bold tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-full inline-block mb-4">
            CUSTOMER REVIEWS
          </span>
          <h2 className="text-4xl text-black font-lora font-black mb-4">
            Let Customers Speak For Us
          </h2>
        </div>

        <div className="max-w-[960px] mx-auto">

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-6 scrollbar-hide"
            onWheel={(e) => {
              if (!scrollRef.current) return;
              scrollRef.current.scrollLeft += e.deltaY;
            }}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="review-card flex-shrink-0 w-[300px] bg-white rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col items-center text-center"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-4 italic leading-relaxed">
                  "{review.text}"
                </p>

                <div className="flex flex-col items-center pt-4 border-t border-gray-200">
                  <div className="w-14 h-14 mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://i.pinimg.com/736x/c2/a4/2c/c2a42cbf7c030126c548cabdef597adf.jpg"
                      alt="Product"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="font-bold text-black">{review.name}</p>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={() => scroll("left")}
              disabled={scrollPosition <= 0}
              className={`rounded-full p-3 shadow-lg cursor-pointer transition ${scrollPosition <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={scrollPosition >= maxScroll - 10}
              className={`rounded-full p-3 shadow-lg cursor-pointer transition ${scrollPosition >= maxScroll - 10
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
