# 🏠 RentNest Backend API

A production-ready RESTful Backend API for a Rental Property Marketplace.

Tenants can browse rental properties, submit rental requests, make online payments via Stripe, and leave reviews.

Landlords can create and manage rental listings, approve/reject rental requests, and monitor their properties.

Admins can manage users, properties, rentals, categories and monitor platform statistics.

---

# 🚀 Live API

```
https://rentnest-backend.vercel.app
```

---

# 📄 Postman Documentation

```
https://documenter.getpostman.com/view/55085333/2sBY4Jv2Tr
```

---

# 👨‍💻 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Stripe Payment Gateway
- Zod Validation
- Swagger OpenAPI
- Vercel Deployment

---

# 📂 Folder Structure

```
src
│
├── app.ts
├── server.ts
│
├── config
├── docs
├── errors
├── interfaces
├── lib
├── middlewares
├── routes
├── utils
│
└── modules
    ├── auth
    ├── admin
    ├── category
    ├── property
    ├── rental
    ├── payment
    └── review
```

---

# 🔑 Features

## Authentication

- Register
- Login
- JWT Authentication
- Role Based Authorization

---

## Roles

### Tenant

- Browse Properties
- Submit Rental Request
- Payment via Stripe
- Review Property
- View Rental History

---

### Landlord

- Property CRUD
- Manage Availability
- Approve Rental Request
- Reject Rental Request
- View Own Properties

---

### Admin

- Dashboard Statistics
- User Management
- Property Management
- Rental Management
- Category Management

---

# 📦 Installation

Clone project

```bash
git clone https://github.com/kira217-cyber/RentNest_Backend
```

Go inside

```bash
cd rentnest-backend
```

Install packages

```bash
npm install
```

---

# ⚙ Environment Variables

Create

```
.env
```

```env
PORT=5000

DATABASE_URL=YOUR_DATABASE_URL

JWT_ACCESS_SECRET=YOUR_SECRET

JWT_ACCESS_EXPIRES_IN=7d

STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET

STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

CLIENT_SUCCESS_URL=http://localhost:3000/payment/success

CLIENT_CANCEL_URL=http://localhost:3000/payment/cancel
```

---

# Prisma

Generate Client

```bash
npx prisma generate
```

Migration

```bash
npx prisma migrate dev
```

Seed

```bash
npm run seed
```

---

# Start Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Run

```bash
npm start
```

---

# API Documentation

Swagger

```
/api-docs
```

---

# Authentication

JWT Bearer Token

```
Authorization

Bearer YOUR_TOKEN
```

---

# Roles

```
ADMIN

LANDLORD

TENANT
```

---

# API Modules

- Authentication
- Categories
- Properties
- Rental Requests
- Payments
- Reviews
- Admin Dashboard

---

# Payment Gateway

Stripe Checkout Session

Stripe Webhook

Payment History

Payment Verification

---

# Error Response

```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": []
}
```

---

# Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# Deployment

Backend

Vercel

Database

Prisma PostgreSQL

---

# Default Admin

Email

```
admin@rentnest.com
```

Password

```
admin123
```

---

# Author

Oracle Technology

```
Built with ❤️ using Node.js + TypeScript + Prisma
```
