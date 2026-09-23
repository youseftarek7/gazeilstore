/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CartItem } from "../types";
import { X, Trash2, ShoppingBasket, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ar";
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-dark-blue/50 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer container panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <ShoppingBag className="w-5 h-5 text-medical-teal" />
              </span>
              <div>
                <h3 className="font-display font-black text-xl text-dark-blue">
                  Your Order Cart
                </h3>
                <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                  {cartItems.length} pending items
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-24 opacity-60 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-4 animate-pulse">
                  <ShoppingBasket className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="font-display font-bold text-lg text-dark-blue">
                  Your cart is empty
                </h4>
                <p className="text-slate-400 text-xs mt-1.5 max-w-xs leading-relaxed">
                  Browse academic years, premium clinical gear, and complete your checklist.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4.5 bg-slate-50/60 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all"
                >
                  <img
                    src={item.product.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"}
                    alt={item.product.name || "Ghazal Dental"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("unsplash")) {
                        target.src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80";
                      }
                    }}
                    className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-100 p-1"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-display font-bold text-xs text-dark-blue truncate">
                      {item.product.name || "Clinical Dental Product"}
                    </h5>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{item.product.code}</p>
                    
                    {/* Price and Quantities controllers */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-medical-teal font-extrabold text-sm" dir="ltr">
                        {`${(item.product.price * item.quantity).toFixed(2)} EGP`}
                      </span>
                      
                      {/* Inner selector */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 select-none">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs font-display text-dark-blue">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-rose-400 hover:text-rose-600 self-start p-1.5 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Calculations */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-sans">
                  Subtotal Amount
                </span>
                <span className="text-medical-teal font-extrabold text-2xl tracking-tight" dir="ltr">
                  {`${total.toFixed(2)} EGP`}
                </span>
              </div>
              
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed text-center">
                Tax and shipping calculated during confirmation. Direct delivery is available.
              </p>

              <button
                onClick={onCheckout}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <div className="p-1 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-black text-white px-1">WA</span>
                </div>
                <span>Order via WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
