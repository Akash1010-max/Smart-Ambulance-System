# 🚑 Smart Ambulance Backend

A production-ready REST API built with Spring Boot that manages emergency dispatch workflow with secure authentication and role-based access control.

---

## 🧠 Features

- JWT Authentication
- Role-Based Access Control (**USER**, **AMBULANCE**, **HOSPITAL**, **ADMIN**)
- 👑 **Admin Management Suite**:
  - Centralized login creation and management for Hospitals & Ambulances
  - Hospital lifecycle management (Create login, View, Update, Delete)
  - Ambulance fleet management (Create driver login, View, Update, Delete)
  - Live system metrics & emergency dispatch analytics (`/api/admin/stats`)
  - Full emergency history and oversight (`/api/admin/emergencies`)
  - Auto-seeded default admin account for zero-configuration startup
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

### Option 1: Standard Local Run

1. Configure database in `application.properties`
2. Run Spring Boot application:

```bash
mvn spring-boot:run
```

### Option 2: Run with Docker Compose (Recommended)

Start both MySQL and the backend service automatically:

```bash
docker compose up --build
```

The backend will be available at `http://localhost:8080` and MySQL at `localhost:3308`.

To stop the containers:
```bash
docker compose down
```

### Option 3: Build & Run Backend Docker Container Only

1. Build the Docker image:
```bash
docker build -t smart-ambulance-backend .
```

2. Run the container (connecting to an existing MySQL instance on host):
```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/smart_ambulance?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true" \
  -e SPRING_DATASOURCE_USERNAME="root" \
  -e SPRING_DATASOURCE_PASSWORD="your_mysql_password" \
  smart-ambulance-backend
```

---

## 👑 Admin API Endpoints

### Default Admin Account (Auto-initialized)
- **Email:** `admin@smartambulance.com`
- **Password:** `Admin@123`

### Authentication & System Overview
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | Public | Log in as Admin to obtain JWT token with `ROLE_ADMIN` |
| `POST` | `/api/admin/register` | ADMIN | Create an additional Administrator account |
| `GET`  | `/api/admin/stats` | ADMIN | Real-time statistics (hospital counts, fleet availability, emergency status) |
| `GET`  | `/api/admin/emergencies` | ADMIN | View all emergency dispatch requests across the system |

### Hospital Management (Admin creates login)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/admin/hospitals` | ADMIN | Create new Hospital login account (name, email, password, address) |
| `GET`  | `/api/admin/hospitals` | ADMIN | Get list of all registered hospitals |
| `GET`  | `/api/admin/hospitals/{id}` | ADMIN | Get hospital details by ID |
| `PUT`  | `/api/admin/hospitals/{id}` | ADMIN | Update hospital profile or password |
| `DELETE`| `/api/admin/hospitals/{id}`| ADMIN | Delete hospital |

### Ambulance Management (Admin creates login)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/admin/ambulances` | ADMIN | Create new Ambulance driver login (driverName, email, password, coordinates) |
| `GET`  | `/api/admin/ambulances` | ADMIN | Get list of all registered ambulances and live statuses |
| `GET`  | `/api/admin/ambulances/{id}` | ADMIN | Get ambulance details by ID |
| `PUT`  | `/api/admin/ambulances/{id}` | ADMIN | Update ambulance details or password |
| `DELETE`| `/api/admin/ambulances/{id}`| ADMIN | Delete ambulance |

---

## 🧪 API Testing

Use Postman to test endpoints.

---

## 📊 Project Status

Production-ready backend with complete workflow and security implementation.

---

## 👨‍💻 Author

Akash
