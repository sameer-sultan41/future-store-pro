"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { DeleteIcon } from "@/shared/components/icons/svgIcons";
import { TWishlistItem } from "@/shared/types/wishlist";
import { removeFromWishlist } from "@/store/wishlist";
import { add } from "@/store/shoppingCart";
import { TCartItemData } from "@/shared/types/shoppingCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type TProps = {
  data: TWishlistItem;
  onLinkClicked: () => void;
};

const WishlistItem = ({ data, onLinkClicked }: TProps) => {
  const { productName, productId, imgUrl, price, dealPrice = 0 } = data;

  const dispatch = useDispatch();
  const router = useRouter();

  const currentPrice = dealPrice === 0 ? price : dealPrice;

  const handleGoToPage = () => {
    router.push("/product/" + productId);
    onLinkClicked();
  };

  const handleAddToCart = () => {
    const cartItem: TCartItemData = {
      productId,
      productName,
      imgUrl,
      price,
      dealPrice,
      quantity: 1,
    };
    dispatch(add(cartItem));
  };

  return (
    <div className="flex md:flex-row flex-col mt-5 mx-7 pb-5 justify-between gap-4 border-b border-gray-200">
      <div className={"w-[120px] h-[110px] relative cursor-pointer"} onClick={handleGoToPage}>
        <Image
          src={imgUrl}
          fill
          alt={productName}
          className="rounded-lg overflow-hidden border border-gray-200 object-contain"
        />
      </div>
      <div className={"flex flex-grow flex-col"}>
        <h2 className={"mb-3 text-sm text-gray-600 md:mb-6 cursor-pointer"} onClick={handleGoToPage}>
          {productName}
        </h2>
        <div className={"flex items-center justify-start"}>
          <span className="text-lg text-gray-700">
            {currentPrice.toLocaleString("en-us", {
              minimumFractionDigits: 2,
            })}{" "}
            €
          </span>
          {dealPrice > 0 && (
            <span className="text-sm text-gray-400 line-through ml-3">
              {price.toLocaleString("en-us", {
                maximumFractionDigits: 2,
              })}{" "}
              €
            </span>
          )}
        </div>
        <div className={"flex justify-between items-center mt-3 gap-2"}>
          <Button onClick={handleAddToCart} className="flex-1 h-9 text-xs">
            <ShoppingCart width={14} className="mr-1" />
            Add to Cart
          </Button>
          <button
            onClick={() => dispatch(removeFromWishlist(productId))}
            className="size-9 cursor-pointer rounded-md flex items-center justify-center transition-all duration-300 border border-white hover:border-gray-200 hover:bg-gray-100 active:border-gray-300 active:bg-gray-200"
          >
            <DeleteIcon width={16} className="stroke-gray-400 fill-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
