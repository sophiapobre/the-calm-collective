# The Calm Collective

**The Calm Collective** is a full-stack e-commerce web app focused on a clean, modern shopping experience. It includes real-world features such as product management, role-based authentication and authorization, end-to-end shopping flows, product search, and image hosting. The frontend is built with **React** and the backend is built with **Node.js/Express.js**, with data stored in **MongoDB Atlas**.

The app is deployed using **Vercel** for both frontend and backend, and supports local development via **Docker**.

You can demo the app [here](https://the-calm-collective.vercel.app/).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features and Screenshots](#features-and-screenshots)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)

## Technologies Used

### **Frontend**
- React – JavaScript library for building component-based UIs
- React Context API – for global state management

### **Backend**
- Node.js – JavaScript runtime environment
- Express.js – backend wep app framework for building RESTful APIs with Node.js
- Mongoose – MongoDB object modeling
- MongoDB Atlas – cloud database with JSON-like document data model

### **Other Services**
- Cloudinary – image upload & asset hosting
- JWT Authentication – for secure role-based admin control
- Vercel – for automated builds and deployments  
- Docker – local and development environment

## Features and Screenshots
<details>
<summary>Click to expand</summary>

- Homepage featuring 3 randomly selected best sellers

- Login/Signup pages with strict password requirements

- Product catalog with "Shop by Category" and "Best Sellers" pages

- Product search (by product name, description, category, variant)

- Shopping Cart page with optimistic cart updates

- My Orders page for authenticated users

- Checkout flow with optional user login (supports guest checkout)

- Admin dashboard
  - View all active shopping carts
  - View all completed orders 
  - Product management: create, edit, delete products & manage product variants

</details>

## Getting Started

### Prerequisites
You will need environment variables for [MongoDB Atlas](https://www.mongodb.com/atlas), [Cloudinary](https://cloudinary.com/), and JWT authentication.

Create a `.env` file with the following credentials:

- `PORT=4000`
- `MONGO_URL` - your MongoDB URI
- `FRONTEND_URL=http://localhost:3000`
- `CLOUDINARY_CLOUD_NAME` - your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - your Cloudinary API key
- `CLOUDINARY_API_SECRET` - your Cloudinary API secret

### Running the app locally

1. Clone this repository

```bash
git clone https://github.com/sophiapobre/the-calm-collective.git
```

2. Place your `.env` file in the `/backend` folder

3. Install dependencies for both the frontend and backend:

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. Start the backend server:

```bash
cd backend && npm start
```

5. In a new terminal, start the frontend server:

```bash
cd frontend && npm start
```

6. Access the app:
   - Launch your browser and go to [http://localhost:3000](http://localhost:3000) to access the frontend.
   - The backend API will also be available for you to test at [http://localhost:4000](http://localhost:4000).


### Running the app on Docker

1. Clone this repository

```bash
git clone https://github.com/sophiapobre/the-calm-collective.git
```

2. Place your `.env` file in the `/backend` folder

3. Build and start all services:

```bash
docker compose up --build
```

4. Access the app:
   - Launch your browser and go to [http://localhost:3000](http://localhost:3000) to access the frontend.
   - The backend API will also be available for you to test at [http://localhost:4000](http://localhost:4000).

5. To stop running the app, press `Ctrl+C` in the terminal, and then run:

```bash
docker compose down
```