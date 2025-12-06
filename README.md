# Terrace Shop - Headless Shopify Store

A high-performance, headless e-commerce storefront built for the modern football terrace culture.

Built with **Next.js 16 (App Router)**, **Shopify Storefront API**, and **Server Actions**.

![Terrace Shop Hero](https://i.ibb.co/bRRjzv8Z/terraceshop-bg.png)

## ⚡ Key Features

- **🛒 Instant Optimistic UI (Zustand):**
  - Cart additions and quantity updates are reflected instantly (0ms latency) on the client using **Zustand** stores.
  - Background synchronization with Server Actions ensures data integrity without blocking the user interface.
  - Automatic manual rollback handles rare API failures (e.g., out-of-stock errors) gracefully.
- **🔒 Gated Checkout & Identity Sync:**
  - **Smart Redirect:** Guests are routed to Login; Users are routed to Checkout.
  - **Identity Injection:** Utilizes `cartBuyerIdentityUpdate` immediately before checkout to ensure the user's email and saved addresses are pre-filled on Shopify's checkout page.
  - **"Self-Healing" Cart:** Automatically detects expired or completed cart IDs in cookies and generates a fresh cart instance transparently.
- **📦 Hybrid Order Tracking:**
  - Fetches real-time fulfillment status via the Storefront API.
  - Displays Carrier & Tracking Number directly on the user's Order History dashboard.
  - Provides a "Track Package" deep link to the official Shopify Status map for live updates.
- **🔍 High-Performance Discovery:**
  - **URL-Based Filtering:** Search and Collections rely on URL parameters (e.g., `?sort=price-asc`) for shareability and server-side rendering (SSR) compatibility.
- **🛡️ Secure Authentication:**
  - Powered by **NextAuth.js (v5)**.
  - Strictly gates the Account and Order History pages.
  - Seamlessly integrates user session data with Shopify customer records.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19 RC)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Client-side Cart State)
- **Backend:** [Shopify Storefront API](https://shopify.dev/docs/api/storefront) (GraphQL)
- **Auth:** [NextAuth.js](https://authjs.dev/)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone [https://github.com/your-username/terrace-shop.git](https://github.com/your-username/terrace-shop.git)
cd terrace-shop
npm install
```

### 3. Environment Variables

Create a .env file in the root directory and populate it with your keys:

```bash
# Your store URL (remove 'https://' and trailing slashes)
SHOPIFY_STORE_DOMAIN=""
# PUBLIC: Used by Client & Server (Starts with public_... or generic string)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=""
# PRIVATE: Server-Side ONLY (Starts with shpat_...)
SHOPIFY_ADMIN_ACCESS_TOKEN=""
# The API version you are targeting (e.g., 2024-04)
SHOPIFY_API_VERSION="2024-04"
# AUTHENTICATION (NextAuth)
AUTH_SECRET=""
# The base URL of your site
AUTH_URL=""
# GOOGLE OAUTH
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Run the App

Start the development server:

```bash
pnpm dev
```

Visit http://localhost:3000 to see the app live.

---

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch: `git checkout -b feature/new-feature`

Commit your changes: `git commit -m 'Add some feature'`

Push to the branch: `git push origin feature/new-feature`

Submit a pull request.
