import React, { useMemo, useState, useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import { categoriesApi } from '../api/categories';

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const pageSize = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCategories();
        if (response.success && response.result) {
          setCategories(response.result);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage]);

  const goTo = (page) => {
    const p = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => goTo(currentPage - 1);
  const next = () => goTo(currentPage + 1);

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
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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
                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, products.length)} trong {products.length} sản phẩm
              </span>
              <select className="form-select" style={{width: 'auto'}}>
                <option>Sắp xếp theo giá: Thấp đến cao</option>
                <option>Sắp xếp theo giá: Cao đến thấp</option>
                <option>Sản phẩm mới nhất</option>
                <option>Bán chạy nhất</option>
              </select>
            </div>
            <div className="row">
              {paginated.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <nav aria-label="Pagination" className="mt-4 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={prev}><i class="fa-solid fa-less-than fa-xs"></i></button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => goTo(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={next}><i class="fa-solid fa-greater-than fa-xs"></i></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;