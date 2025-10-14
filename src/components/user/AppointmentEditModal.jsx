import React, { useEffect, useState } from 'react';
import { servicesAPI } from '../../api/services';
import { useToast } from '../../context/ToastContext';

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
	const { showToast } = useToast();
	const [form, setForm] = useState({
		serviceType: '',
		petType: '',
		petName: '',
		appointmentDate: '',
		appointmentTime: '',
		notes: ''
	});
	const [services, setServices] = useState([]);

	useEffect(() => {
		if (isOpen) {
			servicesAPI.getActiveServices().then(setServices);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && initial && services.length > 0) {
			let mappedServiceType = '';
			if (initial.serviceType) mappedServiceType = initial.serviceType;
			else if (initial.serviceName) {
				// Tìm service có title trùng với serviceName
				const found = services.find(s => s.title === initial.serviceName);
				if (found) mappedServiceType = found.key;
			}
			let mappedPetType = '';
			if (initial.petType) mappedPetType = initial.petType;
			else if (initial.speciePet) {
				const specie = initial.speciePet.trim().toLowerCase();
				if (specie === 'chó') mappedPetType = 'dog';
				else if (specie === 'mèo') mappedPetType = 'cat';
				else if (specie === 'chim') mappedPetType = 'bird';
				else mappedPetType = 'other';
			}
			setForm({
				serviceType: mappedServiceType,
				petType: mappedPetType,
				petName: initial.petName || initial.namePet || '',
				appointmentDate: initial.appointmentDate || (initial.appoinmentStart ? initial.appoinmentStart.slice(0,10) : ''),
				appointmentTime: initial.appointmentTime || (initial.appoinmentStart ? initial.appoinmentStart.slice(11,16) : ''),
				notes: initial.notes || ''
			});
		}
	}, [isOpen, initial, services]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('auth_token');
			const selectedService = services.find(s => s.key === form.serviceType);
			const serviceId = selectedService ? selectedService.id : null;
			const payload = {
				id: initial.id,
				serviceId: serviceId,
				namePet: form.petName,
				speciePet:
					form.petType === 'dog' ? 'Chó' :
					form.petType === 'cat' ? 'Mèo' :
					form.petType === 'bird' ? 'Chim' :
					'Khác',
				appoinmentStart: `${form.appointmentDate}T${form.appointmentTime}:00`,
				notes: form.notes
			};
			const response = await servicesAPI.updateAppointment(payload, token);
			if (response.success) {
				showToast('Cập nhật dịch vụ thành công', 'success');
				onSave?.(form);
				onClose();
			} else {
				showToast(response.message || 'Có lỗi xảy ra', 'error');
			}
		} catch (error) {
			console.error('Error updating appointment:', error);
			showToast(error.message || 'Có lỗi xảy ra khi cập nhật', 'error');
		}
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
						{services.map(s => (
							<option key={s.key} value={s.key}>{s.title}</option>
						))}
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
				<div className="mb-3">
					<label className="form-label">Ghi chú</label>
					<textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Ghi chú thêm (nếu có)" />
				</div>
			</form>
		</ModalShell>
	);
};

export default AppointmentEditModal;
