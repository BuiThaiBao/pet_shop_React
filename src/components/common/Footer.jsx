import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="text-warning">
              <i className="fas fa-paw"></i> PawMartHome
            </h5>
            <p>Cửa hàng thú cưng hàng đầu với sản phẩm chất lượng cao và dịch vụ chăm sóc tận tâm.</p>
            <div>
              <a href="#" className="text-white me-3"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 mb-4">
            <h6>Sản phẩm</h6>
            <ul className="list-unstyled">
              <li><Link to="/products?category=food" className="text-white-50">Thức ăn</Link></li>
              <li><Link to="/products?category=toys" className="text-white-50">Đồ chơi</Link></li>
              <li><Link to="/products?category=grooming" className="text-white-50">Chăm sóc</Link></li>
              <li><Link to="/products?category=accessories" className="text-white-50">Phụ kiện</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6 mb-4">
            <h6>Dịch vụ</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white-50">Tắm rửa</a></li>
              <li><a href="#" className="text-white-50">Khám bệnh</a></li>
              <li><a href="#" className="text-white-50">Huấn luyện</a></li>
              <li><a href="#" className="text-white-50">Gửi thú cưng</a></li>
            </ul>
          </div>
          <div className="col-lg-4 mb-4">
            <h6>Liên hệ</h6>
            <p><i className="fas fa-map-marker-alt me-2"></i>123 Đường ABC, Quận 1, TP.HCM</p>
            <p><i className="fas fa-phone me-2"></i>0123 456 789</p>
            <p><i className="fas fa-envelope me-2"></i>info@pawmarthome.com</p>
          </div>
        </div>
        <hr className="text-white-50" />
        <div className="text-center">
          <p>&copy; 2025 PawMartHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;