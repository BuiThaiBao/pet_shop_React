import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const navigate = useNavigate();
  // Pick up to 4 products for the featured section
  const featuredProducts = (products.filter(p => p.featured).slice(0, 4).length ? products.filter(p => p.featured).slice(0, 4) : products.slice(0, 4));

  const services = [
    {
      key: 'grooming',
      icon: 'fas fa-heart',
      title: 'Tắm rửa & cắt tỉa lông',
      description: 'Chăm sóc lông toàn diện: tắm, cắt tỉa, vệ sinh tai...',
      price: 65.0
    },
    {
      key: 'veterinary',
      icon: 'fas fa-stethoscope',
      title: 'Khám sức khỏe thú y',
      description: 'Khám tổng quát bởi bác sĩ thú y giàu kinh nghiệm',
      price: 85.0
    },
    {
      key: 'training',
      icon: 'fas fa-clock',
      title: 'Huấn luyện thú cưng',
      description: 'Huấn luyện 1-1 giúp cải thiện hành vi',
      price: 45.0
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h1 className="display-6 fw-bold mb-3">Everything Your Pet Needs & More</h1>
              <p className="mb-4">Premium quality pet products, expert care services, and loving homes for rescue pets.</p>
              <Link to="/products" className="btn btn-light me-2">Shop Now</Link>
              <Link to="/services" className="btn btn-outline-light">Book Service</Link>
            </div>
            <div className="col-lg-6">
              <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
                <div className="carousel-inner rounded-4" style={{ height: '360px', overflow: 'hidden' }}>
                  <div className="carousel-item active" data-bs-interval="2000">
                    <img
                      src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Hero 1"
                      className="d-block w-100"
                      style={{ height: '360px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="carousel-item" data-bs-interval="2000">
                    <img
                      src="https://byvn.net/31Ev"
                      alt="Hero 2"
                      className="d-block w-100"
                      style={{ height: '360px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="carousel-item" data-bs-interval="2000">
                    <img
                      src="https://byvn.net/ZK6d"
                      alt="Hero 3"
                      className="d-block w-100"
                      style={{ height: '360px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Sản phẩm nổi bật</h2>
            <div className="text-muted">Sản phẩm được yêu thích bởi thú cưng và chủ nuôi</div>
          </div>
          <Link to="/products" className="text-decoration-none">Xem tất cả sản phẩm <i class="fa-solid fa-arrow-right"></i></Link>
        </div>
        <div className="row">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Services teaser */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Dịch vụ</h2>
          <Link to="/services" className="text-decoration-none">Xem tất cả dịch vụ <i class="fa-solid fa-arrow-right"></i></Link>
        </div>
        <div className="row">
          {services.map((s) => (
            <div className="col-md-4 mb-4" key={s.key}>
              <div className="card h-100 text-center">
                <div className="card-body d-flex flex-column">
                  <i className={`${s.icon} fa-2x text-warning mb-3`}></i>
                  <h5 className="mb-2">{s.title}</h5>
                  <p className="text-muted flex-grow-1">{s.description}</p>
                  <div className="fw-bold mb-3">${s.price.toFixed(2)}</div>
                  <button className="btn btn-primary" onClick={() => navigate('/services')}>Đặt lịch</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;