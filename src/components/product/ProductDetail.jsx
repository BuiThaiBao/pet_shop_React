import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const mockVariants = [
  { key: 'small', label: 'Nhỏ (20-24 cm)', priceDelta: 0 },
  { key: 'medium', label: 'Trung (24-28 cm)', priceDelta: 2 },
  { key: 'large', label: 'Lớn (28-32 cm)', priceDelta: 4 }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const product = useMemo(() => products.find((p) => String(p.id) === String(id)), [id]);

  const [variant, setVariant] = useState(mockVariants[0].key);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container page-content">
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <div>Không tìm thấy sản phẩm.</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/products')}>Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  const activeVariant = mockVariants.find((v) => v.key === variant) || mockVariants[0];
  const finalPrice = (product.price + activeVariant.priceDelta) * quantity;

  const handleAddToCart = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'warning');
      return;
    }
    addItem({ ...product, variant, quantity, price: product.price + activeVariant.priceDelta });
    showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
  };

  return (
    <div className="container page-content">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card">
            <img
              src={product.image}
              alt={product.name}
              className="card-img-top rounded-4"
              style={{ width: '100%', height: '480px', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="fw-semibold mb-2">Danh mục: {product.category}</div>
          <h2 className="mb-2">{product.name}</h2>
          <div className="mb-3">{'★'.repeat(Math.floor(product.rating))} <span className="text-muted">({product.rating})</span></div>
          <div className="h4 text-primary mb-3">${(product.price + activeVariant.priceDelta).toFixed(2)}</div>
          <div className="mb-3">
            <div className="fw-semibold mb-1 text-success">Còn hàng</div>
          </div>
          <div className="mb-3">
            <div className="fw-semibold mb-1">Mô tả</div>
            <p className="text-muted mb-0">{product.description}</p>
          </div>

          <div className="mb-3">
            <div className="fw-semibold mb-1">Chọn phiên bản</div>
            <select className="form-select" value={variant} onChange={(e) => setVariant(e.target.value)}>
              {mockVariants.map((v) => (
                <option key={v.key} value={v.key}>{v.label} {v.priceDelta ? `+ $${v.priceDelta}` : ''}</option>
              ))}
            </select>
          </div>

          <div className="d-flex align-items-center mb-3">
            <div className="me-3">Số lượng</div>
            <div className="input-group" style={{ width: 130 }}>
              <button className="btn btn-outline-secondary" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <input className="form-control text-center" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))} />
              <button className="btn btn-outline-secondary" onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button className="btn btn-primary" onClick={handleAddToCart}><i className="fas fa-cart-plus me-1"></i>Thêm vào giỏ</button>
            <Link className="btn btn-outline-secondary" to="/products">Tiếp tục mua sắm</Link>
          </div>

          <div className="text-muted">Tổng tạm tính: <span className="fw-bold">${finalPrice.toFixed(2)}</span></div>
        </div>
      </div>

      <hr className="my-5" />
      <h4 className="mb-3">Đánh giá khách hàng</h4>
      <div className="text-muted">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</div>
    </div>
  );
};

export default ProductDetail;
