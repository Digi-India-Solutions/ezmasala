'use client';

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, updateQuantity, removeFromCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface ProductCardProps {
  product: any;
  onCartOpen?: () => void;
}

export default function ProductCard({ product, onCartOpen }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [availableIcons, setAvailableIcons] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      const data = await api.get('/icons');
      setAvailableIcons(data.filter((ic: any) => ic.isActive));
    } catch (error) {
      console.error("Failed to fetch icons:", error);
    }
  };

  const productId = product._id || product.id;
  const rating = product.ratings || product.rating || 0;

  const cartItem = items.find((item) => item.id === productId);
  const isInCart = !!cartItem;
  const isInWishlist = wishlistItems.some((item) => item.productId === productId);

  const hasDiscount =
    product.originalPrice &&
    product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const selectedIcons = availableIcons.filter((ic) =>
    product?.icons?.includes(ic.id)
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productId,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    );
    toast.success("Added to cart!");
    onCartOpen?.();
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      dispatch(updateQuantity({ id: productId, quantity: cartItem.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        dispatch(removeFromCart(productId));
        toast.success("Removed from cart");
      } else {
        dispatch(updateQuantity({ id: productId, quantity: cartItem.quantity - 1 }));
      }
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${productId}`);
        dispatch(removeFromWishlist(productId));
        toast.success("Removed from wishlist");
      } else {
        await api.post('/wishlist/add', { productId });
        dispatch(addToWishlist({
          productId,
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="aspect-square relative bg-gray-100 overflow-hidden group">
        <Link href={`/product/${productId}`}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2 transition-transform bg-transparent duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-200 z-10 ${
            isInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
          } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {wishlistLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white w-12 h-12 rounded-full flex flex-col items-center justify-center text-[10px] font-bold shadow-lg">
            {discountPercent}%<br />OFF
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Title */}
        <div className="h-14 overflow-hidden">
          <Link href={`/product/${productId}`}>
            <h3 className="font-montserrat font-semibold text-lg text-black line-clamp-2 hover:underline cursor-pointer">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? "text-black" : "text-gray-300"
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-gray-600 ml-1 font-medium">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-black">₹{product.price}</span>

          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Cart Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="w-full">
            {!isInCart ? (
              <button
                onClick={handleAddToCart}
                className="w-full h-[44px] cursor-pointer rounded-3xl border-2 border-black bg-white hover:bg-black hover:text-white transition font-semibold"
              >
                Add to Cart
              </button>
            ) : (
              <div className="w-full h-[44px] rounded-xl border-2 border-black bg-white flex items-center justify-between">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-4 h-full flex items-center justify-center rounded-l-lg text-black hover:bg-black hover:text-white font-bold transition"
                >
                  -
                </button>

                <span className="px-4 h-full flex items-center justify-center text-black font-semibold min-w-10 text-center">
                  {cartItem?.quantity}
                </span>

                <button
                  onClick={handleIncreaseQuantity}
                  className="px-4 h-full flex items-center justify-center rounded-r-lg text-black hover:bg-black hover:text-white font-bold transition"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Icons */}
          {selectedIcons.length > 0 && (
            <div className="flex items-center justify-between mt-1 px-2">
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

                    <div
                      className="
                        absolute left-1/2 -bottom-1 -translate-x-1/2
                        w-0 h-0 border-l-4 border-r-4 border-t-4
                        border-l-transparent border-r-transparent border-t-black
                      "
                    />
                  </div>

                  {/* Icon */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img
                      src={ic.icon}
                      alt={ic.label}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
