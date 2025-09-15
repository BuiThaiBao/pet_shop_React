import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'warning');
      return;
    }
    
    addItem(product);
    showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card product-card position-relative h-100">
        {product.featured && <div className="featured-badge">Featured</div>}
        <img src={product.image} className="card-img-top" alt={product.name} />
        <div className="card-body d-flex flex-column">
          <div className="rating mb-2">
            {'★'.repeat(Math.floor(product.rating))} ({product.rating})
          </div>
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted flex-grow-1">{product.description}</p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div className="price fw-bold">${product.price}</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
              <i className="fas fa-cart-plus"></i> Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;