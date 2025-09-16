import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ModalShell = ({ isOpen, title, onClose, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={onClose}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }}>
        <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            {footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const PetDetailModal = ({ isOpen, pet, onClose, onApply }) => {
  if (!pet) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      title="Chi tiết thú cưng"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
          <button type="button" className="btn btn-primary" onClick={onApply}>Gửi đơn nhận nuôi</button>
        </>
      )}
    >
      <div className="row g-3">
        <div className="col-md-5">
          <img src={pet.image} alt={pet.name} className="img-fluid rounded" />
        </div>
        <div className="col-md-7">
          <h5 className="mb-1">{pet.name}</h5>
          <div className="text-muted mb-2">{pet.type === 'dog' ? 'Chó' : pet.type === 'cat' ? 'Mèo' : 'Chim'} {pet.breed}</div>
          <ul className="list-unstyled mb-3">
            <li><strong>Tuổi:</strong> {pet.age} tuổi</li>
            <li><strong>Kích thước:</strong> {pet.size}</li>
            <li><strong>Giới tính:</strong> {pet.gender === 'male' ? 'Đực' : 'Cái'}</li>
          </ul>
          <p>{pet.description}</p>
          <div>
            {pet.vaccinated && <span className="badge bg-info me-2">Đã tiêm phòng</span>}
            {pet.spayed && <span className="badge bg-secondary">Đã triệt sản</span>}
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export const AdoptionApplicationModal = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    job: '',
    income: '',
    experience: '',
    reason: '',
    conditions: '',
    agree: false
  });

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({ ...prev, fullName: user?.name || prev.fullName }));
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      title="Đơn xin nhận nuôi"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button type="submit" form="adoptionApplicationForm" className="btn btn-primary">Gửi đơn</button>
        </>
      )}
    >
      <form id="adoptionApplicationForm" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Họ và tên *</label>
            <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Số điện thoại *</label>
            <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ *</label>
          <textarea name="address" className="form-control" rows={2} value={form.address} onChange={handleChange} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nghề nghiệp</label>
            <input name="job" className="form-control" value={form.job} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Thu nhập hàng tháng</label>
            <select name="income" className="form-select" value={form.income} onChange={handleChange}>
              <option value="">Chọn mức thu nhập</option>
              <option value="under-10m">Dưới 10 triệu</option>
              <option value="10-20m">10-20 triệu</option>
              <option value="20-30m">20-30 triệu</option>
              <option value="above-30m">Trên 30 triệu</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Bạn đã từng nuôi thú cưng chưa? *</label>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="experience" value="yes" checked={form.experience === 'yes'} onChange={handleChange} required />
            <label className="form-check-label">Có</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="experience" value="no" checked={form.experience === 'no'} onChange={handleChange} required />
            <label className="form-check-label">Không</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Lý do muốn nhận nuôi *</label>
          <textarea name="reason" className="form-control" rows={3} value={form.reason} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Điều kiện chăm sóc</label>
          <textarea name="conditions" className="form-control" rows={3} placeholder="Mô tả không gian sống, thời gian chăm sóc..." value={form.conditions} onChange={handleChange} />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="agreeTermsAdoption" name="agree" checked={form.agree} onChange={handleChange} required />
          <label className="form-check-label" htmlFor="agreeTermsAdoption">Tôi đồng ý với các điều khoản nhận nuôi và cam kết chăm sóc thú cưng tốt nhất</label>
        </div>
      </form>
    </ModalShell>
  );
};
