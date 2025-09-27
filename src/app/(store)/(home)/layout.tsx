"use client";
import { Provider } from "react-redux";

import StoreNavBar from "@/app/(store)/(home)/_components/StoreNavBar";
import Warning from "@/domains/store/shared/components/warning";
import { shoppingCartStore } from "@/store/shoppingCart";

import StoreFooter from "./_components/Footer";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-gray-50">
      <Provider store={shoppingCartStore}>
        <StoreNavBar />
        {children}
        <StoreFooter />
        <Warning />
      </Provider>
    </main>
  );
};

export default StoreLayout;
