# Product Requirements Document (PRD)

## Project Overview

**Project name:** Ghazal Dental Storefront

A modern dental supplies storefront and admin platform for Ghazal Dental. The web app provides a customer-facing e-commerce-like shopping experience for dental instruments, clinical gear, educational supplies, and promotional bundles. It also includes a protected admin area for store staff to manage products, categories, packages, orders, homepage content, and contact settings.

## Objectives

- Enable customers to browse and discover dental products and packages quickly.
- Provide fast product filtering, search, and category navigation.
- Allow customers to build a cart and place an order via phone or WhatsApp.
- Support bilingual content in English and Arabic.
- Give store staff a backend admin interface for catalog and order management.
- Keep the storefront data dynamic through Firebase / Firestore.

## User Personas

- **Dental student**: wants academic tools, lab supplies, scrubs, and kits.
- **Dental professional**: wants clinical instruments, dental care materials, and practice accessories.
- **Store manager**: needs to update products, promotions, homepage content, and contact details.
- **Admin staff**: needs to monitor orders, manage inventory status, and update categories/packages.

## User Stories

### Customer-facing

- As a customer, I want to view featured and best-selling dental products on the homepage.
- As a customer, I want to search by product name, code, description, or tags.
- As a customer, I want to filter products by department/category and subcategory.
- As a customer, I want to read product details, images, specifications, and pricing.
- As a customer, I want to add items to a cart and review quantities before checkout.
- As a customer, I want my cart to persist in my browser even if I refresh.
- As a customer, I want to place an order with contact details and order summary.
- As a customer, I want quick access to store phone and WhatsApp contact.

### Admin

- As an admin, I want to sign in to the admin panel under `/admin`.
- As an admin, I want to view dashboard metrics like total products, orders, sales, and low stock.
- As an admin, I want to search, add, edit, and remove products.
- As an admin, I want to manage categories and subcategories.
- As an admin, I want to manage packages and promotional offers.
- As an admin, I want to manage store contact details and social links.
- As an admin, I want to manage homepage hero, cards, offers, and category section content.
- As an admin, I want to manage developer contact/status information.
- As an admin, I want to update order status from Pending to Confirmed / Shipping / Delivered.

## Features

### Storefront

- Header with brand, menu toggle, search bar, support phone, and cart button.
- Category browser for departments and subcategories.
- Product grid with sorting options (`default`, `price-low`, `price-high`, `rating`).
- Product details modal showing rich information and action controls.
- Cart drawer with item quantity updates and removal.
- Checkout modal for collecting customer order information.
- Special offers / package presentations.
- Homepage split sections and featured destination cards.
- Developer section with contact and support info.

### Admin

- Role-based navigation: Owner, Manager, Employee.
- Dashboard metrics and recent order preview.
- Products page: search, filter, create, edit, delete.
- Categories page: view and manage category metadata.
- Orders page: search orders, update order status.
- Packages page: manage promotional bundles.
- Home page editor: hero content, cards, offers, category section copy.
- Store settings editor: phone, WhatsApp, address, social links.
- Developer settings editor: name, image, title, phone, WhatsApp.
- Firebase-based data sync for products, categories, offers, homepage, settings, developer.

## Data and Integrations

- React + Vite frontend.
- Tailwind CSS for styling.
- Firebase Firestore for dynamic storefront and admin data.
- Firebase Storage for image uploads via admin.
- Local browser storage to persist cart state.
- Environment configuration via `.env` values for Firebase.

## Collections / Data Models

- `products`: catalog items with multilingual fields, pricing, stock, tag, category metadata.
- `categories`: department definitions with Arabic and English names and subcategories.
- `packages`: promotional bundles with pricing, discount, bullets, products.
- `homepage`: hero content, cards, offers titles, section copy and destination cards.
- `settings`: store contact details and social links.
- `developer`: developer / support contact info.
- `orders`: customer orders with products, totals, phone/WhatsApp, university, and status.
- `users`: admin users with `Owner`, `Manager`, `Employee` roles.

## Non-functional Requirements

- Mobile-first responsive layout.
- Fast product search and category browsing.
- Secure admin access and role-based page visibility.
- Graceful fallback to local static data if Firebase is unavailable.
- Reliable cart persistence in browser storage.
- Simple deployment via Vite.

## Assumptions and Constraints

- Admin route is accessible under `/admin`.
- Firebase environment variables must be provided to enable admin data.
- Checkout flow is primarily informational; final order delivery is executed through phone/WhatsApp.
- The application is designed for English first, with Arabic support for product text and labels.

## Success Metrics

- Customers can find products in under 3 clicks.
- Cart items remain available across page refresh.
- Admin users can update catalogs without code changes.
- Orders can be tracked and status updated from the admin panel.
- The homepage content can be managed from the admin UI.

## Next Steps

- Review and validate with stakeholders.
- Add a wireframe or UX flow document if needed.
- Define acceptance criteria for checkout and admin workflows.
- Implement Firebase security rules and admin access controls.
