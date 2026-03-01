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

<img width="1917" alt="image" src="https://github.com/user-attachments/assets/64c1c32f-f32e-4b01-961b-c7f7e2eda3b5" />


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

---

## ⚙ Installation & Setup
### 1️⃣ Backend Setup
```bash
Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/magazin
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



---

## Requirements

Make sure the following are installed:

- Java 17+
- Maven
- Node.js (v18+ recommended)
- MySQL Server (running locally on port 3306)

Optional:
- MySQL Workbench or any SQL client (for database management)





