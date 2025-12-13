"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import ImageGallery from "@/components/ImageGallery";
import ProductSkeleton from "@/components/ProductSkeleton";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params.id as string;

  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [reviewUsers, setReviewUsers] = useState<{ [key: string]: any }>({});
  const [descSections, setDescSections] = useState<any[]>([]);
  const [availableIcons, setAvailableIcons] = useState<any[]>([]);
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [reviewScrollPos, setReviewScrollPos] = useState(0);
  const [maxReviewScroll, setMaxReviewScroll] = useState(0);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const isInCart = items.some((item) => item.id === id);
  const isInWishlist = wishlistItems.some((item) => item.productId === id);

  useEffect(() => {
    fetchProduct();
    fetchIcons();
  }, [id]);

  // Fetch product
  const fetchProduct = async () => {
    try {
      const data = await api.get(`/spices/${id}`);
      setProduct(data);
      fetchRecommendedProducts(data.category);

      if (data.reviews?.length > 0) fetchReviewUsers(data.reviews);
    } catch (error) {
      toast.error("Product not found");
      router.push("/collections");
    } finally {
      setLoading(false);
    }
  };

  // Fetch icons
  const fetchIcons = async () => {
    try {
      const data = await api.get("/icons");
      setAvailableIcons(data.filter((ic: any) => ic.isActive));
    } catch (err) {
      console.error("Icon fetch failed:", err);
    }
  };

  // Fetch users for reviews
  const fetchReviewUsers = async (reviews: any[]) => {
    const userIds = [...new Set(reviews.map((r: any) => r.userId))];
    const users: any = {};

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const data = await api.get(`/user/${userId}`);
          users[userId] = data;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      })
    );

    setReviewUsers(users);
  };

  // Fetch recommended products
  const fetchRecommendedProducts = async (categories: string[] = []) => {
    if (!Array.isArray(categories) || categories.length === 0) return;

    try {
      const query = categories
        .map(c => `category=${encodeURIComponent(c)}`)
        .join("&");

      const data = await api.get(`/spices?${query}`);
      setRecommendedProducts(
        data.filter((p: any) => p._id !== id).slice(0, 4)
      );
    } catch (error) {
      console.error("Failed to fetch recommended products:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      router.push(`/login?redirect=/product/${id}`);
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/spices/${id}/reviews`, {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        rating: userRating,
        text: reviewText,
      });

      toast.success("Review submitted!");
      setReviewText("");
      setUserRating(5);
      fetchProduct();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
        })
      );
    }

    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!user) {
      toast.error("Please login to continue");
      router.push(`/login?redirect=/product/${id}`);
      return;
    }

    // Add to cart first
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
        })
      );
    }

    // Redirect to checkout
    router.push("/checkout/address");
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (!product) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${id}`);
        dispatch(removeFromWishlist(id));
        toast.success("Removed from wishlist");
      } else {
        await api.post('/wishlist/add', { productId: id });
        dispatch(addToWishlist({
          productId: id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          stock: product.stock,
          addedAt: new Date().toISOString(),
        }));
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Parse description
  const parseDescription = (desc: string) => {
    if (!desc) return [];
    const rawSections = desc.trim().split(/\n\s*\d+\.\s+/).filter(Boolean);
    const sections: any[] = [];

    rawSections.forEach((block, index) => {
      const lines = block.split("\n").map((l) => l.trim());
      let title = lines.shift() || "";
      title = title.replace(/^\d+\.\s*/, "");
      const body = lines.join("\n");

      sections.push({
        title,
        bullets: body.includes("●")
          ? body.split("●").filter((b) => b.trim())
          : null,
        text: !body.includes("●") ? body : null,
      });
    });

    return sections;
  };

  useEffect(() => {
    if (product?.description) {
      const sections = parseDescription(product.description);
      setDescSections(sections);
      const initialState: { [key: number]: boolean } = {};
      sections.forEach((_, index) => {
        initialState[index] = index === 0; // First section open by default
      });
      setOpenSections(initialState);
    }
  }, [product]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => {
      // If clicking on an already open section, close it
      if (prev[index]) {
        return {
          ...prev,
          [index]: false
        };
      }
      // Otherwise, close all sections and open the clicked one
      const newState: { [key: number]: boolean } = {};
      Object.keys(prev).forEach(key => {
        newState[parseInt(key)] = false;
      });
      newState[index] = true;
      return newState;
    });
  };

  const selectedIcons = availableIcons.filter((ic) =>
    product?.icons?.includes(ic.id)
  );

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) return <ProductSkeleton />;

  if (!product)
    return (
      <div className="py-16 bg-white min-h-screen text-center">
        <p className="text-black text-xl">Product not found</p>
      </div>
    );

  return (
    <div className="py-4 md:py-8 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Collections", href: "/collections" },
            { label: product.title }
          ]}
        />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-4 md:p-8 bg-gray-50">
              <div className="lg:sticky lg:top-12">
                <ImageGallery
                  mainImage={product.image}
                  additionalImages={product.images || []}
                  title={product.title}
                />
              </div>
            </div>

            <div className="p-6 md:p-8 lg:p-12">
              <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {product.category?.join(" • ")}
              </span>

              <h1
                className="
                  mb-5 text-black font-medium font-dm 
                  text-[calc(38px/60*var(--base-headings-size))] 
                  leading-[44.8px]
                  lg:text-[37.33px] lg:h-[89.58px]
                "
              >
                {product.title}
              </h1>


              <div className="flex items-center gap-2 mb-6 font-dm">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${i < Math.floor(product.ratings || 0)
                      ? "text-black"
                      : "text-gray-500"
                      }`}
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}

                <span className="text-xs sm:text-sm lg:text-base text-gray-600">
                  ({(product.ratings || 0).toFixed(1)})
                </span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <p className="font-black text-black font-dm leading-none
    text-3xl sm:text-4xl lg:text-5xl">
                  ₹{product.price}
                </p>

                {hasDiscount && (
                  <div className="flex flex-col justify-between py-1">
                    <span className="
                      bg-red-600 text-white rounded-full font-bold text-center
                      text-[10px] sm:text-xs px-2 py-0.5
                    ">
                      {discountPercent}% OFF
                    </span>

                    <span className="text-[10px] sm:text-xs lg:text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-green-600 font-semibold mb-2 text-xs sm:text-sm lg:text-base font-dm">
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 w-full mt-6">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center text-2xl font-bold"
                  >
                    −
                  </button>

                  <span className="text-2xl font-bold w-10 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-14 h-14 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center text-2xl font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isInCart}
                  className={`py-4 rounded-4xl text-lg font-bold flex-1 min-w-[200px] ${isInCart
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-900"
                    }`}
                >
                  {isInCart ? "Added" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 rounded-4xl font-bold text-lg border border-black text-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isInWishlist
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'border-2 border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500'
                  } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill={isInWishlist ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Description</h2>

                {descSections.map((sec, i) => (
                  <div key={i} className="border rounded-xl mb-3 overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleSection(i)}
                    >
                      <h3 className="font-semibold">
                        {i + 1}. {sec.title}
                      </h3>
                      <button className="text-2xl font-bold text-black">
                        {openSections[i] ? '−' : '+'}
                      </button>
                    </div>

                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{
                        gridTemplateRows: openSections[i] ? '1fr' : '0fr',
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className={`px-4 pb-4 transition-opacity duration-300 ${openSections[i] ? 'opacity-100' : 'opacity-0'}`}>
                          {sec.bullets ? (
                            <ul className="list-disc pl-6 space-y-1">
                              {sec.bullets.map((b: string, idx: number) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="whitespace-pre-line">{sec.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ICONS */}
              {selectedIcons.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-sm font-bold mb-3">Product Features</h3>

                  <div className="flex flex-wrap items-center gap-4">
                    {selectedIcons.map((ic) => (
                      <div
                        key={ic.id}
                        className="relative group flex flex-col items-center cursor-pointer"
                      >
                        {/* Tooltip */}
                        <div className="
                          absolute -top-10 opacity-0 group-hover:opacity-100
                          translate-y-2 group-hover:translate-y-0
                          transition-all duration-200
                          bg-black text-white text-[10px] font-medium
                          px-2.5 py-1 rounded-md pointer-events-none
                          whitespace-nowrap z-20
                        ">
                          {ic.label}

                          <div className="
                            absolute left-1/2 -bottom-1 -translate-x-1/2
                            w-0 h-0 border-l-4 border-r-4 border-t-4
                            border-l-transparent border-r-transparent border-t-black
                          " />
                        </div>

                        {/* Icon */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          <img
                            src={ic.icon}
                            alt={ic.label}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-black mb-6 text-black">Customer Reviews</h2>

          <form onSubmit={handleSubmitReview} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-black">Write a Review</h3>

            <label className="block text-sm font-semibold mb-2 text-black">Rating</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${star <= userRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.571-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <label className="block text-sm font-semibold mb-2 text-black">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
              placeholder="Share your experience..."
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="mt-4 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : user ? "Submit Review" : "Login to Submit Review"}
            </button>
          </form>

          {product.reviews?.filter((r: any) => r.featured).length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6 text-black">Featured Reviews</h3>

              <div className="relative max-w-6xl mx-auto">
                {/* Left Arrow */}
                {reviewScrollPos > 10 && (
                  <button
                    onClick={() => {
                      if (reviewScrollRef.current) {
                        const cardWidth = reviewScrollRef.current.querySelector('.review-card')?.clientWidth || 0;
                        reviewScrollRef.current.scrollTo({
                          left: reviewScrollRef.current.scrollLeft - (cardWidth + 16),
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
                  >
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Reviews Container */}
                <div
                  ref={reviewScrollRef}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    setReviewScrollPos(target.scrollLeft);
                    setMaxReviewScroll(target.scrollWidth - target.clientWidth);
                  }}
                  className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {product.reviews
                    .filter((r: any) => r.featured)
                    .map((review: any, idx: number) => {
                      const reviewer = reviewUsers[review.userId];
                      return (
                        <div
                          key={idx}
                          className="review-card snap-center flex-shrink-0 w-[280px] sm:w-[320px] p-5 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-black transition-all"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-white" fill="currentColor">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 18a7 7 0 1114 0H3z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-black text-sm truncate">
                                {review.userName || (reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "User")}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-black" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.922 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.809l-2.8 2.035a1 1 0 0 0-.364 1.117l1.07 3.293c.3.92-.755 1.688-1.54 1.117l-2.8-2.035a1 1 0 0 0-1.175 0l-2.8 2.035c-.784.571-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.117L2.98 8.72c-.783-.571-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">({review.rating})</span>
                          </div>

                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{review.text}</p>
                        </div>
                      );
                    })}
                </div>

                {/* Right Arrow */}
                {reviewScrollPos < maxReviewScroll - 10 && (
                  <button
                    onClick={() => {
                      if (reviewScrollRef.current) {
                        const cardWidth = reviewScrollRef.current.querySelector('.review-card')?.clientWidth || 0;
                        reviewScrollRef.current.scrollTo({
                          left: reviewScrollRef.current.scrollLeft + (cardWidth + 16),
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
                  >
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-black mb-6 text-black">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((rec) => {
                const recHasDiscount = rec.originalPrice && rec.originalPrice > rec.price;
                const recDiscountPercent = recHasDiscount
                  ? Math.round(((rec.originalPrice - rec.price) / rec.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={rec._id}
                    onClick={() => router.push(`/product/${rec._id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer border border-gray-200 hover:border-black"
                  >
                    <div className="relative h-56 bg-gray-50">
                      <Image
                        src={rec.image}
                        alt={rec.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />

                      {recHasDiscount && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {recDiscountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        {product.category?.join(" • ")}
                      </span>
                      <h3 className="font-bold text-lg mb-2 text-black line-clamp-2">{rec.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(rec.ratings || 0) ? "text-yellow-500" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500">({(rec.ratings || 0).toFixed(1)})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-black text-black">₹{rec.price}</p>
                        {recHasDiscount && (
                          <p className="text-sm text-gray-400 line-through">₹{rec.originalPrice}</p>
                        )}
                      </div>
                      <p className={`text-xs mt-2 font-semibold ${rec.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {rec.stock > 0 ? `${rec.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
