import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const currentUser = userService.getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data.users);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, userName) => {
    if (id === currentUser.id) {
      alert('Você não pode deletar seu próprio usuário!');
      return;
    }

    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userName}"?`)) {
      try {
        await userService.delete(id);
        setUsers(users.filter(u => u.id !== id));
        alert('Usuário deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar usuário');
        console.error(err);
      }
    }
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesName = user.name.toLowerCase().includes(filter.toLowerCase()) ||
                       user.email.toLowerCase().includes(filter.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesName && matchesRole;
  });

  if (loading) return <div className="loading">Carregando usuários...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h1>Gerenciar Usuários</h1>
        <div className="header-actions">
          <Link to="/register" className="btn btn-primary">
            Novo Usuário
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters">
        <h3>Filtros</h3>
        <div className="filter-form">
          <div className="filter-row">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os tipos</option>
              <option value="admin">Administradores</option>
              <option value="user">Usuários</option>
            </select>
            <button 
              onClick={() => {
                setFilter('');
                setRoleFilter('');
              }}
              className="btn btn-outline"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="users-grid">
        {filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <h3>{user.name}</h3>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
              
              <div className="user-info">
                <p className="email">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="user-id">
                  <strong>ID:</strong> {user.id}
                </p>
              </div>

              <div className="user-actions">
                <Link 
                  to={`/users/${user.id}`} 
                  className="btn btn-sm btn-outline"
                >
                  Ver Detalhes
                </Link>
                <Link 
                  to={`/users/edit/${user.id}`} 
                  className="btn btn-sm btn-secondary"
                >
                  Editar
                </Link>
                {user.id !== currentUser.id && (
                  <button 
                    onClick={() => handleDelete(user.id, user.name)}
                    className="btn btn-sm btn-danger"
                  >
                    Deletar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estatísticas */}
      <div className="user-stats">
        <div className="stat-card">
          <h4>Total de Usuários</h4>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h4>Administradores</h4>
          <p className="stat-number">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="stat-card">
          <h4>Usuários Comuns</h4>
          <p className="stat-number">
            {users.filter(u => u.role === 'user').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserList;