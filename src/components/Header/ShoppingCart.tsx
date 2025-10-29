"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getCartProducts } from "@/actions/product/product";
import { CloseIcon, ShoppingIconEmpty } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import { TCartListItemDB } from "@/shared/types/product";
import { TCartItemData } from "@/shared/types/shoppingCart";
import { cn } from "@/shared/utils/styling";
import { RootState } from "@/store/shoppingCart";

import CartItem from "../../domains/shop/shoppingCard/components/shoppingCart/_components/cartItem/CartItem";

type TProps = {
  isVisible: boolean;
  quantity?: number;
  handleOnClose: () => void;
};

const ShoppingCart = ({ isVisible, quantity, handleOnClose }: TProps) => {
  const [cartItems, setCartItems] = useState<TCartItemData[]>();
  const localCartItems = useSelector((state: RootState) => state.cart);

  // useEffect(() => {
  //   const convertDBtoCartItems = (rawData: TCartListItemDB[]) => {
  //     const cartListItem: TCartItemData[] = [];

  //     // Create a map for quick lookups by both ID and URL
  //     const productMapById = new Map(rawData.map((item) => [item.id, item]));
  //     const productMapByUrl = new Map(rawData.filter((item: any) => item.url).map((item: any) => [item.url, item]));

  //     // Match each cart item with its product data
  //     localCartItems.items.forEach((cartItem) => {
  //       // Try to find product by ID first, then by URL
  //       const product = productMapById.get(cartItem.productId) || productMapByUrl.get(cartItem.productId);

  //       if (product) {
  //         cartListItem.push({
  //           productId: product.id,
  //           imgUrl: process.env.IMG_URL + product.images[0],
  //           price: product.price,
  //           quantity: cartItem.quantity,
  //           productName: product.name,
  //           dealPrice: product.salePrice || undefined,
  //         });
  //       } else {
  //         console.warn(`Product not found for ID: ${cartItem.productId}`);
  //       }
  //     });

  //     return cartListItem.length > 0 ? cartListItem : null;
  //   };

  //   const getProductsFromDB = async () => {
  //     const productsIDs = localCartItems.items.map((s) => s.productId);

  //     if (productsIDs?.length === 0) {
  //       setCartItems([]);
  //       return;
  //     }

  //     if (productsIDs && productsIDs.length > 0) {
  //       console.log("Fetching products with IDs:", productsIDs);
  //       const response = await getCartProducts(productsIDs);

  //       if (response.error) {
  //         console.error("Error fetching cart products:", response.error);
  //         setCartItems([]);
  //         return;
  //       }

  //       if (response.res) {
  //         console.log("Fetched products:", response.res);
  //         const finalResult = convertDBtoCartItems(response.res);

  //         if (!finalResult) {
  //           console.warn("No items after conversion");
  //           setCartItems([]);
  //           return;
  //         }

  //         setCartItems(finalResult);
  //       }
  //     }
  //   };

  //   if (localCartItems && localCartItems.items) {
  //     getProductsFromDB();
  //   }
  // }, [localCartItems, localCartItems.items]);

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
          "absolute top-0 bottom-0 right-0 sm:w-[400px] w-5/6 bg-white flex flex-col pb-[140px] transition-transform duration-500 easeOutCustom",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between py-3 border-b border-gray-300 mx-6">
          <h2 className="text-gray-800 text-xl font-light">Shopping Cart ({quantity})</h2>
          <Button onClick={handleOnClose} className="p-2 size-11 border-white hover:border-gray-300">
            <CloseIcon width={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {localCartItems && localCartItems.items ? (
            localCartItems.items.map((item) => (
              <CartItem data={item} onLinkClicked={handleOnClose} key={item.productId} />
            ))
          ) : (
            <div className="flex flex-col items-center">
              <div className="mt-20 mb-16 p-6 bg-gray-100 rounded-full">
                <ShoppingIconEmpty width={36} className="fill-gray-500" />
              </div>
              <span className="text-center text-gray-500">Shopping Cart is Empty.</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-white border-t border-gray-300 flex flex-col items-center justify-center gap-4 mx-6">
          {!!cartItems?.length && (
            <Button className="w-4/5 text-sm font-semibold text-green-700 border-green-300 bg-green-50">
              CHECKOUT
            </Button>
          )}
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

export default ShoppingCart;
