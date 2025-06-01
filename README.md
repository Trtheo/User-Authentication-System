#  User Authentication System (React + Node.js + PostgreSQL)

A complete full-stack **User Authentication System** with modern best practices:

-  Secure User Registration & Login  
-  JWT-based Authentication  
-  Password Hashing with bcrypt  
-  Password Reset via Token  
-  React Frontend with Toast Notifications  
-  PostgreSQL as Database (Remote/Local)

---

##  Technologies Used

### 🔹 Backend
- Node.js  
- Express.js  
- PostgreSQL (with `pg` and Neon DB compatibility)  
- bcrypt  
- JSON Web Token (JWT)  
- dotenv

### 🔹 Frontend
- React.js  
- React Router DOM  
- Axios  
- React Toastify  
- TailwindCSS (optional)

---

##  Project Structure

```bash
POSINOVE-PROJECT/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── password.js
│   │   └── task.js
│   ├── db.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ForgotPasswordPage.js
│   │   │   └── ResetPasswordPage.js
│   │   ├── api.js
│   │   └── App.js
└── README.md

```

###  Setup Instructions
1. Clone the Repository

```bash

git clone https://github.com/Trtheo/User-Auth-System-React-Nodejs.git
cd User-Auth-System-React-Nodejs

```

2. Backend Setup (backend/)
a. Install Dependencies

```bash

cd backend
npm install

```

b. Configure .env
Create a `.env` file in the backend/ directory:
```bash
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
DATABASE_URL=postgresql://<username>:<password>@<host>/<dbname>?sslmode=require
```

*Use your NeonDB or local PostgreSQL connection string for DATABASE_URL.*

c. Start the Server

```bash
node server.js

```
- Server will run at: `http://localhost:5000`

3. Frontend Setup (frontend/)
a. Install Dependencies

```bash
cd ../frontend
npm install
```

b. Configure `API URL`  in `.env`
Create a `.env` file in frontend/:

```bash
REACT_APP_BACKEND_URL=http://localhost:5000/api
```

c. Start the React App

```bash
npm start
```
- App runs at: `http://localhost:3000` in browser


###  Authentication Features
User Registration & Login

JWT-Based Session Storage

Secure Password Hashing

Forgot Password (token sent to console)

Password Reset via token URL

Protected Dashboard

Auto-login after registration or reset


###  API Endpoints
🔹 Auth Routes `/api/auth`
POST `/register` → Create new user

POST `/login` → Authenticate and return JWT

GET `/users` → Get all users

🔹 Password Routes /api/password
POST `/forgot-password` → Send token

POST `/reset-password` → Reset password with token


###  Test Workflow
1. Register
Go to /register → Register user

Auto-login on success

2. Login
Go to /login → Enter credentials

JWT token is saved in local storage

3. Forgot/Reset Password
/forgot-password → Submit email

Token appears in terminal console

Go to /reset-password?token=your_token_here

Enter new password and login

###  PostgreSQL Schema

```bash

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  resetpasswordtoken TEXT,
  resetpasswordexpires TEXT
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


```


### 👨‍💻 Author
**Theophile Niyigaba**

🔗 *Portfolio*  https://visittheo.vercel.app/ 

💼 *GitHub*   https://github.com/Trtheo/ 

`Note:` This project is production-ready and was built as a secure, real-world user authentication system.

✅ Deployment Ready!

Supports `PostgreSQL` on `Neon DB`, and frontend/backend deployment on `Vercel`.