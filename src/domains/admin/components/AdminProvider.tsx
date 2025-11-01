"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { shoppingCartStore } from "@/store/shoppingCart";

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={shoppingCartStore}>
        {children}
      </Provider>
    </ThemeProvider>
  );
}

