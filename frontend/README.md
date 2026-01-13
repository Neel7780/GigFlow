# GigFlow Frontend

The frontend application for GigFlow - a modern freelance marketplace platform built with React and Vite.

## 🛠 Tech Stack

- **React 19.2.0** - Modern UI library with latest features
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
src/
├── api/              # API client and service functions
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable React components
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── PostJobPage.jsx
│   ├── GigDetailsPage.jsx
│   └── MyBidsPage.jsx
├── store/            # Redux store and slices
│   └── authSlice.js
├── App.jsx           # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:8080
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 🎨 Features

### User Interface
- Responsive design that works on all devices
- Modern, clean interface with Tailwind CSS
- Smooth animations with Framer Motion
- Intuitive navigation and user flows

### Pages
- **Landing Page**: Introduction to the platform
- **Login/Register**: User authentication
- **Dashboard**: Browse available gigs and opportunities
- **Post Job**: Create new job postings (clients only)
- **Gig Details**: View detailed information and submit bids
- **My Bids**: Track all submitted bids and their status

### State Management
- Redux Toolkit for global state
- Authentication state management
- Persistent login sessions
- Optimistic UI updates

## 🔐 Authentication

The application uses JWT-based authentication:
- Tokens stored in HTTP-only cookies (handled by backend)
- Protected routes with `ProtectedRoute` component
- Automatic authentication check on app load
- Seamless logout functionality

## 📡 API Integration

All API calls are centralized in the `src/api` directory:
- Base URL configuration via environment variables
- Axios interceptors for authentication
- Consistent error handling
- Request/response transformations

## 🎭 Component Architecture

### Layout Component
Provides consistent layout across all pages with header and navigation.

### Protected Route
HOC that ensures only authenticated users can access certain pages.

### Page Components
Each page is a self-contained component with its own logic and styles.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚢 Deployment

### Vercel (Recommended)

The project includes `vercel.json` configuration for easy deployment:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Other Platforms

Build the project and deploy the `dist` folder to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

See the main [GigFlow README](../README.md) for contribution guidelines.

## 📄 License

This project is part of GigFlow and follows the same ISC License.
