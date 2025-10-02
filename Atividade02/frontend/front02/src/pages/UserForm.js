import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const currentUser = userService.getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(!isEditing);

  useEffect(() => {
    if (isEditing) {
      loadUser();
    }
  }, [id, isEditing]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getById(id);
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        password: '',
        confirmPassword: '',
        role: data.user.role || 'user'
      });
    } catch (err) {
      setError('Erro ao carregar usuário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validar senhas se estiver criando ou alterando senha
    if (showPasswordFields) {
      if (!formData.password) {
        setError('Por favor, preencha a senha');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    // Verificar permissões para alteração de role
    if (isEditing && formData.role !== currentUser.role && currentUser.role !== 'admin') {
      setError('Você não tem permissão para alterar o tipo de usuário');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar dados para envio
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Incluir senha apenas se foi preenchida
      if (showPasswordFields && formData.password) {
        dataToSend.password = formData.password;
      }

      if (isEditing) {
        await userService.update(id, dataToSend);
        alert('Usuário atualizado com sucesso!');
      } else {
        await userService.register(dataToSend);
        alert('Usuário criado com sucesso!');
      }
      
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      <div className="header">
        <h1>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h1>
        <button 
          onClick={() => navigate('/users')} 
          className="btn btn-outline"
        >
          Cancelar
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Nome Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* Tipo de usuário - apenas admins podem alterar */}
        {currentUser.role === 'admin' && (
          <div className="form-group">
            <label htmlFor="role">Tipo de Usuário</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
            <small className="form-help">
              Apenas administradores podem gerenciar usuários e produtos
            </small>
          </div>
        )}

        {/* Campos de senha */}
        {isEditing && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={showPasswordFields}
                onChange={(e) => setShowPasswordFields(e.target.checked)}
              />
              Alterar senha
            </label>
          </div>
        )}

        {showPasswordFields && (
          <>
            <div className="form-group">
              <label htmlFor="password">
                {isEditing ? 'Nova Senha' : 'Senha'} *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing || showPasswordFields}
                disabled={loading}
                minLength="6"
              />
              <small className="form-help">
                Mínimo de 6 caracteres
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmar {isEditing ? 'Nova Senha' : 'Senha'} *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isEditing || showPasswordFields}
                disabled={loading}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')} Usuário
          </button>
        </div>
      </form>

      {/* Informações sobre o usuário atual */}
      {isEditing && id === currentUser.id && (
        <div className="current-user-warning">
          <h3>⚠️ Editando seu próprio perfil</h3>
          <p>
            Você está editando suas próprias informações. 
            {currentUser.role === 'admin' && ' Como administrador, você pode alterar seu tipo de usuário, mas isso pode afetar suas permissões.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserForm;