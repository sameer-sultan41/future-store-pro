import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TWishlistItem } from "@/shared/types/wishlist";

export type TWishlistState = {
  items: TWishlistItem[];
  isVisible: boolean;
};

const initialState: TWishlistState = { items: [], isVisible: false };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state: TWishlistState, action: PayloadAction<TWishlistItem>) => {
      const isAvailable = state.items.findIndex((item) => item.productId === action.payload.productId);
      if (isAvailable === -1) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state: TWishlistState, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    toggleWishlist: (state: TWishlistState, action: PayloadAction<TWishlistItem>) => {
      const isAvailable = state.items.findIndex((item) => item.productId === action.payload.productId);
      if (isAvailable > -1) {
        state.items = state.items.filter((item) => item.productId !== action.payload.productId);
      } else {
        state.items.push(action.payload);
      }
    },
    toggleWishlistVisibility: (state: TWishlistState, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload.valueOf();
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, toggleWishlistVisibility } = wishlistSlice.actions;
export default wishlistSlice.reducer;
