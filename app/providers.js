"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/authContet/authContext";
import { CartProvider } from "@/authContet/CartContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}