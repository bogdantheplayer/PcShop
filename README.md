# PcShop - Full Stack Web Application

PcShop is a full-stack web application designed to simulate a modern PC e-commerce platform.

It allows users to browse products, manage a shopping cart, save products to a wishlist, receive AI-powered product recommendations, build custom PC configurations using an AI assistant, place orders, and authenticate securely using JWT.

Administrators have access to a protected dashboard for managing products and customer orders.

---

## 📸 Application Interface

### 🏠 Product Listing Page



Displays all available PC components in a modern card-based layout.

Each product card includes:

- Product image
- Product name
- Category
- Technical specifications
- User rating
- Price
- Add to Cart button
- Add to Wishlist button

The page also provides:

- Search by product name
- Category filtering
- Quick access to AI Builder
- Wishlist
- Shopping Cart
- User account menu

<img width="1896" alt="image" src="https://github.com/user-attachments/assets/41e1b046-ef62-4000-8512-cb228a736933" />



### 🔐 Authentication (Login & Register)

<img width="437"  alt="image" src="https://github.com/user-attachments/assets/688d0d22-6981-4730-b5d0-00c63cd244bc" />


Users can:

- Create a new account
- Log in securely
- Receive a JWT token for authenticated requests

<img width="439"  alt="image" src="https://github.com/user-attachments/assets/3491e166-ac39-423a-9c92-b2b710c99213" />


### 🛠 Admin Dashboard

<img width="1919"  alt="image" src="https://github.com/user-attachments/assets/b9ca81eb-fe4d-4c3d-9a97-34e39ce516f4" />


Administrators can:

- Add new products
- Edit existing products
- Delete products
- View full product list

Access is restricted to users with the ADMIN role.

<img width="514"  alt="image" src="https://github.com/user-attachments/assets/4922a3e3-d9e4-40c8-ac34-07b3c22dfd03" />


### ⭐ Wishlist


Users can:

- Save products for later
- View all saved products
- Remove products from the wishlist
- Move products directly to the shopping cart

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/9644e7fa-4ff5-48d9-89cc-c3c235560c6b" />



### 🛒 Shopping Cart

Users can:

- Add products to the cart
- Update product quantities
- Remove products from the cart
- View the total order price
- Proceed to checkout

<img width="1897" alt="image" src="https://github.com/user-attachments/assets/bf165a25-32f3-46a3-a061-50a1f738dd07" />


### 🤖 AI Product Recommendations

The shopping cart includes AI-powered product recommendations.

The recommendation engine:

- Suggests complementary PC components
- Analyzes the current shopping cart
- Uses Ollama with the Llama3 model
- Falls back to local recommendation logic if needed

<img width="1893" alt="image" src="https://github.com/user-attachments/assets/1999ebdc-5e95-4aed-a57f-cd7e5a8595d4" />


### 🧠 AI PC Builder

Users can:

- Describe the desired PC configuration
- Specify a budget
- Choose CPU and GPU preferences
- Select the intended usage (gaming, office, programming, video editing)
- Receive AI-generated product recommendations
- Add recommended products directly to the shopping cart

<img width="1898" alt="image" src="https://github.com/user-attachments/assets/daacb7a0-3b0b-4440-8638-5d83fb200a2a" />

### 📄 Product Details


Each product page displays:

- Multiple product images
- Complete technical specifications
- Price and stock information
- User ratings and reviews
- Add to Cart and Wishlist actions

<img width="1894" alt="image" src="https://github.com/user-attachments/assets/579b3162-f7a4-43dc-a7ed-e47ddab1a7be" />


### 📦 Orders

Authenticated users can:

- View their order history
- Review ordered products
- View billing and delivery information

Administrators can:

- View all customer orders
- Edit order information
- Inspect order details

<img width="1912" alt="image" src="https://github.com/user-attachments/assets/b41f33a4-cc23-4752-9a17-f0d383c8ee53" />



---

## 🚀 Features

### 🔐 Authentication & Authorization (JWT)
- User registration
- Secure login
- Role-based access control (USER, ADMIN)
- JWT-based authentication
- Protected /api/admin/** endpoints
- /api/auth/me endpoint to retrieve current user details

### 📦 Product Management

- Public product listing
- Create product (Admin only)
- Update product (Admin only)
- Delete product (Admin only)

Each product contains:

- Name
- Description
- Price
- Stock
- Category
- Manufacturer
- Specifications

### ⭐ Wishlist

Users can save products to a wishlist in order to access them later.

Wishlist functionality allows users to:

- Add products to wishlist
- View saved products
- Remove products from wishlist
- Move products from wishlist to cart

### 📝 Product Details & Reviews

Each product has a dedicated details page where users can view more information before adding it to the cart.

The product details page includes:

- Product images
- Description
- Category
- Manufacturer
- Price
- Stock
- Technical specifications
- User reviews

### 🛒 Shopping Cart

- Add product to cart

- View cart by user

- Remove product from cart


### 🤖 AI Product Recommendations

The shopping cart includes AI-based product recommendations.

Based on the products already added to the cart, the system suggests complementary components such as motherboard, SSD, power supply, case, RAM or cooling solutions.

The recommendation system uses:

- Cart product IDs
- Product categories
- Product manufacturers
- Ollama with the Llama3 model
- Local fallback logic if the AI response is unavailable

### 🧠 AI PC Builder

The application includes an AI-powered PC Builder assistant.

Users can describe what type of PC they want, including budget, usage type, CPU preference, GPU preference and other requirements. The assistant analyzes the request and recommends a compatible PC configuration using only products available in the database.

The AI Builder supports:

- Conversation history
- Budget detection
- Usage detection: gaming, office, programming, video editing
- Intel / AMD CPU preferences
- NVIDIA / AMD GPU preferences
- Product recommendations directly from the database
- Add recommended products to cart

### 📑 Order Management

Users can place orders using the products from their shopping cart.

Order functionality includes:

- Place order
- View personal order history
- Store billing and delivery information
- View all orders as Admin
- View order details as Admin
- Edit orders as Admin

### 💳 Billing & Delivery

Authenticated users can save billing and delivery information before placing an order.

The billing form includes:

- Address
- City
- County
- Country
- Postal code

These details are used during checkout and are displayed in the order details.


### 🔒 Security

The backend uses:

- Spring Boot

- Spring Security

- JWT (JSON Web Token)

- BCrypt password hashing

- Custom authentication filter

- CORS configuration



### 🧠 Backend Architecture

The backend follows a layered architecture:
```bash
Controller → Service → Repository → Database
```

- Controller Layer – Exposes REST APIs

- Service Layer – Business logic

- Repository Layer – Database communication (JPA)

- Entity Layer – Database models

Built using:

- Hibernate (JPA)

- MySQL



---

## 📂 Project Structure
Backend (Spring Boot)
```bash
src/
 ├── ai/
 ├── chatBot/
 ├── controller/
 ├── service/
 ├── repository/
 ├── model/
 ├── config/
 ├── security/
 └── MagazinApplication.java

```

Frontend (React)
```bash

src/
 ├── components/
 ├── pages/
 ├── context/
 ├── services/
 ├── App.js
 └── index.js

```

---

## 🧩 Tech Stack

| Component | Technology |
|------------|------------|
| Backend | Java |
| Framework | Spring Boot |
| Security | Spring Security + JWT |
| ORM | Hibernate (JPA) |
| Database | MySQL |
| Frontend | React |
| HTTP Client | Axios |
| AI Integration | Ollama + Llama3 |
| Styling | CSS |
| Build Tool | Maven |
| Package Manager | npm |

---

## 🗄 Database Structure

Main tables:

- utilizator
- produs
- cos
- comanda
- comanda_produs

Relationships:

- One user can have multiple orders
- One order can contain multiple products
- Each user has a shopping cart
- One user can have one wishlist
- Products can belong to multiple orders

---



## ⚙ Installation & Setup
### 1️⃣ Backend Setup
```bash
Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/magazin_online
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
Run Backend
```bash
mvn spring-boot:run
```

Server runs on:
```bash
http://localhost:8080
```
### 2️⃣ Frontend Setup
```bash
npm install
npm start
```

Frontend runs on:
```bash
http://localhost:3000
```

### 3️⃣ AI Setup with Ollama

The AI features require Ollama to run locally.

Install Ollama and pull the Llama3 model:

```bash
ollama pull llama3
```

Start Ollama:
```bash
ollama serve
```
The backend sends AI requests to:

```bash
http://localhost:11434/api/chat
```

---

## 🔑 Default Admin Account

On application startup, a default admin account is automatically created:
```bash
Email: admin@magazin.ro
Password: admin123
```

---

## 🔄 API Overview
Public Endpoints

- GET /api/produse

- POST /api/auth/login

- POST /api/auth/register

Protected Endpoints

- /api/admin/** → ADMIN only

- /api/comenzi/** → Authenticated users

- /api/cos/** → Authenticated users

AI Endpoints

- POST /api/recomandari/ai
- POST /api/ai-builder/chat

---

## Requirements

Make sure the following are installed:

- Java 17+
- Maven
- Node.js (v18+ recommended)
- MySQL Server (running locally on port 3306)
- Ollama (for AI features)
  
Optional:
- MySQL Workbench or any SQL client (for database management)
- Git


## Clone Repository

```bash
git clone [https://...](https://github.com/bogdantheplayer/PcShop.git)
```


---

## Running the Project

Start the backend:

```bash
mvn spring-boot:run
```

Start the frontend:

```bash
npm start
```

Open:

```bash
http://localhost:3000
```
