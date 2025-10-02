
import { Link } from 'react-router-dom';
import { userService } from '../services';

const Home = () => {
  const isAuthenticated = userService.isAuthenticated();
  const isAdmin = userService.isAdmin();
  const currentUser = userService.getCurrentUser();

  return (
    <div className="home">
      <h1>Bem-vindo ao Sistema de Produtos</h1>
      {isAuthenticated && (
        <p>Olá, <strong>{currentUser.name}</strong>! Gerencie seus produtos de forma fácil e eficiente.</p>
      )}
      {!isAuthenticated && (
        <p>Gerencie seus produtos de forma fácil e eficiente.</p>
      )}
      
      <div className="home-actions">
        <Link to="/products" className="btn btn-primary">Ver Produtos</Link>
        
        {isAuthenticated && (
          <Link to="/products/new" className="btn btn-secondary">Adicionar Produto</Link>
        )}
        
        {isAdmin && (
          <Link to="/users" className="btn btn-danger">Gerenciar Usuários</Link>
        )}
        
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn btn-outline">Fazer Login</Link>
            <Link to="/register" className="btn btn-secondary">Registrar-se</Link>
          </>
        )}
      </div>

      {/* Seção de informações do sistema */}
      <div className="system-info">
        <h2>Funcionalidades do Sistema</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🛍️ Produtos</h3>
            <p>Visualize, crie, edite e delete produtos com filtros avançados.</p>
          </div>
          
          {isAuthenticated && (
            <div className="feature-card">
              <h3>🔐 Autenticação</h3>
              <p>Sistema seguro com controle de acesso e permissões.</p>
            </div>
          )}
          
          {isAdmin && (
            <div className="feature-card">
              <h3>👥 Gerenciar Usuários</h3>
              <p>Controle total sobre usuários, permissões e configurações administrativas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;