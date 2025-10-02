import { Navigate } from 'react-router-dom';
import { userService } from '../services';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = userService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;