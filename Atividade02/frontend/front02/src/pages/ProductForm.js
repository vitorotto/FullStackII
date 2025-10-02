import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    qnt: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id, isEditing]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setFormData({
        name: data.product.name || '',
        price: data.product.price || '',
        qnt: data.product.qnt || '',
        description: data.product.description || '',
        category: data.product.category || ''
      });
    } catch (err) {
      setError('Erro ao carregar produto');
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
    if (!formData.name || !formData.price || !formData.qnt) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await productService.update(id, formData);
        alert('Produto atualizado com sucesso!');
      } else {
        await productService.create(formData);
        alert('Produto criado com sucesso!');
      }
      
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <div className="header">
        <h1>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
        <button 
          onClick={() => navigate('/products')} 
          className="btn btn-outline"
        >
          Cancelar
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Nome do Produto *</label>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Preço *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="qnt">Quantidade *</label>
            <input
              type="number"
              id="qnt"
              name="qnt"
              value={formData.qnt}
              onChange={handleChange}
              min="0"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')} Produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;