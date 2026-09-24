import { Product } from "../types";

export function generateProductSchema(product: Product, storeUrl: string = "https://ghazaldental.com") {
  const images = product.images?.length ? product.images : [product.image];
  const productId = (product as any).firestoreId || product.id;
  const productUrl = `${storeUrl}/?product=${productId}`;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description || product.arabicDescription || "",
    "sku": product.code,
    "brand": {
      "@type": "Brand",
      "name": "Ghazal Dental",
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "EGP",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
    },
  };
}
