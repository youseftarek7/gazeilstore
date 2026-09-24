import React, { useEffect, useState } from "react";
import { X, Star, ShoppingCart, Check, PackageOpen } from "lucide-react";
import { useStorefront, useCart } from "../../context";
import { generateProductSchema } from "../../utils/seo";
import { SEO } from "../common/SEO";

export default function ProductDetailsModal() {
  const { selectedProduct, isDetailsOpen, openProductDetails } = useStorefront();
  const { addToCart, setIsCartOpen } = useCart();

  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const images = selectedProduct?.images?.length ? selectedProduct.images : selectedProduct?.image ? [selectedProduct.image] : [];
  const [activeImage, setActiveImage] = useState(images[0] || "");

  useEffect(() => {
    if (selectedProduct) {
      const imgs = selectedProduct.images?.length ? selectedProduct.images : [selectedProduct.image];
      setActiveImage(imgs[0] || "");
      setQty(1);
    }
  }, [selectedProduct?.id]);

  if (!isDetailsOpen || !selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, qty);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
      openProductDetails(null);
      setIsCartOpen(true);
    }, 1200);
  };

  const schema = generateProductSchema(selectedProduct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="ltr">
      <SEO 
        title={`${selectedProduct.name} | Ghazal Dental`}
        description={selectedProduct.description}
        image={images[0]}
        url={`https://ghazaldental.com/?product=${(selectedProduct as any).firestoreId || selectedProduct.id}`}
        type="product"
        schema={schema}
      />

      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm" onClick={() => openProductDetails(null)}></div>

      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[90dvh]">
        {/* Close Button */}
        <button
          onClick={() => openProductDetails(null)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 text-slate-700 rounded-full border border-slate-100 transition-all cursor-pointer z-20 shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center relative min-h-[240px] md:min-h-full border-r border-slate-100">
          <img
            src={activeImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"}
            alt={selectedProduct.name || "Ghazal Dental"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("unsplash")) {
                target.src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80";
              }
            }}
            className="w-full h-full object-contain p-6"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex max-w-[70%] gap-2 overflow-x-auto rounded-2xl bg-white/80 p-2 backdrop-blur">
              {images.map((image) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(image)}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === image ? "border-medical-teal" : "border-white"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          {selectedProduct.tag && (
            <span className="absolute bottom-4 left-4 bg-medical-teal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {selectedProduct.tag}
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 mb-2 uppercase">
              <span>{selectedProduct.code}</span>
              <span className="text-slate-200">|</span>
              <span>{selectedProduct.categoryKey}</span>
            </div>

            <h3 className="font-display font-black text-2xl text-dark-blue mb-1 leading-tight">
              {selectedProduct.name || "Clinical Dental Product"}
            </h3>

            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700 ml-1">{selectedProduct.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-sans">
                {selectedProduct.reviewsCount} verified reviews
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">
                  Official Item Price
                </span>
                <span className="text-2xl font-black text-medical-teal font-sans">
                  {`${selectedProduct.price.toFixed(2)} EGP`}
                </span>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  selectedProduct.inStock
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {selectedProduct.description || selectedProduct.arabicDescription || "Certified university dental supplies and clinical grade materials for dentistry students and clinics."}
            </p>

            {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <PackageOpen className="w-4 h-4 text-champagne-gold" />
                  <span>Technical Specs</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedProduct.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-medical-teal font-bold select-none">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProduct.detailSections && selectedProduct.detailSections.length > 0 && (
              <div className="space-y-4">
                {selectedProduct.detailSections.map((section, index) => (
                  <div key={`${section.title}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    {section.image && <img src={section.image} alt={section.title} className="mb-3 h-32 w-full rounded-xl object-contain mix-blend-multiply bg-white border border-slate-100 p-2" />}
                    <h4 className="text-sm font-black text-dark-blue">{section.title}</h4>
                    {section.body && <p className="mt-1 text-xs leading-relaxed text-slate-600">{section.body}</p>}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        {section.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-2">
                            <span className="text-medical-teal">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            {addedMessage ? (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 text-sm font-semibold text-center flex items-center justify-center gap-2 animate-pulse">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Successfully Added to Cart!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 select-none">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/50 transition-colors active:scale-95 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-display font-bold text-sm text-dark-blue">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/50 transition-colors active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className={`flex-1 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedProduct.inStock
                      ? "bg-medical-teal hover:bg-medical-light text-white shadow-md active:scale-98"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Order Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
