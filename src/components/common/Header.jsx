import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-paw text-warning"></i> 
          <span className="text-warning">PawMart</span><span>Home</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Sản phẩm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Dịch vụ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adoption">Nhận nuôi</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <form className="input-group me-3" style={{width: '300px'}} onSubmit={handleSearch}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>
            
            <Link to="/cart" className="btn btn-outline-primary me-2 position-relative">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-badge">{getTotalItems()}</span>
            </Link>
            
            {user ? (
              <div className="dropdown">
                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user"></i> {user.name}
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Đơn hàng</Link></li>
                  <li><Link className="dropdown-item" to="/appointments">Lịch hẹn</Link></li>
                  <li><Link className="dropdown-item" to="/adoption-requests">Đơn nhận nuôi</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-primary me-2">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;