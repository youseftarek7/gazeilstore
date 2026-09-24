import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { StorefrontProvider, CartProvider, ToastProvider } from "./context";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find root element");

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <StorefrontProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </StorefrontProvider>
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>
);
