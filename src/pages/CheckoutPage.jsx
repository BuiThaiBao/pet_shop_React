import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });
  const [validated, setValidated] = useState(false);
  
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = 5.00;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    if (form.checkValidity()) {
      // Mock order creation
      const orderId = 'ORD' + Math.floor(Math.random() * 1000);
      showToast(`Đặt hàng thành công! Mã đơn hàng: #${orderId}`, 'success');
      clearCart();
      navigate('/orders');
    }
    
    setValidated(true);
  };

  if (!user) {
    return (
      <div className="container page-content">
        <div className="alert alert-warning">
          Vui lòng đăng nhập để tiếp tục thanh toán.
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container page-content">
        <div className="alert alert-info">
          Giỏ hàng của bạn đang trống.
        </div>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <h1 className="mb-4">Thanh toán</h1>
      <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-7">
            <div className="card mb-4">
              <div className="card-body">
                <h5>Thông tin giao hàng</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ghi chú (tùy chọn)</label>
                  <textarea 
                    className="form-control" 
                    rows="2"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5>Phương thức thanh toán</h5>
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Thanh toán bằng thẻ</label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Chuyển khoản ngân hàng</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <h5>Đơn hàng của bạn</h5>
                {items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Tổng cộng:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;