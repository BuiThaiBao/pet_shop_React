import React, { useEffect, useState } from 'react';

const ModalShell = ({ isOpen, title, onClose, children, footer }) => {
	useEffect(() => {
		if (isOpen) document.body.classList.add('modal-open'); else document.body.classList.remove('modal-open');
		return () => document.body.classList.remove('modal-open');
	}, [isOpen]);
	if (!isOpen) return null;
	return (
		<>
			<div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={onClose}></div>
			<div className="modal fade show" style={{ display: 'block', zIndex: 1055 }}>
				<div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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

const AppointmentEditModal = ({ isOpen, onClose, initial, onSave }) => {
	const [form, setForm] = useState({
		serviceType: '',
		petType: '',
		petName: '',
		appointmentDate: '',
		appointmentTime: ''
	});

	useEffect(() => {
		if (isOpen) {
			setForm({
				serviceType: initial?.serviceType || '',
				petType: initial?.petType || '',
				petName: initial?.petName || '',
				appointmentDate: initial?.appointmentDate || '',
				appointmentTime: initial?.appointmentTime || ''
			});
		}
	}, [isOpen, initial]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave?.(form);
		onClose();
	};

	return (
		<ModalShell
			isOpen={isOpen}
			title="Sửa lịch hẹn"
			onClose={onClose}
			footer={(
				<>
					<button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
					<button type="submit" form="appointmentEditForm" className="btn btn-primary">Lưu</button>
				</>
			)}
		>
			<form id="appointmentEditForm" onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">Loại dịch vụ</label>
					<select className="form-select" name="serviceType" value={form.serviceType} onChange={handleChange}>
						<option value="">Chọn dịch vụ</option>
						<option value="grooming">Tắm rửa & cắt tỉa lông</option>
						<option value="veterinary">Khám sức khỏe</option>
						<option value="training">Huấn luyện thú cưng</option>
						<option value="boarding">Gửi thú cưng</option>
					</select>
				</div>
				<div className="row">
					<div className="col-md-6 mb-3">
						<label className="form-label">Loại thú cưng</label>
						<select className="form-select" name="petType" value={form.petType} onChange={handleChange}>
							<option value="">Chọn loại thú cưng</option>
							<option value="dog">Chó</option>
							<option value="cat">Mèo</option>
							<option value="bird">Chim</option>
							<option value="other">Khác</option>
						</select>
					</div>
					<div className="col-md-6 mb-3">
						<label className="form-label">Tên thú cưng</label>
						<input className="form-control" name="petName" value={form.petName} onChange={handleChange} />
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 mb-3">
						<label className="form-label">Ngày hẹn</label>
						<input type="date" className="form-control" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} />
					</div>
					<div className="col-md-6 mb-3">
						<label className="form-label">Giờ hẹn</label>
						<select className="form-select" name="appointmentTime" value={form.appointmentTime} onChange={handleChange}>
							<option value="">Chọn giờ</option>
							<option value="08:00">08:00</option>
							<option value="09:00">09:00</option>
							<option value="10:00">10:00</option>
							<option value="11:00">11:00</option>
							<option value="14:00">14:00</option>
							<option value="15:00">15:00</option>
							<option value="16:00">16:00</option>
							<option value="17:00">17:00</option>
						</select>
					</div>
				</div>
			</form>
		</ModalShell>
	);
};

export default AppointmentEditModal;
