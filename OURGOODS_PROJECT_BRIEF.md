# OURGOODS E-Commerce Application

## 📖 Project Overview
**OURGOODS App** is a modern, premium e-commerce platform built with React and Vite. It is designed with a mobile-first approach that perfectly scales to desktop using a standardized app container. The platform encompasses both a fully-featured customer-facing storefront and a comprehensive administrative backend for store management.

## 🚀 Tech Stack
- **Core Framework**: React (v19.2) + Vite
- **Routing**: React Router DOM (v7.18)
- **Styling**: Vanilla CSS (`index.css`) emphasizing custom premium UI, vibrant brand colors (pink/magenta), smooth gradients, and micro-animations.
- **Icons**: Line-Awesome (via CDN/Classnames) & Lucide React.
- **Data Visualization**: Recharts (for admin dashboard analytics).
- **Backend/Services**: Firebase (v12.16) for future backend integration, plus utilities like `tesseract.js` and `browser-image-compression`.

## 🛍️ Customer Storefront Features
The customer-facing app prioritizes a dynamic and high-end aesthetic ("Your Desire, We Deliver"):
- **Multi-Market System**: Dedicated specialized shops like the **Global Shop**, **Ourgoods Pre-Order**, **Factory Direct**, and **Bangladesh Market**.
- **Advanced Filtering**: Sidebar and mobile slide-over filtering by category, price ranges, and sorting (popularity, price, newest).
- **Product Details & SKU System**: Sophisticated product modals allowing users to select complex variations (color, size, storage) with dynamic pricing and discount displays (e.g., strikethrough original prices with savings indicators).
- **Mock Algorithms**: Uses advanced randomization and mock data structures (`MockData.js`) to simulate high-traffic store interactions and top-selling algorithms.

## ⚙️ Admin Dashboard Features
The admin side (accessible via `/admin`) allows comprehensive store management:
- **Product Management**: Highly advanced `AddProduct.jsx` interface featuring tag creation (pill-based UI), variant/SKU management, policy libraries, and rich text organization.
- **Order & Analytics Management**: Dedicated routes for CMS, Shipping, Payments, Marketing, Returns, and deep data analytics using Recharts.

## 🎨 Design Language & Architecture
- **Mobile-First Container**: On desktop, the customer app is constrained within an `.app-container` (typically 480px max-width) mimicking a native mobile app experience, with a soft grey background for contrast.
- **Component Architecture**: 
  - `src/components/` for customer-facing pages and UI elements.
  - `src/admin/` for internal dashboard pages and layouts.
  - `src/context/` for state management (Auth, Cart, Wishlist).
  - `src/utils/` for helper functions and the extensive MockData system.

## 🔧 Scripts
- `npm run dev` - Starts the local Vite development server.
- `npm run build` - Builds the application for production.
- `npm run preview` - Locally preview the production build.
