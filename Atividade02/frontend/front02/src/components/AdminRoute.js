import { Navigate } from 'react-router-dom';
import { userService } from '../services';

const AdminRoute = ({ children }) => {
  const isAuthenticated = userService.isAuthenticated();
  const isAdmin = userService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h2>Acesso Negado</h2>
        <p>Você precisa ser um administrador para acessar esta página.</p>
        <a href="/products" className="btn btn-primary">Voltar aos Produtos</a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;