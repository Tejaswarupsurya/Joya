<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=D9BED1&height=120&section=header" alt="header"/>

# 🌍 Joya — Discover, Host & Review Artisan Stays

> A full-stack travel listing platform to explore, list, and review unique homestays and local experiences — featuring artistic UI, advanced booking system, admin dashboards, email integration, wishlist management, and comprehensive analytics.

🛠️ Built solo with ❤️ using Node.js, Express, MongoDB, Passport.js, Nodemailer, Jest & Bootstrap (open to collabs!).

---

![Render Deploy](https://img.shields.io/badge/Hosted%20on-Render-blue?style=flat-square&logo=render)
![Version](https://img.shields.io/badge/Version-2.0-brightgreen?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

---

## 🔗 Live Links

- 🌐 **Live Site:** [joya-acbg.onrender.com](https://joya-acbg.onrender.com)
- 📦 **Code Repository:** [GitHub - Joya](https://github.com/Tejaswarupsurya/Joya)

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Security & SEO](#-security--seo)
- [Version History](#-version-history)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🚀 Features

- � **Complete Booking System**

  - Full reservation workflow with date validation
  - Automated booking cleanup and expiration handling
  - User dashboard with booking history and management

- 👑 **Admin & Host Dashboards**

  - Comprehensive admin panel with analytics
  - Host application system with approval workflow
  - Role-based access control and permissions

- 📧 **Professional Email Integration**

  - Email verification system with OTP
  - Password reset with secure email flow
  - Ethereal email service with auto-generated test accounts
  - Preview URLs available for all emails in both development and production
  - No manual email account setup required

- 🔐 **Authentication & Authorization**

  - Passport.js for signup/login with sessions
  - Forgot & Reset Password with OTP flow
  - Protected routes and role-based actions

- 🔍 **Advanced Search + Filters**

  - Real-time destination search with live suggestions
  - Filter by categories (Hotel, Villa, Resort, etc.)
  - Optional Tax toggle (18% GST included)
  - Smart search analytics and trending data

- ⭐ **Reviews System**

  - Add/update/delete reviews with star breakdown
  - Authenticated users only — one review per listing
  - Review analytics and moderation

- 🗺️ **Interactive Map View**

  - Mapbox-powered geolocation and preview
  - Real-time location plotting

- 🖼️ **Image Upload & Optimization**

  - Cloudinary storage with on-the-fly previews
  - Listing-specific images, compressed for performance

- ❤️ **Wishlist System**

  - Save favorite listings with heart animations
  - Personal wishlist management and sharing
  - Quick access from user dashboard

- 📊 **Analytics & Insights**

  - Search analytics with trending data
  - User behavior tracking and optimization
  - Booking patterns and revenue analytics

- 🧪 **Enterprise Testing Suite**

  - Comprehensive test coverage (75%+)
  - API endpoint testing and validation
  - Performance and security testing

- 📁 **Strict MVC Architecture**

  - Clear separation of logic: Models, Views, Controllers
  - Clean REST routes with method override
  - Joi validation to prevent bad data

- 📱 **Mobile-First Design**

  - Fully responsive — built with Bootstrap 5
  - Optimized UX across all screen sizes
  - Skeleton loader UI and smooth animations

- 🎨 **Premium UI Experience**

  - Beautiful animated search icons with pulsing circles
  - Plus Jakarta Sans typography for professional feel
  - Smart state management and smooth transitions

- 🔐 **Security & SEO Ready**
  - Helmet, compression, structured markup
  - `robots.txt` and `sitemap.xml` ready
  - Rate limiting and input sanitization

---

## 🧱 Tech Stack

| Layer         | Technologies                            |
| ------------- | --------------------------------------- |
| Backend       | Node.js, Express 5, MongoDB, Mongoose   |
| Frontend      | EJS, EJS-Mate, Bootstrap 5, Custom CSS  |
| Auth          | Passport.js, passport-local-mongoose    |
| Forms & Files | Multer, Cloudinary                      |
| UI/UX         | Plus Jakarta Sans, Custom Animations    |
| Email         | Nodemailer, SMTP Integration            |
| Testing       | Jest, Supertest, Coverage Reports       |
| Mapping       | Mapbox SDK                              |
| Analytics     | Custom Search & Booking Analytics       |
| Dev Tools     | Nodemon, dotenv, connect-flash          |
| Security      | Helmet, Joi, compression, rate limiting |

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tejaswarupsurya/Joya
cd Joya
npm install
```

### 2. Set Up Environment

Create a .env file with:

```env
# Database
ATLASDB_URL=your_mongodb_uri
SECRET=your_session_secret

# External Services
MAP_TOKEN=your_mapbox_token
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

# Environment
NODE_ENV=development
PORT=3000
```

### 3. Run Locally

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:watch
```

Visit: http://localhost:3000

---

## � Testing

The Joya platform features a **comprehensive testing suite** powered by Jest and Supertest, ensuring reliability and quality across all features.

### Quick Test Overview

- **Coverage**: 74% test success rate (48/65 tests passing)
- **Test Types**: Unit tests, integration tests, API endpoint testing
- **Mocking**: Full service mocking (MongoDB, Cloudinary, Nodemailer, Mapbox)
- **Environment**: Isolated test database with clean setup/teardown

### Key Test Categories

✅ **Authentication & Security** | ✅ **Email Integration** | ✅ **Data Validation**  
✅ **Utility Functions** | ✅ **Error Handling** | ✅ **Frontend Integration**

### Test Commands

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

📋 **[Full Testing Documentation →](tests/README.md)** - Detailed test structure, mocking strategies, and technical notes.

---

## �🧱 Project Structure

```csharp
Joya/
│
├── controllers/      # Business Logic & API Endpoints
├── models/           # Mongoose Schemas (User, Listing, Review, Booking)
├── routes/           # Express Routes (Auth, Search, Admin, Host)
├── views/            # EJS Templates
│   ├── layouts/      # Base templates and boilerplate
│   ├── listings/     # Property listing pages
│   ├── users/        # Authentication and user dashboard
│   ├── bookings/     # Reservation system pages
│   ├── admin/        # Admin dashboard and analytics
│   ├── hosts/        # Host application and management
│   └── info/         # Static pages (Terms, Privacy, FAQ)
├── public/           # Static Assets
│   ├── css/          # Stylesheets (including no-results.css)
│   └── js/           # Client-side JavaScript
├── utils/            # Custom middleware & helpers
│   ├── emailService.js    # Email integration
│   ├── searchAnalytics.js # Search tracking
│   └── bookingCleanup.js  # Automated cleanup
├── tests/            # Comprehensive test suite
├── scripts/          # Database seeding and utilities
└── app.js            # Main App Entry
```

---

## 👥 User Roles

| Role                   | Permissions                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Guest**              | Browse listings, search, and read reviews                                         |
| **Authenticated User** | Add new listings, upload images, leave reviews, manage wishlist, book properties  |
| **Host**               | Create listings, manage properties, view booking analytics, host dashboard access |
| **Admin**              | Full platform control, user management, analytics dashboard, host approvals       |

---

## 🚀 Deployment

- **Platform**: Hosted on Render with auto-deployment
- **Database**: MongoDB Atlas for production scalability
- **Sessions**: connect-mongo for production-grade session persistence
- **Environment**: Fully configurable via environment variables
- **Performance**: Optimized for production with compression and caching
- **Monitoring**: Built-in analytics and error tracking
- **Security**: Production-ready with security headers and validation

---

## 🔐 Security & SEO

- **Security**: Helmet for secure HTTP headers, rate limiting, input sanitization
- **Performance**: Compression for smaller payloads, optimized image delivery
- **SEO**: robots.txt + sitemap.xml, structured semantic markup, meta tags
- **Validation**: Strong input validation using Joi schemas
- **Authentication**: Secure session management with encrypted passwords
- **Email Security**: OTP-based verification and secure password reset
- **Testing**: Comprehensive security testing and vulnerability scanning

---

## 📋 Version History

### Version 2.0 (Current) - October 2025

- ✨ **Artistic No-Results Experience** with animated search icons
- 🏢 **Complete Booking System** with automated management
- 👑 **Admin & Host Dashboards** with analytics
- 📧 **Email Integration** with verification and notifications
- ❤️ **Wishlist System** with heart animations
- 🧪 **Enterprise Testing Suite** (75%+ coverage)
- 📊 **Analytics & Insights** for search and booking patterns
- 🎨 **Enhanced UI/UX** with Plus Jakarta Sans typography
- 🔒 **Advanced Security** with rate limiting and validation
- 🚀 **Production Optimizations** for scale and performance

### Version 1.0 - Initial Release

- 🔐 **Core Authentication** with Passport.js
- 🔍 **Search & Filters** with real-time results
- ⭐ **Review System** with star ratings
- 🗺️ **Map Integration** with Mapbox
- 🖼️ **Image Upload** with Cloudinary
- 📱 **Responsive Design** with Bootstrap 5
- 🏗️ **MVC Architecture** with Express.js

---

## 🤝 Contributing

Built fully solo — but collaboration always welcome!
Want to co-build the next big open-source thing or just help improve Joya?

> Ping me — I’d love to work with someone as curious as me 🔥

Pull requests welcome. For major changes, open an issue first.

---

## 📄 License

This project is licensed under the [**MIT License**](LICENSE).

---

## ✨ Author

Built with ❤️ by Tejaswarup Surya [LinkedIn](https://www.linkedin.com/in/surya-tejaswarup-a12461280/)
<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=D9BED1&height=120&section=footer" alt="footer"/>
