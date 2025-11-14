# The Calm Collective

**The Calm Collective** is a full-stack e-commerce web app focused on a clean, modern shopping experience. It includes real-world features such as product management, role-based authentication and authorization, end-to-end shopping flows, product search, and image hosting. The frontend is built with **React** and the backend is built with **Node.js/Express.js**, with data stored in **MongoDB Atlas**.

The app is deployed using **Vercel** for both frontend and backend, and supports local development via **Docker**.

You can demo the app [here](https://the-calm-collective.vercel.app/).

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)

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

## Features

- Homepage featuring 3 randomly selected best sellers
  <img width="1465" height="828" alt="Screenshot 2025-11-14 at 11 49 12 pm" src="https://github.com/user-attachments/assets/08c4222b-eb4a-449e-ad24-14119a222a8a" />

- Login/Signup pages with strict password requirements
  <img width="1470" height="831" alt="Screenshot 2025-11-14 at 11 57 04 pm" src="https://github.com/user-attachments/assets/33f1c4c6-cfc7-448e-9781-170d526d20c9" />
  <img width="1470" height="831" alt="Screenshot 2025-11-14 at 11 57 28 pm" src="https://github.com/user-attachments/assets/39cf7de7-bdf8-487d-abda-09dd75f4fad6" />

- Product catalog with "Shop by Category" and "Best Sellers" pages
  <img width="1469" height="832" alt="Screenshot 2025-11-14 at 11 54 17 pm" src="https://github.com/user-attachments/assets/80d3b832-e36c-4f9a-bde9-abd101ecc206" />
  <img width="1470" height="831" alt="Screenshot 2025-11-14 at 11 54 31 pm" src="https://github.com/user-attachments/assets/1261426d-29fd-4433-b76c-448d2faecee6" />

- Product search (by product name, description, category, variant)
  <img width="1470" height="829" alt="Screenshot 2025-11-14 at 11 58 37 pm" src="https://github.com/user-attachments/assets/3c445829-a4c0-4109-bcfc-06be0d87677a" />

- Shopping Cart page with optimistic cart updates
  <img width="1469" height="831" alt="Screenshot 2025-11-14 at 11 59 51 pm" src="https://github.com/user-attachments/assets/31f28be4-1749-4401-8d79-68260dffad4e" />

- My Orders page for authenticated users
  <img width="1469" height="831" alt="Screenshot 2025-11-15 at 12 00 34 am" src="https://github.com/user-attachments/assets/ecad3bf3-3f62-449b-a867-200a565b3e4c" />

- Checkout flow with optional user login (supports guest checkout)
  <img width="1470" height="830" alt="Screenshot 2025-11-15 at 12 02 07 am" src="https://github.com/user-attachments/assets/dccb45dd-fb5f-4ab8-a67f-8d5fe8d39b60" />

- Admin dashboard page
  <img width="1468" height="831" alt="Screenshot 2025-11-15 at 12 03 04 am" src="https://github.com/user-attachments/assets/e67a37ad-b96b-4221-af56-b722ce273b49" />

- Admin active shopping carts page
  <img width="1470" height="830" alt="Screenshot 2025-11-15 at 12 03 37 am" src="https://github.com/user-attachments/assets/d6c5bd15-773e-4160-b89a-068398e502b3" />

- Admin completed orders page
  <img width="1470" height="832" alt="Screenshot 2025-11-15 at 12 03 51 am" src="https://github.com/user-attachments/assets/9ffd5066-25d3-4016-81f3-318b2ab9713e" />

- Admin product management page: create, edit, delete products & manage product variants
  <img width="1470" height="832" alt="Screenshot 2025-11-15 at 12 04 20 am" src="https://github.com/user-attachments/assets/d8355c15-5700-40cc-ab7c-22a0aa406f48" />

  https://github.com/user-attachments/assets/85f9eabf-f99f-4c48-8b12-b654a6473c94

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

1. Clone this repository:

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

1. Clone this repository:

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
