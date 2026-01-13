import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { checkAuth } from './store/authSlice';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import GigDetailsPage from './pages/GigDetailsPage';

// Auth checker component
function AuthChecker({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app load
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
}

function AppRoutes() {
  return (
    <AuthChecker>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="post-job"
              element={
                <ProtectedRoute>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="gig/:id"
              element={
                <ProtectedRoute>
                  <GigDetailsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthChecker>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
