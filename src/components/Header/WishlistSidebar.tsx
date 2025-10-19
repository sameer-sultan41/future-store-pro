"use client";

import { useSelector } from "react-redux";

import { CloseIcon } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils/styling";
import { RootState } from "@/store/shoppingCart";
import { Heart } from "lucide-react";

import WishlistItem from "../../domains/shop/wishlist/components/wishlistSidebar/_components/wishlistItem";

type TProps = {
  isVisible: boolean;
  quantity?: number;
  handleOnClose: () => void;
};

const WishlistSidebar = ({ isVisible, quantity, handleOnClose }: TProps) => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[50] transition-all duration-300 cursor-default",
        isVisible ? "visible opacity-100" : "invisible opacity-0"
      )}
    >
      <div className="absolute inset-0 sm:bg-black/60 bg-black/40 cursor-pointer" onClick={handleOnClose} />
      <div
        className={cn(
          "absolute top-0 bottom-0 right-0 sm:w-[400px] w-5/6 bg-white flex flex-col pb-[100px] transition-transform duration-500 easeOutCustom",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between py-3 border-b border-gray-300 mx-6">
          <h2 className="text-gray-800 text-xl font-light">Wishlist ({quantity})</h2>
          <Button onClick={handleOnClose} className="p-2 size-11 border-white hover:border-gray-300">
            <CloseIcon width={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {wishlistItems && wishlistItems.length > 0 ? (
            wishlistItems.map((item) => <WishlistItem data={item} onLinkClicked={handleOnClose} key={item.productId} />)
          ) : (
            <div className="flex flex-col items-center">
              <div className="mt-20 mb-16 p-6 bg-gray-100 rounded-full">
                <Heart width={36} className="fill-gray-500 stroke-gray-500" />
              </div>
              <span className="text-center text-gray-500">Wishlist is Empty.</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-white border-t border-gray-300 flex flex-col items-center justify-center gap-4 mx-6">
          <Button
            onClick={handleOnClose}
            className="text-gray-500 text-sm w-4/5 border-gray-300 bg-gray-100 hover:border-gray-400 hover:bg-gray-200 active:border-gray-500 active:bg-gray-300"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistSidebar;
