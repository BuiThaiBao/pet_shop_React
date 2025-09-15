import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div className="row">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className="col-lg-4 col-md-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))
      ) : (
        <div className="col-12">
          <div className="text-center py-5">
            <h4>Không tìm thấy sản phẩm nào</h4>
            <p className="text-muted">Hãy thử thay đổi bộ lọc của bạn</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
