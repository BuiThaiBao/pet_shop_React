import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Everything Your Pet Needs & More</h1>
              <p className="lead mb-4">Premium quality pet products, expert care services, and loving homes for rescue pets.</p>
              <Link to="/products" className="btn btn-light btn-lg me-3">Shop Now</Link>
              <Link to="/services" className="btn btn-outline-light btn-lg">Book Service</Link>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="French Bulldog" 
                className="img-fluid rounded-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container my-5">
        <h2 className="text-center mb-5">Sản phẩm nổi bật</h2>
        <div className="row">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;