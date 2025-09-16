import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartSummary = () => {
  const { getTotalPrice } = useCart();
  const subtotal = getTotalPrice();
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="card">
      <div className="card-body">
        <h5>Tóm tắt đơn hàng</h5>
        <div className="d-flex justify-content-between mb-2">
          <span>Tạm tính:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Phí vận chuyển:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Tổng cộng:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary w-100 mt-3">Thanh toán</Link>
        <Link to="/products" className="btn btn-outline-primary w-100 mt-2">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
};

export default CartSummary;