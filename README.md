# GigFlow 🚀

**GigFlow** is a modern freelance marketplace platform that connects clients with talented freelancers. Built with a full-stack TypeScript/JavaScript architecture, it provides real-time notifications, bidding systems, and a seamless user experience.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Clients
- **Post Jobs/Gigs**: Create detailed job postings with budget ranges and requirements
- **Browse Freelancers**: Search and filter through talented professionals
- **Review Bids**: Receive and evaluate proposals from interested freelancers
- **Hire Freelancers**: Accept bids and assign work to the best candidates
- **Real-time Notifications**: Get instant updates when freelancers bid on your jobs

### For Freelancers
- **Browse Jobs**: Explore available gigs filtered by category and skills
- **Submit Bids**: Propose your services with competitive pricing
- **Track Applications**: Monitor the status of all your bids in one place
- **Real-time Updates**: Receive instant notifications about bid status changes

### General Features
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Role-based System**: Separate interfaces for clients and freelancers
- **Category System**: Organized job categories for better discoverability
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Communication**: WebSocket-based notification system

## 🛠 Technology Stack

### Frontend
- **React 19.2.0**: Modern UI library with hooks
- **Redux Toolkit**: State management
- **React Router 7**: Client-side routing
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API requests
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express 5**: Web application framework
- **TypeScript**: Type-safe development
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Token-based authentication
- **Bcrypt**: Password hashing
- **Zod**: Schema validation
- **Jest**: Testing framework

### WebSocket Server
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe development
- **ws**: WebSocket library
- **HTTP Server**: For internal notification API

## 🏗 Architecture

GigFlow follows a microservices-inspired architecture with three main components:

```
┌─────────────────┐
│    Frontend     │
│   (React SPA)   │
└────────┬────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌─────────────┐  ┌──────────────┐
│   Backend   │  │  WebSocket   │
│  (Express)  │◄─┤    Server    │
└──────┬──────┘  └──────────────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │
└─────────────┘
```

### Components

1. **Frontend**: Single-page application providing the user interface
2. **Backend API**: RESTful API handling business logic and data persistence
3. **WebSocket Server**: Real-time notification delivery system
4. **MongoDB**: Database for storing users, gigs, bids, and categories

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **MongoDB**: Version 6.x or higher (local or cloud instance)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Neel7780/GigFlow.git
cd GigFlow
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Install WebSocket Server Dependencies

```bash
cd ../websocket-server
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Configure your environment variables:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gigflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Configuration
PORT=3000

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:5173

# WebSocket Configuration
WS_URL=http://localhost:8080
API_SECRET=shared-secret-with-websocket-server
```

### WebSocket Server Configuration

1. Navigate to the websocket-server directory:
```bash
cd websocket-server
```

2. Create a `.env` file:
```bash
touch .env
```

3. Add the following configuration:
```env
# WebSocket Server Configuration
WS_PORT=8080

# API Secret (must match backend)
API_SECRET=shared-secret-with-websocket-server
```

### Frontend Configuration

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create a `.env` file:
```bash
touch .env
```

3. Add the following configuration:
```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# WebSocket Server URL
VITE_WS_URL=ws://localhost:8080
```

## 🎯 Running the Application

### Development Mode

You need to run all three services simultaneously. Open three terminal windows:

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
The backend will start at `http://localhost:3000`

#### Terminal 2: WebSocket Server
```bash
cd websocket-server
npm run dev
```
The WebSocket server will start at `ws://localhost:8080`

#### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```
The frontend will start at `http://localhost:5173`

### Production Mode

#### Build and Start Backend
```bash
cd backend
npm run build
npm start
```

#### Build and Start WebSocket Server
```bash
cd websocket-server
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Seeding the Database

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- Sample categories (Web Development, Mobile Development, Design, etc.)
- Test users (clients and freelancers)
- Sample gigs with various statuses

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer",
  "skills": ["JavaScript", "React"]
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Update User Profile
```http
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Experienced developer",
  "skills": ["React", "Node.js"]
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories
```

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "All web development related jobs"
}
```

### Gig Endpoints

#### Get All Gigs
```http
GET /gigs
Query Parameters:
  - status: open|assigned
  - categoryId: string
  - search: string
  - limit: number
  - page: number
```

#### Get Gig by ID
```http
GET /gigs/:id
Authorization: Bearer <token>
```

#### Create Gig
```http
POST /gigs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build a React Website",
  "description": "Need a modern website built with React",
  "budgetMin": 500,
  "budgetMax": 1000,
  "budgetType": "fixed",
  "duration": "2 weeks",
  "skills": ["React", "JavaScript"],
  "categoryId": "category_id_here"
}
```

#### Update Gig
```http
PATCH /gigs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "assigned",
  "hiredFreelancerId": "freelancer_id_here"
}
```

#### Delete Gig
```http
DELETE /gigs/:id
Authorization: Bearer <token>
```

### Bid Endpoints

#### Get Bids for a Gig
```http
GET /bids/gig/:gigId
Authorization: Bearer <token>
```

#### Get User's Bids
```http
GET /bids/my-bids
Authorization: Bearer <token>
```

#### Create Bid
```http
POST /bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "gigId": "gig_id_here",
  "message": "I can complete this project within your timeline",
  "price": 750
}
```

#### Update Bid Status
```http
PATCH /bids/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "hired"
}
```

### Health Check

#### Backend Health
```http
GET /health
```

#### WebSocket Health
```http
GET http://localhost:8080/health
```

## 📁 Project Structure

```
GigFlow/
├── backend/                    # Backend API server
│   ├── db/                    # Database configuration and models
│   │   ├── models/           # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Gig.ts
│   │   │   ├── Bid.ts
│   │   │   └── Category.ts
│   │   ├── db.ts             # Database connection
│   │   └── seed.ts           # Database seeding script
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── validators/       # Input validation schemas
│   │   ├── middleware.ts     # Custom middleware
│   │   └── index.ts          # Application entry point
│   ├── tests/                # Test files
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── assets/           # Static assets
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store and slices
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Application entry point
│   ├── public/               # Public assets
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.js        # Vite configuration
│   └── vercel.json           # Vercel deployment config
│
├── websocket-server/          # WebSocket notification server
│   ├── src/
│   │   └── index.ts          # WebSocket server
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

## 💻 Development

### Code Style

The project follows these conventions:
- **TypeScript**: Used for backend and WebSocket server
- **ESLint**: Code linting for frontend
- **Prettier**: Code formatting (recommended)

### Running Linter

```bash
# Frontend
cd frontend
npm run lint
```

### Building the Project

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# WebSocket Server
cd websocket-server
npm run build
```

### Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test thoroughly

3. Run linter and tests:
```bash
npm run lint
npm run test
```

4. Commit your changes:
```bash
git add .
git commit -m "Description of your changes"
```

5. Push to your branch:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request on GitHub

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
```

Tests are located in `backend/tests/` and use Jest with MongoDB Memory Server for isolated testing.

### Test Structure

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database interactions
- **Authentication Tests**: Test JWT authentication and authorization

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to various platforms:

#### Heroku
```bash
# Login to Heroku
heroku login

# Create new app
heroku create gigflow-api

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git subtree push --prefix backend heroku main
```

#### Railway / Render
1. Connect your GitHub repository
2. Select the `backend` directory as the root
3. Set environment variables in the dashboard
4. Deploy

### Frontend Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### WebSocket Server Deployment

Deploy to any Node.js hosting platform that supports WebSocket connections:
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2

Ensure WebSocket connections are properly configured in your hosting platform.

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

**Backend:**
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `CORS_ORIGIN`
- `WS_URL`
- `API_SECRET`

**Frontend:**
- `VITE_API_URL`
- `VITE_WS_URL`

**WebSocket Server:**
- `WS_PORT`
- `API_SECRET`

## 🤝 Contributing

We welcome contributions to GigFlow! Here's how you can help:

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Neel7780/GigFlow/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request with a clear description

### Development Guidelines

- Write clear, self-documenting code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Write tests for new functionality
- Keep commits focused and atomic

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 👥 Authors

- **Neel7780** - Initial work - [GitHub Profile](https://github.com/Neel7780)

## 🙏 Acknowledgments

- React team for the amazing UI library
- Express.js for the robust backend framework
- MongoDB for the flexible database
- The open-source community for various packages used in this project

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for similar problems

## 🗺 Roadmap

Future enhancements planned:
- [ ] Payment integration (Stripe/PayPal)
- [ ] Direct messaging between clients and freelancers
- [ ] File upload support for project deliverables
- [ ] Rating and review system
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Mobile applications (iOS/Android)

---

Made with ❤️ by the GigFlow team
