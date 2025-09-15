import React from 'react';

const ProductFilter = ({ filters, onFilterChange }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="sidebar">
      <h5>Lọc sản phẩm</h5>
      <div className="mb-3">
        <label className="form-label">Danh mục</label>
        <select 
          className="form-select" 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
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
            <input 
              type="number" 
              className="form-control" 
              placeholder="Từ" 
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-6">
            <input 
              type="number" 
              className="form-control" 
              placeholder="Đến" 
              value={filters.priceTo}
              onChange={(e) => handleFilterChange('priceTo', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
      <button className="btn btn-primary w-100">
        Lọc
      </button>
    </div>
  );
};

export default ProductFilter;