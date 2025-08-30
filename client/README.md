# Ustadi School Management System

A **full-stack School Management App** built with **Flask (backend)** and **React + Vite (frontend)**.  
The system provides role-based dashboards and authentication for **admins, teachers, and students**, enabling secure management of users, classes, and grades.

---

## 🚀 Features

- 🔐 **Authentication System**  
  - Register, Login, Logout  
  - Role-based redirects (Admin → `/admin`, Teacher → `/teacher`, Student → `/student`)  
  - JWT token persistence via `localStorage`

- 👩‍🏫 **Role-Based Access**  
  - **Admin**: Manage teachers, students, and classes  
  - **Teacher**: Manage assigned classes, grades, and student performance  
  - **Student**: View grades, assigned subjects, and personal profile  

- ⚡ **Tech Stack**
  - **Frontend**: React (Vite, TailwindCSS, React Router)  
  - **Backend**: Flask, Flask-JWT, SQLAlchemy  
  - **Database**: SQLite (default) – configurable for PostgreSQL/MySQL  
  - **Deployment Ready**: Compatible with Render/Heroku (backend) + Vercel/Netlify (frontend)

---

## 📂 Project Structure

```bash
phase4-project-group-09-school-management-app/
│── app/ # Flask backend
│ ├── models/ # SQLAlchemy models
│ ├── routes/ # API endpoints
│ ├── init.py # App factory
│ ├── config.py # Configurations
│ └── wsgi.py # Entry point for production
│
│── client/ # React frontend
│ ├── src/
│ │ ├── context/ # AuthContext.jsx
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page views (Login, Dashboard, etc.)
│ │ └── App.jsx
│ ├── index.html
│ └── vite.config.js
│
│── Pipfile / Pipfile.lock # Backend dependencies
│── package.json # Frontend dependencies
│── README.md
```


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Moringa-SDF-PT10/phase4-project-group-09-school-management-app

cd phase4-project-group-09-school-management
```


###  2️⃣ Backend Setup (Flask)
```bash
cd app
pipenv install --dev
pipenv shell
flask db upgrade     # Run migrations if using Alembic
flask run
```


### 3️⃣ Frontend Setup (React + Vite)
```bash
cd client
npm install
npm run dev

Frontend runs at: http://localhost:5173
```


### 🔗 API Endpoints (Backend)
```bash
| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/api/auth/register`   | Register new user         |
| POST   | `/api/auth/login`      | Authenticate user         |
| GET    | `/api/users/me`        | Get current user          |
| GET    | `/api/admin/users`     | (Admin only) List users   |
| POST   | `/api/classes`         | (Admin/Teacher) Add class |
| GET    | `/api/students/grades` | (Student) View grades     |
```


### 🔐 Authentication Flow
```bash 
- User logs in via AuthContext.jsx → fetch("/api/auth/login")

- JWT token + user details stored in localStorage

- Requests use Authorization: Bearer <token> header

- Role-based redirect:

- Admin → /admin

- Teacher → /teacher

- Student → /student
```


### 🧪 Testing the Project
```bash
Run backend (Flask)

cd app
flask run
```

```bash
Run frontend (React + Vite)

cd client
npm run dev
```

---
Visit http://localhost:5173
 and try:

Register a new user

Login with that user

Confirm role-based redirect

Test CRUD operations (classes, grades, users)


---
### `🌍 Deployment`
`Backend (Flask)`

- Host on Render

- Configure environment variables:

    - FLASK_ENV=production

    - SECRET_KEY=your-secret

    - DATABASE_URL=your-database-uri

`Frontend (React)`
- Deploy to Netlify / Vercel

- Update API base URL in AuthContext.jsx:

```js 
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
```
---
### `👥 Contributors`
👤 Grace Wangari – Backend Lead (Flask API + Database)

👤 George Kahuki – Frontend Lead (React UI + Routing)

👤 Chris Jesse – Forms & Validation (Formik/Yup + State Mgmt)

👤 Benard Oluoch – UI/UX & Deployment


---
### 📜 License
This project is licensed under the `MIT License`.