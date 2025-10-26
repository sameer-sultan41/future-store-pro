"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import AddToCartButton from "@/domains/shop/shoppingCard/components/addToCartButton";
import Quantity from "@/domains/shop/shoppingCard/components/quantity";
import { StarIcon, HeartIcon } from "@/shared/components/icons/svgIcons";
import { TProductBoard } from "@/shared/types/product";
import { TCartItem, TCartItemData } from "@/shared/types/shoppingCart";
import { getCurrencyFromCookie } from "@/actions/server";
import { getConvertedPrice } from "@/shared/utils/helper";
import { Currency } from "@/actions/type";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/store/wishlist";
import { TWishlistItem } from "@/shared/types/wishlist";
import { RootState } from "@/store/shoppingCart";

const ProductBoard = ({ boardData }: { boardData: TProductBoard }) => {
  const { name, id, isAvailable, specialFeatures, price, shortDesc, dealPrice, defaultQuantity, imgUrl } = boardData;
  const [quantity, setQuantity] = useState(defaultQuantity > 1 ? defaultQuantity : 1);
  const [currency, setCurrency] = useState<Currency | null>(null);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlistItems.some((item) => item.productId === id);

  // Fetch currency from cookie
  useEffect(() => {
    const getCurrency = async () => {
      const currency = await getCurrencyFromCookie();
      if (currency) {
        setCurrency(currency);
      } else {
        setCurrency(null);
      }
    };
    getCurrency();
  }, []);

  const currencySymbol = currency?.symbol || "€";

  const handleQuantityChange = (isReducing: boolean) => {
    setQuantity((prev) => {
      if (isReducing) {
        return prev > 1 ? prev - 1 : 1;
      }
      return prev + 1;
    });
  };

  const handleToggleWishlist = () => {
    const wishlistItem: TWishlistItem = {
      productId: id,
      productName: name,
      imgUrl: imgUrl,
      price: price,
      dealPrice: dealPrice,
    };
    dispatch(toggleWishlist(wishlistItem));
  };

  const cartItemData: TCartItemData = {
    productId: id,
    productName: name,
    imgUrl: imgUrl,
    price: dealPrice ? dealPrice : price,
    quantity: quantity,
  };
  return (
    <div className="w-full relative flex flex-col">
      <button className="absolute right-0 top-0 border-none p-1 bg-white">
        <motion.div
          className="cursor-pointer"
          whileTap={{ scale: 0.8, rotate: -15 }}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleWishlist();
          }}
        >
          <Heart
            width={22}
            className={`drop-shadow-lg stroke-primary ${isInWishlist ? "fill-primary" : "fill-white"}`}
          />
        </motion.div>
      </button>
      <section className="block w-full">
        <div className="flex items-center gap-0.5">
          <StarIcon width={15} stroke="#856B0F" fill="#FFD643" />
          <StarIcon width={15} stroke="#856B0F" fill="#FFD643" />
          <StarIcon width={15} stroke="#856B0F" fill="#FFD643" />
          <StarIcon width={15} stroke="#856B0F" fill="#FFD643" />
          <StarIcon width={15} stroke="#856B0F" fill="#FFD643" />
          <Link href={"#"} className="ml-4 text-xs text-future-blue-300">
            880 User Reviews
          </Link>
        </div>
      </section>
      <h1 className="block text-2xl leading-9 font-medium my-2.5 mt-8 text-gray-700">{name}</h1>
      <span className="block text-xs text-gray-700 mb-4">{shortDesc}</span>
      <hr className="w-full border-t border-gray-300 mb-5" />
      <div className="flex flex-col gap-3 text-sm text-gray-500 mb-12">
        {specialFeatures && specialFeatures?.map((feature, index) => <span key={index}>{feature}</span>)}
      </div>
      <h2 className="text-3xl font-medium text-gray-800 mb-5">
        {getConvertedPrice(currency, dealPrice ? dealPrice : price).toLocaleString("en-us", {
          minimumIntegerDigits: 2,
          minimumFractionDigits: 2,
        })}{" "}
        {currencySymbol}
      </h2>

      {dealPrice && (
        <div className="mb-5">
          {/* Savings Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-white rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-semibold shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Save{" "}
                {getConvertedPrice(currency, price - dealPrice).toLocaleString("en-us", {
                  minimumIntegerDigits: 2,
                  minimumFractionDigits: 2,
                })}{" "}
                {currencySymbol}
              </span>
            </span>

            {/* Discount Percentage Badge */}
            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
              -{Math.round(((price - dealPrice) / price) * 100)}%
            </span>
          </div>

          {/* Original Price */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Regular price:</span>
            <span className="text-gray-600 line-through decoration-2">
              {getConvertedPrice(currency, price).toLocaleString("en-us", {
                minimumIntegerDigits: 2,
                minimumFractionDigits: 2,
              })}{" "}
              {currencySymbol}
            </span>
          </div>
        </div>
      )}
      <hr className="w-full border-t border-gray-300 mb-5" />

      {/* ----------------- ADD TO CART SECTION ----------------- */}
      <section className="flex items-center w-full">
        <Quantity onChange={handleQuantityChange} quantity={quantity} />
        <AddToCartButton cartItemData={cartItemData} disabled={!isAvailable} />
      </section>
    </div>
  );
};

export default ProductBoard;
