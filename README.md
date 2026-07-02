# 🛍️ E-Shop — Full Stack E-Commerce Platform

<div align="center">

![E-Shop Banner](https://marketplace.canva.com/EAFWecuevFk/1/0/1600w/canva-grey-brown-minimalist-summer-season-collections-banner-landscape-VXEmg9V800o.jpg)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.3-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MUI](https://img.shields.io/badge/Material_UI-6.x-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)

**A modern, feature-rich e-commerce application with multi-role support, multiple payment gateways, and a powerful admin/seller dashboard.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Screenshots](#-screenshots) · [API Overview](#-api-overview)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Role-Based Access Control](#-role-based-access-control)
- [Payment Integrations](#-payment-integrations)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Contact](#-contact)

---

## 🧾 About the Project

**E-Shop** is a production-ready, full-stack e-commerce platform built with **React + Vite** on the frontend and a **Spring Boot** REST API on the backend. It supports three user roles — **Customer**, **Seller**, and **Admin** — each with their own tailored experience. Customers can browse, filter, cart, and purchase products using multiple payment options. Sellers can manage their inventory and orders. Admins have full control over the platform.

---

## ✨ Features

### 🛒 Customer Features
- Browse products with search, category filter, and price sorting
- Animated hero banner carousel (Swiper.js)
- Add/remove items to cart with real-time quantity management
- Manage multiple delivery addresses (add, edit, delete)
- Multi-step checkout flow (Address → Payment → Summary → Pay)
- Multiple payment methods: **Stripe**, **Razorpay**, **COD**
- Order confirmation page
- User profile with avatar upload
- Persistent cart via localStorage

### 🏪 Seller Features
- Dedicated seller panel (subset of admin routes)
- Manage own products (add, edit, delete, upload images)
- View and update status of own orders

### 🔐 Admin Features
- Full admin dashboard with analytics (Products, Orders, Revenue)
- Complete product CRUD with image upload
- Category management (create, update, delete)
- Order management with status updates
- Seller account creation and listing
- Server-side pagination on all tables (MUI DataGrid)

### 🔑 Auth & Security
- JWT-based authentication (stored in localStorage)
- Axios interceptor auto-attaches Bearer token to every request
- Role-based private routing (`ROLE_ADMIN`, `ROLE_SELLER`, `ROLE_USER`)
- Protected routes for auth, admin, and seller panels

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18.3 + Vite 5 |
| **State Management** | Redux Toolkit + React-Redux |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 + MUI v6 |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios (with interceptors) |
| **Payment – Cards** | Stripe (`@stripe/react-stripe-js`) |
| **Payment – INR** | Razorpay |
| **Notifications** | React Hot Toast |
| **Carousel** | Swiper.js |
| **Data Tables** | MUI X DataGrid |
| **Icons** | React Icons |
| **Loader** | React Loader Spinner |
| **Build Tool** | Vite |
| **Deployment** | Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- A running instance of the **E-Shop Spring Boot Backend** (on `http://localhost:8080`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/e-shop.git

# 2. Navigate to the frontend directory
cd Ecom-Frontend

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `Ecom-Frontend/` root directory with the following keys:

```env
# Backend API base URL
VITE_BACK_END_URL=http://localhost:8080

# Frontend URL (used for Stripe redirect)
VITE_FRONTEND_URL=http://localhost:5173

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Razorpay Key ID
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running the App

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The app will be available at **`http://localhost:5173`**.

---

## 📁 Project Structure

```
Ecom-Frontend/
├── public/                     # Static assets
├── src/
│   ├── api/
│   │   └── api.js              # Axios instance with JWT interceptor
│   ├── assets/
│   │   └── sliders/            # Hero banner images
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── categories/     # Category CRUD
│   │   │   ├── dashboard/      # Analytics overview
│   │   │   ├── order/          # Order management
│   │   │   ├── products/       # Product management + image upload
│   │   │   └── sellers/        # Seller management
│   │   ├── auth/               # Login & Register forms
│   │   ├── cart/               # Cart, item content, quantity control
│   │   ├── checkout/           # Multi-step checkout, payment components
│   │   ├── home/               # Hero banner, home page
│   │   ├── products/           # Product listing, filters
│   │   └── shared/             # Reusable components (Navbar, Modal, Loader, etc.)
│   ├── hooks/                  # Custom hooks (useProductFilter, useOrderFilter, etc.)
│   ├── store/
│   │   ├── actions/
│   │   │   └── index.js        # All Redux thunk actions
│   │   └── reducers/           # Redux slice reducers + store config
│   ├── utils/                  # Helper functions (formatPrice, truncateText, constants)
│   ├── App.jsx                 # Root component with all routes
│   ├── index.css               # Global styles + Tailwind theme config
│   └── main.jsx                # App entry point with Redux Provider
├── .env                        # Environment variables (not committed)
├── index.html                  # HTML entry point (includes Razorpay script)
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel SPA rewrite rules
└── package.json
```

---

## 🔐 Role-Based Access Control

| Route | Guest | Customer | Seller | Admin |
|---|:---:|:---:|:---:|:---:|
| `/` Home | ✅ | ✅ | ✅ | ✅ |
| `/products` | ✅ | ✅ | ✅ | ✅ |
| `/cart` | ✅ | ✅ | ✅ | ✅ |
| `/checkout` | ✅ | ✅ | ✅ | ✅ |
| `/login`, `/register` | ✅ | ❌ redirect | ❌ redirect | ❌ redirect |
| `/profile` | ❌ | ✅ | ✅ | ✅ |
| `/order-confirm` | ❌ | ✅ | ✅ | ✅ |
| `/admin` (Dashboard) | ❌ | ❌ | ❌ | ✅ |
| `/admin/products` | ❌ | ❌ | ✅ | ✅ |
| `/admin/orders` | ❌ | ❌ | ✅ | ✅ |
| `/admin/categories` | ❌ | ❌ | ❌ | ✅ |
| `/admin/sellers` | ❌ | ❌ | ❌ | ✅ |

---

## 💳 Payment Integrations

### Stripe
- Creates a Payment Intent via the backend (`/order/stripe-client-secret`)
- Uses `@stripe/react-stripe-js` `<Elements>` and `<PaymentElement>` for the UI
- Redirects to `/order-confirm` after payment with status params in the URL
- Confirms the order server-side on success

### Razorpay (INR)
- Creates a Razorpay order via the backend (`/order/razorpay-order`)
- Dynamically loads the Razorpay checkout script
- Handles success/failure callbacks inline
- Ideal for Indian Rupee transactions

### Cash on Delivery (COD)
- No payment gateway required
- Places the order directly with `pgStatus: "Pending"`
- Calls `/order/users/payments/COD` endpoint

---

## 🌐 API Overview

All API calls are made through the Axios instance in `src/api/api.js`, which automatically attaches the JWT Bearer token from localStorage.

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signin` | POST | User login |
| `/api/auth/signup` | POST | User / Seller registration |
| `/api/auth/sellers` | GET | List all sellers (Admin) |
| `/api/public/products` | GET | Fetch all products |
| `/api/public/categories` | GET | Fetch all categories |
| `/api/user/addresses` | GET | Get user addresses |
| `/api/addresses` | POST | Add new address |
| `/api/addresses/:id` | PUT / DELETE | Update / delete address |
| `/api/cart/create` | POST | Sync cart to backend |
| `/api/carts/users/cart` | GET | Get user's cart |
| `/api/order/stripe-client-secret` | POST | Create Stripe PaymentIntent |
| `/api/order/razorpay-order` | POST | Create Razorpay order |
| `/api/order/users/payments/online` | POST | Confirm Stripe/Razorpay order |
| `/api/order/users/payments/COD` | POST | Place COD order |
| `/api/admin/products` | GET / POST | Admin product management |
| `/api/admin/categories` | GET / POST | Admin category management |
| `/api/admin/orders` | GET | Admin order listing |
| `/api/admin/orders/:id/status` | PUT | Update order status |
| `/api/admin/app/analytics` | GET | Dashboard analytics |
| `/api/seller/products` | GET | Seller's own products |
| `/api/seller/orders` | GET | Seller's own orders |
| `/api/auth/profile-picture` | PUT | Upload profile avatar |

---

## ☁️ Deployment

This project is configured for **Vercel** deployment.

The `vercel.json` file includes a rewrite rule to support client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Steps to deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Make sure to add all environment variables (`VITE_*`) in your **Vercel project settings** under *Environment Variables*.

---

## 📞 Contact

**Ramashish Yadav**

- 📧 Email: [ramashishyadav42449@gmail.com](mailto:ramashishyadav42449@gmail.com)
- 📱 Phone: +91 7860470866
- 📍 Location: Khandari, Agra, Uttar Pradesh, India

---

<div align="center">

Made with ❤️ by Ramashish Yadav

⭐ If you found this project helpful, please consider giving it a star!

</div>
