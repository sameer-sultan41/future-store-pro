import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TWishlistItem } from "@/shared/types/wishlist";

export type TWishlistState = {
  items: TWishlistItem[];
};

const initialState: TWishlistState = { items: [] };

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
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
