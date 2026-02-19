# PcShop - Full Stack Web Application

PcShop is a full-stack web application designed to simulate a real-world e-commerce platform.
It allows users to browse products, manage a shopping cart, place orders, and authenticate securely using JWT. Administrators have access to a protected dashboard for product management.

---

## 📸 Application Interface

### 🏠 Product Listing Page



Displays all available products including:

- Product name
- Description
- Price
- Stock
- Add to Cart button



### 🔐 Authentication (Login & Register)



Users can:

- Create a new account
- Log in securely
- Receive a JWT token for authenticated requests


### 🛠 Admin Dashboard


Administrators can:

- Add new products
- Edit existing products
- Delete products
- View full product list

Access is restricted to users with the ADMIN role.


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


### 🛒 Shopping Cart

- Add product to cart

- View cart by user

- Remove product from cart

### 📑 Order Management

- Place order

- View user orders

- View all orders (Admin only)

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

---

## 📂 Project Structure
Backend (Spring Boot)
```bash
src/
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
 ├── context/
 ├── App.js
 └── index.js

```






