# TaskFlow - Full-Stack Task Management System

TaskFlow is a modern, enterprise-grade task management application built to help teams organize, track, and manage their daily workflows. This project features a robust **Node.js/Express** backend with **PostgreSQL** persistence and a highly responsive **React/TypeScript** frontend.

## 🚀 Key Features

- **Secure Authentication**: Full registration and login system using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Task Dashboard**: A central hub to view tasks assigned to you or created by you.
- **Real-Time CRUD**: Create, read, update, and delete tasks with immediate database synchronization.
- **Modular Architecture**: Clean, reusable React components organized for scalability.
- **Responsive UI**: A polished, mobile-friendly interface built with Tailwind CSS.
- **Strict Typing**: End-to-end TypeScript implementation for both frontend and backend to ensure code quality.

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State/Routing**: React Router DOM & Context API
- **API Client**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Security**: JWT, Bcrypt, CORS

## ⚙️ Setup & Installation

### 1. Database Setup
1. Create a new PostgreSQL database named `task_management` using pgAdmin or psql.
2. Ensure your PostgreSQL service is running on its default port (5432).

### 2. Backend Configuration
1. Navigate to the `backend` folder.
2. Install dependencies:   npm install

Create a .env file in the backend root and add your credentials:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=task_management
JWT_SECRET=your_secret_key_here

Start the server:
npm run dev

### 3. Frontend Configuration
1. Navigate to the frontend folder.
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev
4. Open your browser to http://localhost:5173.

📝 Usage Note
To test the full functionality:
1. Click on the Sign Up tab to create a new account in your database.
2. Log in with your new credentials.
3. Create tasks, change their status, and verify persistence by refreshing the page.