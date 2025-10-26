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
        <div className="mb-5 text-sm">
          <span className="text-white rounded-sm bg-future-red-500 px-3 py-1">
            {`
            Save
            ${getConvertedPrice(currency, price - dealPrice).toLocaleString("en-us", {
              minimumIntegerDigits: 2,
              minimumFractionDigits: 2,
            })} ${currencySymbol}
            `}
          </span>
          <span className="mt-[10px] block text-gray-800">
            Was{" "}
            {getConvertedPrice(currency, price).toLocaleString("en-us", {
              minimumIntegerDigits: 2,
              minimumFractionDigits: 2,
            })}{" "}
            {currencySymbol}
          </span>
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
