import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = userService.isAuthenticated();
  const isAdmin = userService.isAdmin();

  const handleLogout = () => {
    userService.logout();
    navigate('/');
    alert('Logout realizado com sucesso!');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Sistema de Produtos
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            Produtos
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/products/new" className="nav-link">
                Novo Produto
              </Link>
              {isAdmin && (
                <Link to="/users" className="nav-link admin-link">
                  Usuários
                </Link>
              )}
              <button onClick={handleLogout} className="nav-link nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;