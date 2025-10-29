"use client";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCart from "@/components/Header/ShoppingCart";
import { ShoppingIconOutline } from "@/shared/components/icons/svgIcons";
import { cn } from "@/shared/utils/styling";
import { TCartState, RootState } from "@/store/shoppingCart";
import { toggleCart } from "@/store/shoppingCart";

const NavBarShopping = () => {
  const dispatch = useDispatch();

  const localCartData: TCartState | undefined = useSelector((state: RootState) => state.cart);

  const cartItemQuantity = localCartData?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const handleCartVisibility = (visibility: boolean) => {
    dispatch(toggleCart(visibility));
    if (visibility) {
      document.documentElement.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
    }
  };

  return (
    <div className="flex items-center relative ml-5  hover:stroke-gray-700 stroke-gray-500 cursor-pointer">
      <div onClick={() => handleCartVisibility(true)} className="border-none relative">
        <ShoppingIconOutline width={24} className="fill-none stroke-inherit transition-all duration-300" />
        <span
          className={cn(
            "absolute -top-2 -right-4 text-sm size-6 leading-6  text-center rounded-full",
            cartItemQuantity ? "text-white bg-red-500" : "text-gray-500 bg-gray-300"
          )}
        >
          {cartItemQuantity}
        </span>
      </div>
      <ShoppingCart
        isVisible={localCartData ? localCartData.isVisible : false}
        quantity={cartItemQuantity}
        handleOnClose={() => handleCartVisibility(false)}
      />
    </div>
  );
};

export default NavBarShopping;
