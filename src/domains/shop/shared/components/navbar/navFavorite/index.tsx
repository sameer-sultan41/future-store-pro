"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import WishlistSidebar from "@/domains/shop/wishlist/components/wishlistSidebar";
import { RootState, TWishlistState } from "@/store/shoppingCart";
import { toggleWishlistVisibility } from "@/store/wishlist";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBarFavorite = () => {
  const dispatch = useDispatch();
  const [wishlistData, setWishlistData] = useState<TWishlistState>();
  const localWishlistData = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    if (localWishlistData) {
      setWishlistData(localWishlistData);
    }
  }, [localWishlistData]);

  const wishlistItemsCount = wishlistData?.items.length || 0;

  const handleWishlistVisibility = (visibility: boolean) => {
    dispatch(toggleWishlistVisibility(visibility));
    if (visibility) {
      document.documentElement.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
    }
  };

  return (
    <div className="flex items-center relative stroke-gray-500 hover:stroke-gray-800 cursor-pointer">
      <div onClick={() => handleWishlistVisibility(true)} className="border-none relative">
        <Heart width={20} className="fill-white transition-all duration-200 stroke-inherit" />

        <span
          className={cn(
            "absolute -top-2 -right-4 text-sm size-6 leading-6  text-center rounded-full",
            wishlistItemsCount ? "text-white bg-red-500" : "text-gray-500 bg-gray-300"
          )}
        >
          {wishlistItemsCount}
        </span>
      </div>
      <WishlistSidebar
        isVisible={wishlistData ? wishlistData.isVisible : false}
        quantity={wishlistItemsCount}
        handleOnClose={() => handleWishlistVisibility(false)}
      />
    </div>
  );
};

export default NavBarFavorite;
