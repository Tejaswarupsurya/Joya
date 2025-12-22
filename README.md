<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,25,27&height=180&section=header&text=Joya&fontSize=60&fontColor=fff&fontAlignY=35&animation=fadeIn&desc=Discover%20•%20Host%20•%20Experience&descSize=20&descAlignY=55"/>


<div align="center">

### 🏨 A Modern Full-Stack Travel Booking Platform

[![AWS EC2](https://img.shields.io/badge/🚀_AWS_EC2-44.223.41.189-FF9900?style=for-the-badge)](http://44.223.41.189/)
[![Render](https://img.shields.io/badge/🌐_Render-joya--acbg.onrender.com-00C7B7?style=for-the-badge)](https://joya-acbg.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Tejaswarupsurya/Joya)

[![CI](https://github.com/Tejaswarupsurya/Joya/actions/workflows/ci.yml/badge.svg)](https://github.com/Tejaswarupsurya/Joya/actions/workflows/ci.yml)
[![CD](https://github.com/Tejaswarupsurya/Joya/actions/workflows/cd.yml/badge.svg)](https://github.com/Tejaswarupsurya/Joya/actions/workflows/cd.yml)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

<br/>

![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

<br/>

![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

<br/>

**A production-ready travel accommodation platform featuring secure Stripe payments, real-time email notifications, interactive maps, CI/CD pipeline with GitHub Actions, and deployment on AWS EC2.**

[🚀 AWS Live](http://44.223.41.189/) · [🌐 Render Demo](https://joya-acbg.onrender.com/) · [📝 Report Bug](https://github.com/Tejaswarupsurya/Joya/issues) · [💡 Request Feature](https://github.com/Tejaswarupsurya/Joya/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Authentication System](#-authentication-system)
- [Payment Integration](#-payment-integration)
- [Email System](#-email-system)
- [Search System](#-search-system)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Joya** is a comprehensive travel listing platform that enables users to discover, book, and review unique accommodations worldwide. Built with modern technologies and best practices, it provides a seamless experience from search to checkout with real payment processing and transactional emails.

### ✨ Highlights

| Feature                     | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| 💳 **Real Payments**        | Stripe Checkout integration with webhook confirmation                |
| 📧 **Transactional Emails** | Automated booking confirmations, cancellations, and OTP verification |
| 🔐 **Secure Auth**          | JWT-based OTP verification with email delivery                       |
| 🗺️ **Interactive Maps**     | Mapbox geocoding and location visualization                          |
| 👥 **Multi-Role System**    | Guest, User, Host, and Admin dashboards                              |
| 📱 **Responsive Design**    | Mobile-first Bootstrap 5 interface                                   |
| 🔍 **Smart Search**         | Text search with synonym expansion and analytics                     |
| ⭐ **Review System**        | Star ratings with verified booking reviews                           |
| 🐳 **Containerized**        | Multi-stage Docker build for optimized production images             |
| 🚀 **CI/CD Pipeline**       | GitHub Actions with self-hosted runner on AWS EC2                    |

---

## ✨ Key Features

### 🛏️ Accommodation Categories

<div align="center">

|     🏨 Hotel     |    🏖️ Beach     |  🏞️ Lakefront  |   🏢 Resort    |     🏡 Villa      |
| :--------------: | :-------------: | :------------: | :------------: | :---------------: |
| 🏠 **Apartment** | 🏘️ **Homestay** | ⛰️ **Terrain** | 🛖 **Cottage** | ⛷️ **Ski Resort** |

</div>

### 🛎️ Available Facilities

```
Free Wi-Fi • Air Conditioning • Hot Water • TV • Security Cameras
Parking • Breakfast Included • Restaurant Onsite • Room Service
Swimming Pool • Pet Allowed • Wheelchair Accessible • Fire Safety
```

---

### 👤 For Guests

| Feature                    | Description                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| 🔍 **Smart Search**        | Filter by category, price range, location, and facilities with synonym expansion |
| 📍 **Interactive Maps**    | View listings on map with Mapbox integration                                     |
| 📅 **Real-Time Booking**   | Date picker with automatic availability checking                                 |
| 💳 **Secure Checkout**     | Stripe-powered payments with instant confirmation                                |
| 📧 **Email Confirmations** | Booking details sent directly to your inbox                                      |
| ❤️ **Wishlists**           | Save and organize favorite properties                                            |
| ⭐ **Reviews**             | Rate stays with 1-5 star ratings and comments                                    |
| 👤 **Dashboard**           | Track bookings, reviews, wishlists, and profile                                  |

### 🏠 For Hosts

| Feature                   | Description                                |
| ------------------------- | ------------------------------------------ |
| 🏠 **Listing Management** | Create, edit, and manage property listings |
| 📸 **Multi-Image Upload** | Cloudinary-powered image hosting with CDN  |
| 📊 **Booking Overview**   | View and manage incoming reservations      |
| 📝 **Host Application**   | Streamlined KYC verification process       |
| 💰 **Earnings Tracking**  | Monitor revenue from confirmed bookings    |

### 🔧 For Admins

| Feature                   | Description                                 |
| ------------------------- | ------------------------------------------- |
| 👥 **User Management**    | View and manage all platform users          |
| ✅ **Host Approvals**     | Review and approve/reject host applications |
| 📈 **Platform Analytics** | Overview of listings, bookings, and users   |
| 🔒 **Access Control**     | Role-based permission management            |

---

## 🛠️ Tech Stack

### Backend

| Technology      | Version | Purpose                          |
| --------------- | ------- | -------------------------------- |
| **Node.js**     | 22.14.0 | Runtime environment              |
| **Express**     | 5.1.0   | Web framework with async support |
| **MongoDB**     | Atlas   | Cloud database                   |
| **Mongoose**    | 8.15.0  | ODM with schema validation       |
| **Passport.js** | 0.7.0   | Authentication middleware        |
| **JWT**         | 9.0.3   | Token-based OTP verification     |
| **Stripe**      | 20.1.0  | Payment processing               |
| **Nodemailer**  | 7.0.11  | Transactional emails             |
| **Joi**         | 17.13.3 | Request validation               |

### Frontend

| Technology            | Purpose                 |
| --------------------- | ----------------------- |
| **EJS**               | Server-side templating  |
| **Bootstrap 5**       | Responsive UI framework |
| **Plus Jakarta Sans** | Modern typography       |
| **Bootstrap Icons**   | Iconography             |

### Cloud Services

| Service           | Purpose             |
| ----------------- | ------------------- |
| **MongoDB Atlas** | Database hosting    |
| **Cloudinary**    | Image storage & CDN |
| **Mapbox**        | Maps & geocoding    |
| **Stripe**        | Payment processing  |
| **SMTP**          | Email delivery      |
| **AWS**           | Production hosting  |

### DevOps & Infrastructure

| Technology             | Purpose                         |
| ---------------------- | ------------------------------- |
| **Docker**             | Multi-stage containerization    |
| **GitHub Actions**     | CI/CD pipeline automation       |
| **AWS EC2**            | Production server hosting       |
| **Self-Hosted Runner** | CD deployment on EC2 instance   |
| **Nginx** (optional)   | Reverse proxy & SSL termination |

### Development & Testing

| Tool          | Purpose            |
| ------------- | ------------------ |
| **Jest**      | Testing framework  |
| **Supertest** | HTTP assertions    |
| **Nodemon**   | Development server |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│                         (EJS + Bootstrap 5)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Listings   │  │   Booking   │  │  Dashboard  │  │    Maps     │    │
│  │    View     │  │    Flow     │  │   Panels    │  │   (Mapbox)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            EXPRESS SERVER                                │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         MIDDLEWARE LAYER                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │   │
│  │  │ Passport │ │ Validate │ │ isAdmin  │ │ isHost   │             │   │
│  │  │   Auth   │ │   Joi    │ │  Check   │ │  Check   │             │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                          ROUTE HANDLERS                           │   │
│  │  /listings  /bookings  /payment  /users  /admin  /host  /search   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                           CONTROLLERS                             │   │
│  │  listing.js  booking.js  payment.js  user.js  admin.js  host.js   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   MONGODB       │   │     STRIPE      │   │    EXTERNAL     │
│   ATLAS         │   │   PAYMENTS      │   │    SERVICES     │
│  ┌───────────┐  │   │  ┌───────────┐  │   │  ┌───────────┐  │
│  │  Listing  │  │   │  │ Checkout  │  │   │  │ Cloudinary│  │
│  │  Booking  │  │   │  │  Session  │  │   │  │   (CDN)   │  │
│  │   User    │  │   │  ├───────────┤  │   │  ├───────────┤  │
│  │  Review   │  │   │  │  Webhook  │  │   │  │  Mapbox   │  │
│  └───────────┘  │   │  │ Listener  │  │   │  │   (Maps)  │  │
└─────────────────┘   └─────────────────┘   │  ├───────────┤  │
                                            │  │   SMTP    │  │
                                            │  │  (Email)  │  │
                                            │  └───────────┘  │
                                            └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **MongoDB Atlas** account ([Create free](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([Sign up](https://cloudinary.com/))
- **Mapbox** account ([Get token](https://www.mapbox.com/))
- **Stripe** account ([Dashboard](https://dashboard.stripe.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tejaswarupsurya/Joya.git
cd Joya

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:8080
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# ═══════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════
ATLAS_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/joya

# ═══════════════════════════════════════════════════════════
# SESSION & SECURITY
# ═══════════════════════════════════════════════════════════
SECRET=your-session-secret-min-32-chars
JWT_SECRET=your-jwt-secret-for-otp-tokens

# ═══════════════════════════════════════════════════════════
# CLOUDINARY (Image Storage)
# ═══════════════════════════════════════════════════════════
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# ═══════════════════════════════════════════════════════════
# MAPBOX (Maps & Geocoding)
# ═══════════════════════════════════════════════════════════
MAP_TOKEN=your-mapbox-public-token

# ═══════════════════════════════════════════════════════════
# STRIPE (Payments)
# ═══════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
BASE_URL=http://localhost:8080

# ═══════════════════════════════════════════════════════════
# EMAIL (SMTP)
# ═══════════════════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM="Joya" <noreply@joya.com>

# ═══════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════
PORT=8080
NODE_ENV=development
```

---

## 📁 Project Structure

```
Joya/
├── 📄 app.js                 # Application entry point
├── 📄 middleware.js          # Custom middleware (auth, validation)
├── 📄 schema.js              # Joi validation schemas
├── 📄 cloudConfig.js         # Cloudinary configuration
├── 🐳 Dockerfile             # Docker multi-stage build
├── 📄 package.json           # Dependencies & scripts
│
├── 📂 .github/workflows/     # 🔄 CI/CD Pipelines
│   ├── ci.yml                # CI: Test + Build (GitHub runner)
│   └── cd.yml                # CD: Deploy to EC2 (Self-hosted runner)
│
├── 📂 controllers/           # Business logic
│   ├── admin.js              # Admin operations
│   ├── booking.js            # Booking CRUD + cancellation emails
│   ├── host.js               # Host application management
│   ├── listing.js            # Listing CRUD + search
│   ├── payment.js            # Stripe Checkout + webhooks
│   ├── review.js             # Review management
│   ├── user.js               # Auth, dashboard, password reset
│   └── wishlist.js           # Wishlist operations
│
├── 📂 models/                # Mongoose schemas
│   ├── booking.js            # Booking with status workflow
│   ├── listing.js            # Listing with geolocation
│   ├── review.js             # Reviews with ratings
│   └── user.js               # User with roles & host profile
│
├── 📂 routes/                # Express route definitions
│   ├── admin.js              # /admin/* routes
│   ├── booking.js            # /listings/:id/bookings routes
│   ├── host.js               # /host/* routes
│   ├── info.js               # Static info pages
│   ├── listing.js            # /listings/* routes
│   ├── payment.js            # /payment/* routes
│   ├── review.js             # /listings/:id/reviews routes
│   ├── search.js             # /search routes
│   ├── user.js               # Auth routes
│   └── wishlist.js           # /wishlist routes
│
├── 📂 utils/                 # Utility modules
│   ├── bookingCleanup.js     # Auto-expire unpaid bookings
│   ├── constants.js          # Categories, facilities lists
│   ├── emailService.js       # 📧 Email sending functions
│   ├── emailTemplates.js     # 📧 HTML email templates
│   ├── ExpressError.js       # Custom error class
│   ├── jwtHelper.js          # 🔐 JWT OTP generation/verification
│   ├── review.js             # Review utilities
│   ├── searchAnalytics.js    # 🔍 Search tracking
│   ├── searchSynonyms.js     # 🔍 Query expansion
│   └── wrapAsync.js          # Async error wrapper
│
├── 📂 public/                # Static assets
│   ├── 📂 css/               # Stylesheets
│   │   ├── style.css         # Main styles
│   │   ├── booking.css       # Booking pages
│   │   ├── dashboard.css     # User dashboard
│   │   └── ...               # Other page styles
│   └── 📂 js/                # Client-side scripts
│       ├── map.js            # Mapbox integration
│       ├── booking.js        # Booking form logic
│       ├── payment.js        # Payment handling
│       ├── search.js         # Search functionality
│       └── ...               # Other scripts
│
├── 📂 views/                 # EJS templates
│   ├── 📂 admin/             # Admin dashboard
│   ├── 📂 bookings/          # Booking forms & details
│   ├── 📂 hosts/             # Host application & dashboard
│   ├── 📂 includes/          # Navbar, footer, flash
│   ├── 📂 info/              # Static pages (FAQ, Terms, etc.)
│   ├── 📂 layouts/           # Base layout (boilerplate.ejs)
│   ├── 📂 listings/          # Listing views (index, show, edit)
│   ├── 📂 payments/          # Success & cancel pages
│   └── 📂 users/             # Auth & dashboard views
│
├── 📂 tests/                 # Jest test suite
│   ├── basic.test.js         # Core functionality tests
│   └── setup.js              # Test configuration
│
└── 📂 scripts/               # Utility scripts
    ├── optimize-search.js    # Create MongoDB indexes
    ├── set-admin.js          # Set user as admin
    └── set-host.js           # Set user as host
```

---

## 🛣️ API Routes

### 🌐 Public Routes

| Method | Route           | Description                    |
| ------ | --------------- | ------------------------------ |
| `GET`  | `/listings`     | View all listings with filters |
| `GET`  | `/listings/:id` | View listing details           |
| `GET`  | `/search`       | Search with query params       |
| `GET`  | `/login`        | Login page                     |
| `GET`  | `/signup`       | Registration page              |
| `GET`  | `/forgot`       | Password reset page            |

### 👤 Authenticated User Routes

| Method   | Route                             | Description          |
| -------- | --------------------------------- | -------------------- |
| `GET`    | `/dashboard`                      | User dashboard       |
| `POST`   | `/listings/:id/reviews`           | Add review           |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete review        |
| `POST`   | `/wishlist/:id/add`               | Add to wishlist      |
| `DELETE` | `/wishlist/:id/remove`            | Remove from wishlist |
| `GET`    | `/listings/:id/bookings/new`      | Booking form         |
| `POST`   | `/listings/:id/bookings`          | Create booking       |
| `POST`   | `/bookings/:id/cancel`            | Cancel booking       |

### 💳 Payment Routes

| Method | Route                              | Description            |
| ------ | ---------------------------------- | ---------------------- |
| `POST` | `/payment/create-checkout-session` | Create Stripe session  |
| `POST` | `/payment/webhook`                 | Stripe webhook handler |
| `GET`  | `/payment/success`                 | Payment success page   |
| `GET`  | `/payment/cancel`                  | Payment cancelled page |

### 🏠 Host Routes (Requires Host Role)

| Method   | Route                | Description       |
| -------- | -------------------- | ----------------- |
| `GET`    | `/host/dashboard`    | Host dashboard    |
| `GET`    | `/listings/new`      | New listing form  |
| `POST`   | `/listings`          | Create listing    |
| `GET`    | `/listings/:id/edit` | Edit listing form |
| `PUT`    | `/listings/:id`      | Update listing    |
| `DELETE` | `/listings/:id`      | Delete listing    |

### 🔧 Admin Routes (Requires Admin Role)

| Method | Route                      | Description              |
| ------ | -------------------------- | ------------------------ |
| `GET`  | `/admin/dashboard`         | Admin dashboard          |
| `POST` | `/admin/hosts/:id/approve` | Approve host application |
| `POST` | `/admin/hosts/:id/reject`  | Reject host application  |

---

## 🔐 Authentication System

Joya implements a secure, email-based JWT OTP verification system:

### 📝 Registration Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Signup    │────▶│  OTP Email  │────▶│   Verify    │────▶│   Welcome   │
│    Form     │     │    Sent     │     │   6-Digit   │     │    Email    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 🔑 Password Reset Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Forgot    │────▶│  OTP Email  │────▶│   Verify    │────▶│  Password   │
│  Password   │     │    Sent     │     │  & Reset    │     │  Updated    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### 🛡️ Security Features

| Feature                 | Implementation                                  |
| ----------------------- | ----------------------------------------------- |
| 🔑 **OTP Verification** | 6-digit code with 10-minute expiration          |
| ⏱️ **Rate Limiting**    | 60-second cooldown between OTP requests         |
| 🔐 **JWT Tokens**       | Stateless verification without database storage |
| 🔒 **Password Hashing** | PBKDF2 via passport-local-mongoose              |
| 🍪 **Session Security** | HTTP-only cookies with MongoDB store            |
| ✅ **Input Validation** | Joi schema validation on all inputs             |

---

## 💳 Payment Integration

Joya uses **Stripe Checkout** for secure payment processing:

### 💰 Booking Payment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Select    │────▶│   Stripe    │────▶│   Webhook   │────▶│   Booking   │
│   Dates     │     │  Checkout   │     │  Confirms   │     │  Confirmed  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                       │                    │
       ▼                                       ▼                    ▼
  pending_payment                        confirmed              📧 Email
```

### 📊 Booking Statuses

| Status            | Description                                 |
| ----------------- | ------------------------------------------- |
| `pending_payment` | Booking created, awaiting payment           |
| `confirmed`       | Payment successful, booking active          |
| `cancelled`       | Cancelled by user (with email notification) |
| `expired`         | Auto-expired after 24 hours unpaid          |

### ✅ Payment Features

- ✅ **Stripe Checkout** - Hosted payment page
- ✅ **Webhook Verification** - Signature validation
- ✅ **Auto-Expiration** - TTL index removes unpaid bookings
- ✅ **Confirmation Emails** - Sent on successful payment

---

## 📧 Email System

Joya includes a complete transactional email system powered by Nodemailer:

### 📨 Email Types

| Email                     | Trigger                    | Content                   |
| ------------------------- | -------------------------- | ------------------------- |
| 📨 **OTP Verification**   | Signup                     | 6-digit verification code |
| 🔑 **Password Reset OTP** | Forgot password request    | 6-digit reset code        |
| ✅ **Password Updated**   | Successful password change | Security confirmation     |
| 📅 **Booking Confirmed**  | Stripe webhook success     | Booking details & dates   |
| ❌ **Booking Cancelled**  | User cancellation          | Cancellation confirmation |
| 👋 **Welcome**            | After email verification   | Welcome message           |

### 📬 Email Template Features

- 🎨 Professional HTML design with gradient headers
- 📱 Responsive layout for mobile devices
- 🏷️ Consistent Joya branding
- 🔗 Clear call-to-action buttons

---

## 🔍 Search System

### 🔎 Search Features

| Feature                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| 📝 **Text Search**       | MongoDB text indexes on title, description, location |
| 🏷️ **Category Filter**   | Filter by accommodation type                         |
| 💰 **Price Range**       | Min/max price filtering                              |
| 🛎️ **Facilities**        | Filter by amenities                                  |
| 🔄 **Synonym Expansion** | "pool" also matches "swimming pool"                  |
| 📊 **Analytics**         | Track popular queries and no-results                 |

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- tests/basic.test.js
```

### Test Coverage

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   74.68 |    63.46 |   53.33 |   75.16 |
----------------------|---------|----------|---------|---------|
```

---

## � CI/CD Pipeline

Joya implements a complete CI/CD pipeline using **GitHub Actions** with a hybrid runner strategy:

### 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOSITORY                                │
│                        (Push to main branch)                             │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      CI WORKFLOW            │   │      CD WORKFLOW            │
│   (GitHub-Hosted Runner)    │   │   (Self-Hosted Runner)      │
│                             │   │                             │
│  ┌───────────────────────┐  │   │  ┌───────────────────────┐  │
│  │ 1. Checkout Code      │  │   │  │ 1. Checkout Code      │  │
│  │ 2. Setup Node.js 18   │  │   │  │ 2. Build Docker Image │  │
│  │ 3. Install Deps       │  │   │  │ 3. Stop Old Container │  │
│  │ 4. Run Tests          │  │   │  │ 4. Start New Container│  │
│  │ 5. Build Docker Image │  │   │  └───────────────────────┘  │
│  └───────────────────────┘  │   │                             │
└─────────────────────────────┘   └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │        AWS EC2              │
                                  │   (Production Server)       │
                                  │                             │
                                  │  ┌───────────────────────┐  │
                                  │  │   Docker Container    │  │
                                  │  │   joya-app:latest     │  │
                                  │  │   Port 3000           │  │
                                  │  └───────────────────────┘  │
                                  │                             │
                                  │  🌐 http://44.223.41.189    │
                                  └─────────────────────────────┘
```

### 🧪 CI Workflow (Continuous Integration)

**Runs on:** `ubuntu-latest` (GitHub-hosted runner)

**Trigger:** Push to `main` branch or Pull Request

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies (npm ci)
      - Run test suite (npm test)
      - Build Docker image (validation)
```

### 🚀 CD Workflow (Continuous Deployment)

**Runs on:** `self-hosted` (AWS EC2 instance)

**Trigger:** Push to `main` branch

```yaml
# .github/workflows/cd.yml
jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - Checkout repository
      - Build Docker image
      - Stop old container
      - Run new container with env file
```

### 🎯 Key CI/CD Features

| Feature                 | Implementation                           |
| ----------------------- | ---------------------------------------- |
| 🔀 **Dual Runners**     | GitHub-hosted for CI, Self-hosted for CD |
| 🐳 **Docker Build**     | Multi-stage build in both pipelines      |
| 🧪 **Automated Tests**  | Jest test suite runs on every push       |
| 🔄 **Zero-Downtime**    | Stop old → Start new container pattern   |
| 🔐 **Secure Secrets**   | Environment file stored on EC2           |
| 📦 **Dependency Cache** | npm cache for faster CI builds           |

---

## 🐳 Deployment

### 🏠 Live Deployments

| Platform    | URL                                                      | Type            |
| ----------- | -------------------------------------------------------- | --------------- |
| **AWS EC2** | [http://44.223.41.189](http://44.223.41.189)             | Primary (CI/CD) |

### 🐳 Docker Multi-Stage Build

The Dockerfile uses a 2-stage build for optimized production images:

```dockerfile
# Stage 1: Builder - Install production dependencies
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Production - Copy only what's needed
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]
```

**Benefits:**

- 🎯 Smaller image size (no dev dependencies)
- 🔒 Reduced attack surface
- ⚡ Faster container startup
- 📦 Layer caching for faster builds

### 🖥️ AWS EC2 Setup

```bash
# 1. Connect to EC2 instance
ssh -i your-key.pem ubuntu@44.223.41.189

# 2. Install Docker
sudo apt update && sudo apt install docker.io -y
sudo usermod -aG docker ubuntu

# 3. Setup GitHub Actions Runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L <runner-url>
tar xzf actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/Tejaswarupsurya/Joya --token <token>
sudo ./svc.sh install && sudo ./svc.sh start

# 4. Create environment file
nano /home/ubuntu/.env
# Add all environment variables
```

### 📋 Manual Docker Commands

```bash
# Build production image
docker build -t joya-app:latest .

# Run container
docker run -d \
  --name joya-app \
  -p 3000:3000 \
  --env-file .env \
  joya-app:latest

# View logs
docker logs -f joya-app

# Restart container
docker restart joya-app
```

### ✅ Production Checklist

- [x] Multi-stage Docker build
- [x] CI pipeline with automated tests
- [x] CD pipeline with self-hosted runner
- [x] AWS EC2 deployment
- [ ] Set `NODE_ENV=production`
- [ ] Configure Stripe **live** keys
- [ ] Set up Stripe webhook endpoint
- [ ] Configure production SMTP credentials
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set secure session secret
- [ ] (Optional) Configure Nginx reverse proxy
- [ ] (Optional) Setup SSL with Let's Encrypt

---

## 📜 NPM Scripts

| Script  | Command                    | Description              |
| ------- | -------------------------- | ------------------------ |
| `start` | `node app.js`              | Start production server  |
| `dev`   | `nodemon app.js`           | Start development server |
| `test`  | `jest --detectOpenHandles` | Run test suite           |

---

## 🛡️ Security Features

| Feature                  | Implementation                             |
| ------------------------ | ------------------------------------------ |
| ✅ **Password Hashing**  | PBKDF2 with salt (passport-local-mongoose) |
| ✅ **JWT OTP**           | Stateless verification tokens              |
| ✅ **HTTP-Only Cookies** | Session protection from XSS                |
| ✅ **Input Validation**  | Joi schema validation                      |
| ✅ **MongoDB Injection** | Mongoose query sanitization                |
| ✅ **Stripe Webhooks**   | Signature verification                     |
| ✅ **Rate Limiting**     | OTP resend cooldown                        |

---

## 📸 Screenshots

<div align="center">

### 🏠 Home Page

https://github.com/user-attachments/assets/a4d0f3f3-8591-4c73-9dd3-f144de5f6121

### 📋 Listing Detail


https://github.com/user-attachments/assets/788b8127-c583-4a78-8be0-16871788a36b


### 📅 Booking Flow




https://github.com/user-attachments/assets/d5d93667-7a4d-4b21-974f-dcf674162e70


### 👤 User Dashboard



https://github.com/user-attachments/assets/343e67a3-95db-4130-88dd-119965a4e51b



### 🏠 Host Dashboard


https://github.com/user-attachments/assets/d4de8c63-6bcf-4ff4-bc7c-80b28db22793



https://github.com/user-attachments/assets/85e580e9-d074-49a5-9e3f-cd6e86a93573




### 🔧 Admin Panel

<img width="1897" height="1036" alt="admindashboard" src="https://github.com/user-attachments/assets/eb62c99b-ca01-4140-a982-0a387cc50444" />


</div>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<div align="center">

**Tejaswaru Surya**

[![GitHub](https://img.shields.io/badge/GitHub-@Tejaswarupsurya-181717?style=for-the-badge&logo=github)](https://github.com/Tejaswarupsurya)

</div>

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Tejaswarup Surya](https://github.com/Tejaswarupsurya)

</div>

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,25,27&height=100&section=footer"/>
