"use client";

import { useDispatch } from "react-redux";

import { ShoppingIconFill } from "@/shared/components/icons/svgIcons";
import { TCartItemData } from "@/shared/types/shoppingCart";
import { add } from "@/store/shoppingCart";
import { Button } from "@/components/ui/button";

type TProps = {
  disabled: boolean;
  cartItemData: TCartItemData;
};

const AddToCartButton = ({ cartItemData, disabled }: TProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(add({ ...cartItemData }));
    document.documentElement.classList.add("noScroll");
  };

  return (
    <Button disabled={disabled} onClick={() => handleAddToCart()}>
      {disabled ? (
        "not Available"
      ) : (
        <>
          <ShoppingIconFill width={16} className="fill-white" />
          Add to Cart
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
