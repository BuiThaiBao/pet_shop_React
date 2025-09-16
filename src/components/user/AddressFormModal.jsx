import React, { useEffect, useState } from 'react';
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
						<div className="modal-body">{children}</div>
						{footer && <div className="modal-footer">{footer}</div>}
					</div>
				</div>
			</div>
		</>
	);
};

const AddressFormModal = ({ isOpen, onClose, onSave }) => {
	const { user } = useAuth();
	const [form, setForm] = useState({
		fullName: user?.name || '',
		phone: '',
		addressLine: '',
		city: '',
		district: '',
		ward: '',
		isDefault: false
	});

	useEffect(() => {
		if (isOpen) {
			setForm({
				fullName: user?.name || '',
				phone: '',
				addressLine: '',
				city: '',
				district: '',
				ward: '',
				isDefault: false
			});
		}
	}, [isOpen, user]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave?.(form);
		onClose();
	};

	return (
		<ModalShell
			isOpen={isOpen}
			title="Thêm địa chỉ"
			onClose={onClose}
			footer={(
				<>
					<button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
					<button type="submit" form="addressForm" className="btn btn-primary">Lưu</button>
				</>
			)}
		>
			<form id="addressForm" onSubmit={handleSubmit}>
				<div className="row g-3">
					<div className="col-md-6">
						<label className="form-label">Họ và tên</label>
						<input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} />
					</div>
					<div className="col-md-6">
						<label className="form-label">Số điện thoại</label>
						<input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
					</div>
					<div className="col-12">
						<label className="form-label">Địa chỉ</label>
						<input className="form-control" name="addressLine" value={form.addressLine} onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label className="form-label">Tỉnh/Thành</label>
						<input className="form-control" name="city" value={form.city} onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label className="form-label">Quận/Huyện</label>
						<input className="form-control" name="district" value={form.district} onChange={handleChange} />
					</div>
					<div className="col-md-4">
						<label className="form-label">Phường/Xã</label>
						<input className="form-control" name="ward" value={form.ward} onChange={handleChange} />
					</div>
					<div className="col-12 form-check mt-2">
						<input className="form-check-input" type="checkbox" id="isDefault" name="isDefault" checked={form.isDefault} onChange={handleChange} />
						<label htmlFor="isDefault" className="form-check-label">Đặt làm địa chỉ mặc định</label>
					</div>
				</div>
			</form>
		</ModalShell>
	);
};

export default AddressFormModal;
