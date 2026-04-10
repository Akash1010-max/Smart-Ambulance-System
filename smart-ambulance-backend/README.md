# 🚑 Smart Ambulance Backend

A production-ready REST API built with Spring Boot that manages emergency dispatch workflow with secure authentication and role-based access control.

---

## 🧠 Features

- JWT Authentication
- Role-Based Access Control (USER, AMBULANCE, HOSPITAL)
- Emergency lifecycle workflow
- Secure DTO architecture
- Input validation
- Exception handling
- Hospital-specific emergency access
- Stateless REST APIs

---

## 🔄 Emergency Workflow

PENDING → ACCEPTED → PICKED_UP → DROPPED → COMPLETED

---

## 🏗️ Architecture

Controller → Service → Repository → DTO → Entity

---

## 🔐 Security

- JWT token authentication
- BCrypt password hashing
- Role-based endpoint protection

---

## 🗄️ Database Entities

- Users
- Ambulances
- Hospitals
- Emergency Requests

---

## ⚙️ Tech Stack

- Java 17
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA
- MySQL
- Maven

---

## 🚀 How to Run

1. Clone repository
2. Configure database in `application.properties`
3. Run Spring Boot application

```
mvn spring-boot:run
```

---

## 🧪 API Testing

Use Postman to test endpoints.

---

## 📊 Project Status

Production-ready backend with complete workflow and security implementation.

---

## 👨‍💻 Author

Dhanush
