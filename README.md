# 🎓 CSE Alumni Reunion 2025 – JKKNIU

Welcome to the official repository for the **CSE Alumni Reunion 2025** website of Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)!

🌐 **Live Site:** [https://csealumni.jkkniu.edu.bd/](https://csealumni.jkkniu.edu.bd/)

---

## 🚀 Features

- **Online Registration** for alumni, students, and their families
- **Announcements** and event updates
- **Admin Dashboard** for managing registrations and payments
- **PDF Invoice** download after registration
- **Email Notifications** for confirmation and updates
- **Responsive, modern UI** (React + Tailwind CSS)
- **Secure file uploads** (profile pictures)

---

## 🏗️ Tech Stack

| Frontend                | Backend                | DevOps / Infra      |
|-------------------------|------------------------|---------------------|
| React + Vite            | Node.js + Express      | Docker, Docker Compose |
| Tailwind CSS            | MongoDB (Mongoose)     | Nginx               |
| ShadCn                  | Nodemailer (emails)    | Caddy                    |
| Lucide React            | JWT Auth (admin)       |                     |

---

## 📦 Project Structure

```
docker-compose.yml
Backend/
  app.js, server.js, Dockerfile
  controllers/ models/ routes/ Services/ db/ middleware/ utils/
Frontend/
  src/ (components, api, hooks, lib, assets)
  public/
  index.html, Dockerfile, tailwind.config.js, vite.config.js
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js
- Docker & Docker Compose
- MongoDB (if not using Docker)

### 1. Clone the Repository
```sh
git clone <repo-url>
cd CSE-Alumni-Reunion-2025-Official-Website
```

### 2. Environment Variables
- Copy `.env.example` to `.env` in both `Backend/` and `Frontend/` and fill in the required values.

### 3. Run with Docker Compose
```sh
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

### 4. Manual (Non-Docker) Setup
#### Backend
```sh
cd Backend
npm install
npm run dev
```
#### Frontend
```sh
cd Frontend
npm install
npm run dev
```

---

## 👨‍💻 Developers

See [Developer Info](https://csealumni.jkkniu.edu.bd/developer-info) for details.

- [Md. Tamjid Hossen](https://github.com/tamjidhossen)
- [Nabeel Ahsan](https://github.com/Nabeel-Ahsan7)

---

> © 2025 CSE, JKKNIU. All rights reserved.
