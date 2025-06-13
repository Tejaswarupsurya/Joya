# 🌍 Joya — Discover, Host & Review Artisan Stays

> A full-stack travel listing app to explore, list, and review unique homestays and local experiences — featuring live search, filters, map-based discovery, secure authorization, and real reviews.

🛠️ Built solo with ❤️ using Node.js, Express, MongoDB, Passport.js & Bootstrap — because teammates were on vacation 🥲 (open to collabs!).

---

![Render Deploy](https://img.shields.io/badge/Hosted%20on-Render-blue?style=flat-square&logo=render)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
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
- [UI Previews](#-ui-previews)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Security & SEO](#-security--seo)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Passport.js for signup/login with sessions
  - Forgot & Reset Password with OTP flow
  - Protected routes and role-based actions

- 🔍 **Live Search + Filters**
  - Real-time destination search
  - Filter by categories (Hotel, Villa, Resort, etc.)
  - Optional Tax toggle (18% GST included)

- ⭐ **Reviews System**
  - Add/update/delete reviews with star breakdown
  - Authenticated users only — one review per listing

- 🗺️ **Interactive Map View**
  - Mapbox-powered geolocation and preview

- 🖼️ **Image Upload & Optimization**
  - Cloudinary storage with on-the-fly previews
  - Listing-specific images, compressed for performance

- 📱 **Mobile-First Design**
  - Fully responsive — built with Bootstrap 5
  - Optimized UX across all screen sizes

- ⚙️ **Backend Superpowers**
  - Joi validation to prevent bad data
  - Mongo session store for scalability
  - Method override, clean REST routes

- 🔐 **Security & SEO**
  - Helmet, compression, structured markup
  - `robots.txt` and `sitemap.xml` ready

---

## 🧱 Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| Backend      | Node.js, Express 5, MongoDB, Mongoose |
| Frontend     | EJS, EJS-Mate |
| Auth         | Passport.js, passport-local-mongoose |
| Forms & Files| Multer, Cloudinary |
| UI           | Bootstrap 5, Custom CSS |
| Mapping      | Mapbox SDK |
| Dev Tools    | Nodemon, dotenv, connect-flash |
| Security     | Helmet, Joi, compression |

---

## 💻 UI Previews

> *(Add your screenshots/GIF here once ready)*

| Home | Filters | Map | Reviews |
|------|---------|------|---------|
| ![](public/screenshots/home.png) | ![](public/screenshots/filters.png) | ![](public/screenshots/map.png) | ![](public/screenshots/review.png) |

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
DB_URI=your_mongodb_uri
SESSION_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```
### 3. Run Locally

```bash
npm run dev
```
Visit: http://localhost:3000

---

## 🧱 Project Structure

```csharp
Joya/
│
├── models/           # Mongoose Schemas
├── routes/           # Express Routes
├── controllers/      # Business Logic
├── views/            # EJS Templates
├── public/           # Static Assets (CSS, JS)
├── utils/            # Custom middleware & helpers
└── app.js            # Main App Entry
```

---

## 👥 User Roles

| Role                   | Permissions                                    |
| ---------------------- | ---------------------------------------------- |
| **Guest**              | Browse listings, search, and read reviews      |
| **Authenticated User** | Add new listings, upload images, leave reviews |

---

## 🚀 Deployment

- Hosted on Render
- Uses connect-mongo for production-grade session persistence
- Fully environment-configurable via .env

---

## 🔐 Security & SEO
- helmet — secure HTTP headers
- compression — smaller payloads, faster load
- robots.txt + sitemap.xml — for better crawlability
- Structured semantic markup for SEO
- Strong input validation using Joi

---

## 🤝 Contributing
Built fully solo — but collaboration always welcome!
Want to co-build the next big open-source thing or just help improve Joya?

>Ping me — I’d love to work with someone as curious as me 🔥

Pull requests welcome. For major changes, open an issue first.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## ✨ Author
Built with ❤️ by Tejaswarup Surya [LinkedIn](https://www.linkedin.com/in/surya-tejaswarup-a12461280/)


