import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";



import { loadState, saveState } from "./storeLocalStorage";
import { TCartItemData } from "@/shared/types/shoppingCart";
import wishlistReducer from "./wishlist";

export type TCartState = {
  items: TCartItemData[];
  isVisible: boolean;
};

type QuantityChange = {
  productId: string;
  amount: number;
};

const initialState: TCartState = { isVisible: false, items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state: TCartState, action: PayloadAction<TCartItemData>) => {
      const isAvailable = state.items.findIndex((item) => item.productId === action.payload.productId);
      if (isAvailable > -1) {
        state.items[isAvailable].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.isVisible = true;
    },
    toggleCart: (state: TCartState, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload.valueOf();
    },
    remove: (state: TCartState, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    modifyQuantity: (state: TCartState, action: PayloadAction<QuantityChange>) => {
      state.items.map((item) =>
        item.productId === action.payload.productId ? (item.quantity += action.payload.amount) : ""
      );
    },
  },
});

export const shoppingCartStore = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    wishlist: wishlistReducer,
  },
  preloadedState: loadState(),
});
shoppingCartStore.subscribe(() => {
  saveState(shoppingCartStore.getState());
});

export type RootState = ReturnType<typeof shoppingCartStore.getState>;
export type AppDispatch = typeof shoppingCartStore.dispatch;

export const { add, remove, modifyQuantity, toggleCart } = cartSlice.actions;
