# E-Commerce Platform

A modern full-stack e-commerce platform built with React, Node.js, and MongoDB, featuring a comprehensive set of e-commerce functionalities.

## 🛠️ Tech Stack

### Frontend
- React 19
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite as build tool
- React Icons for UI elements
- React Slick for product carousels
- React Paginate for pagination
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for secure authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- CORS enabled for cross-origin requests
- Cookie Parser for session management
- Body Parser for request handling

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd e-commerce
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

## 🚀 Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

```
e-commerce/
├── backend/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Entry point
├── frontend/
│   ├── public/        # Static files
│   └── src/
│       ├── assets/    # Static assets
│       ├── components/# Reusable components
│       ├── hooks/     # Custom React hooks
│       ├── layout/    # Layout components
│       ├── pages/     # Page components
│       ├── redux/     # Redux store and slices
│       └── utils/     # Utility functions
└── package.json       # Project configuration
```

## 🔧 Available Scripts

### Backend
- `npm run dev`: Start the development server with nodemon

### Frontend
- `npm run dev`: Start the Vite development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint for code linting

## 🔐 Environment Variables

Make sure to set up the following environment variables:
- `MONGODB_URI`: MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `PORT`: Server port number (default: 4000)

## 👥 Authors

Sanem İzci

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
