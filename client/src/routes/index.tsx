import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <Home />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);
