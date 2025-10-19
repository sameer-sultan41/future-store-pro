"use client";
import { Provider } from "react-redux";
import StoreNavBar from "@/components/Header/StoreNavBar";
import { shoppingCartStore } from "@/store/shoppingCart";

import StoreFooter from "./(home)/_components/Footer";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-gray-50">
      <Provider store={shoppingCartStore}>
        <StoreNavBar />
        {children}
        <StoreFooter />
        {/* <Warning /> */}
      </Provider>
    </main>
  );
};

export default StoreLayout;
