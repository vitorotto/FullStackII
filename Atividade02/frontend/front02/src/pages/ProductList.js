import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    moreExpensive: '',
    moreCheaper: '',
    quant: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.products);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await productService.filter(filters);
      setProducts(data.products);
    } catch (err) {
      setError('Erro ao filtrar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${productName}"?`)) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p.id !== id));
        alert('Produto deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar produto');
        console.error(err);
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      moreExpensive: '',
      moreCheaper: '',
      quant: ''
    });
    loadProducts();
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="header">
        <h1>Lista de Produtos</h1>
        <Link to="/products/new" className="btn btn-primary">
          Adicionar Produto
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters">
        <h3>Filtros</h3>
        <form onSubmit={handleFilter} className="filter-form">
          <div className="filter-row">
            <input
              type="text"
              placeholder="Nome do produto"
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Preço mínimo"
              value={filters.moreExpensive}
              onChange={(e) => setFilters({...filters, moreExpensive: e.target.value})}
            />
            <input
              type="number"
              placeholder="Preço máximo"
              value={filters.moreCheaper}
              onChange={(e) => setFilters({...filters, moreCheaper: e.target.value})}
            />
            <input
              type="number"
              placeholder="Quantidade máxima"
              value={filters.quant}
              onChange={(e) => setFilters({...filters, quant: e.target.value})}
            />
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn btn-secondary">Filtrar</button>
            <button type="button" onClick={resetFilters} className="btn btn-outline">
              Limpar Filtros
            </button>
          </div>
        </form>
      </div>

      {/* Lista de produtos */}
      <div className="products-grid">
        {products.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">R$ {product.price}</p>
              <p className="quantity">Quantidade: {product.qnt}</p>
              {product.description && (
                <p className="description">{product.description}</p>
              )}
              <div className="product-actions">
                <Link 
                  to={`/products/${product.id}`} 
                  className="btn btn-sm btn-outline"
                >
                  Ver Detalhes
                </Link>
                <Link 
                  to={`/products/edit/${product.id}`} 
                  className="btn btn-sm btn-secondary"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(product.id, product.name)}
                  className="btn btn-sm btn-danger"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;