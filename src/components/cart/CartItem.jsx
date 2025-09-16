import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    const newQty = item.quantity - 1;
    updateQuantity(item.id, newQty);
  };

  const handleIncrease = () => {
    const newQty = item.quantity + 1;
    updateQuantity(item.id, newQty);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) return;
    updateQuantity(item.id, value);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="d-flex align-items-center justify-content-between border-bottom py-3">
      <div className="d-flex align-items-center">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 64, height: 64, objectFit: 'cover' }}
            className="me-3 rounded"
          />
        )}
        <div>
          <div className="fw-semibold">{item.name}</div>
          <div className="text-muted small">${item.price?.toFixed(2)}</div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <button className="btn btn-outline-secondary btn-sm" onClick={handleDecrease} disabled={item.quantity <= 1}>
          −
        </button>
        <input
          type="number"
          min="1"
          className="form-control form-control-sm mx-2"
          style={{ width: 70 }}
          value={item.quantity}
          onChange={handleChange}
        />
        <button className="btn btn-outline-secondary btn-sm" onClick={handleIncrease}>+
        </button>
      </div>

      <div className="text-end" style={{ minWidth: 100 }}>
        <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
        <button className="btn btn-link text-danger p-0 mt-1" onClick={handleRemove}>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;
