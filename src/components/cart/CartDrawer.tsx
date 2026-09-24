import React from "react";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart, useStorefront } from "../../context";

export default function CartDrawer() {
  const { cart, totalCount, totalAmount, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { setIsCheckoutOpen } = useStorefront();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" dir="ltr">
      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-medical-teal/10 text-medical-teal flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display font-black text-lg text-dark-blue">Order Cart</h3>
                <p className="text-xs text-slate-400 font-sans">{totalCount} items selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-3 opacity-80">🛒</span>
                <h4 className="font-display font-bold text-base text-dark-blue">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Add university kits, files, or dental materials to place your order directly.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl"
                >
                  <img
                    src={item.product.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=100&auto=format&fit=crop&q=80"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-display font-bold text-xs text-dark-blue truncate" title={item.product.name}>
                      {item.product.name}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{item.product.code}</p>
                    <p className="text-xs font-black text-medical-teal mt-1">
                      {(item.product.price * item.quantity).toFixed(2)} EGP
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-dark-blue">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span>Subtotal ({totalCount} items)</span>
                  <span>{totalAmount.toFixed(2)} EGP</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-dark-blue pt-2 border-t border-slate-200/60">
                  <span>Total Due</span>
                  <span className="text-lg text-medical-teal font-sans">{totalAmount.toFixed(2)} EGP</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full h-12 bg-medical-teal hover:bg-medical-light text-white font-bold text-sm rounded-xl shadow-lg shadow-medical-teal/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
