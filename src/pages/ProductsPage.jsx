import React from 'react';
import { products } from '../data/products';
import ProductCard from '../components/product/ProductCard';

const ProductsPage = () => {
  console.log('ProductsPage rendered, products:', products);
  
  return (
    <div className="page" id="products">
      <div className="container page-content">
        <h1 className="mb-4">Sản phẩm</h1>
        <p className="text-muted mb-4">Tìm sản phẩm hoàn hảo cho thú cưng yêu quý của bạn</p>
        
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="sidebar">
              <h5>Lọc sản phẩm</h5>
              <div className="mb-3">
                <label className="form-label">Danh mục</label>
                <select className="form-select">
                  <option value="">Tất cả danh mục</option>
                  <option value="food">Thức ăn</option>
                  <option value="toys">Đồ chơi</option>
                  <option value="grooming">Chăm sóc</option>
                  <option value="accessories">Phụ kiện</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Khoảng giá</label>
                <div className="row">
                  <div className="col-6">
                    <input type="number" className="form-control" placeholder="Từ" />
                  </div>
                  <div className="col-6">
                    <input type="number" className="form-control" placeholder="Đến" />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary w-100">
                Lọc
              </button>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Hiển thị {products.length} sản phẩm
              </span>
              <select className="form-select" style={{width: 'auto'}}>
                <option>Sắp xếp theo giá: Thấp đến cao</option>
                <option>Sắp xếp theo giá: Cao đến thấp</option>
                <option>Sản phẩm mới nhất</option>
                <option>Bán chạy nhất</option>
              </select>
            </div>
            <div className="row">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;