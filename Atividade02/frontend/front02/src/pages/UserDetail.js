import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { userService } from '../services';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = userService.getCurrentUser();

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getById(id);
      setUser(data.user);
    } catch (err) {
      setError('Erro ao carregar usuário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Usuário não encontrado</div>;

  return (
    <div className="user-detail">
      <div className="header">
        <Link to="/users" className="btn btn-outline">
          ← Voltar para Lista
        </Link>
        <div className="actions">
          <Link 
            to={`/users/edit/${user.id}`} 
            className="btn btn-secondary"
          >
            Editar Usuário
          </Link>
        </div>
      </div>

      <div className="user-info">
        <div className="user-header-detail">
          <h1>{user.name}</h1>
          <span className={`role-badge ${user.role}`}>
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </span>
        </div>
        
        <div className="user-details">
          <div className="detail-item">
            <strong>ID:</strong> {user.id}
          </div>
          
          <div className="detail-item">
            <strong>Nome:</strong> {user.name}
          </div>
          
          <div className="detail-item">
            <strong>Email:</strong> {user.email}
          </div>
          
          <div className="detail-item">
            <strong>Tipo de Usuário:</strong> 
            <span className={`role-text ${user.role}`}>
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </span>
          </div>

          {user.id === currentUser.id && (
            <div className="detail-item current-user">
              <strong>Status:</strong> 
              <span className="current-user-badge">Usuário Atual</span>
            </div>
          )}
        </div>

        {/* Informações adicionais para administradores */}
        {user.role === 'admin' && (
          <div className="admin-info">
            <h3>Permissões de Administrador</h3>
            <ul>
              <li>✅ Gerenciar produtos</li>
              <li>✅ Gerenciar usuários</li>
              <li>✅ Editar configurações do sistema</li>
              <li>✅ Visualizar relatórios</li>
            </ul>
          </div>
        )}

        {/* Ações administrativas */}
        {currentUser.role === 'admin' && user.id !== currentUser.id && (
          <div className="admin-actions">
            <h3>Ações Administrativas</h3>
            <div className="action-buttons">
              <button 
                className="btn btn-warning"
                onClick={() => {
                  const newRole = user.role === 'admin' ? 'user' : 'admin';
                  if (window.confirm(`Alterar tipo de usuário para ${newRole === 'admin' ? 'Administrador' : 'Usuário'}?`)) {
                    // Implementar mudança de role
                    alert('Funcionalidade será implementada');
                  }
                }}
              >
                {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;