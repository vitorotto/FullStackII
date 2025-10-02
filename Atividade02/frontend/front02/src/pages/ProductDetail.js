import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productService } from '../services';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data.product);
    } catch (err) {
      setError('Erro ao carregar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Produto não encontrado</div>;

  return (
    <div className="product-detail">
      <div className="header">
        <Link to="/products" className="btn btn-outline">
          ← Voltar para Lista
        </Link>
        <div className="actions">
          <Link 
            to={`/products/edit/${product.id}`} 
            className="btn btn-secondary"
          >
            Editar Produto
          </Link>
        </div>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        
        <div className="product-details">
          <div className="detail-item">
            <strong>ID:</strong> {product.id}
          </div>
          
          <div className="detail-item">
            <strong>Preço:</strong> R$ {product.price}
          </div>
          
          <div className="detail-item">
            <strong>Quantidade:</strong> {product.qnt}
          </div>
          
          {product.description && (
            <div className="detail-item">
              <strong>Descrição:</strong>
              <p>{product.description}</p>
            </div>
          )}
          
          {product.category && (
            <div className="detail-item">
              <strong>Categoria:</strong> {product.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;