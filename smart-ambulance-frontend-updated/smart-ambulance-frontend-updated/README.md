# 🚑 Smart Ambulance System – Frontend

## 📌 Overview

This is the **frontend** of the Smart Ambulance System.
It provides a user-friendly interface for patients, drivers, and admins to interact with the system.

The application allows users to:

* Request emergency ambulance services
* Track ambulance status
* Manage login and registration
* View real-time updates

---

## 🛠️ Tech Stack

* **React.js** (Frontend Framework)
* **HTML5, CSS3**
* **JavaScript (ES6+)**
* **Axios / Fetch API** (for backend communication)
* **Bootstrap / Tailwind CSS** (if used)

---

## 📂 Project Structure

```
frontend/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Akash1010-max/Smart-Ambulance-System.git
```

### 2️⃣ Navigate to frontend

```
cd Smart-Ambulance-System/frontend
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Start the application

```
npm start
```

👉 The app will run on:

```
http://localhost:3000
```

---

## 🔗 Backend Connection

Make sure your backend server is running.

Update API base URL inside:

```
src/services/api.js (or wherever API is configured)
```

Example:

```javascript
const BASE_URL = "http://localhost:5000";
```

---

## ✨ Features

* 🚑 Emergency ambulance request
* 🔐 User authentication (login/register)
* 📍 Location-based service handling
* 📊 Real-time updates (if implemented)
* 👨‍⚕️ Driver & user dashboards

---

## ⚠️ Important Notes

* Ensure backend is running before using frontend
* Configure `.env` if required
* Do not commit sensitive keys

---

## 📸 Future Improvements

* Live ambulance tracking (Google Maps integration)
* Notifications system
* UI enhancements
* Mobile responsiveness improvements

---

## 👨‍💻 Author

**Akash**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
