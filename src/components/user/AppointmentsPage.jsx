import React, { useState } from 'react';
import AppointmentEditModal from './AppointmentEditModal';

const AppointmentsPage = () => {
  const [items, setItems] = useState([
    {
      id: 'APT001',
      serviceType: 'grooming',
      service: 'Tắm rửa & cắt tỉa lông',
      petType: 'dog',
      pet: 'Buddy (Chó)',
      petName: 'Buddy',
      appointmentDate: '2025-09-25',
      appointmentTime: '10:00',
      status: 'Đã đặt',
      statusClass: 'bg-warning'
    },
    {
      id: 'APT002',
      serviceType: 'veterinary',
      service: 'Khám sức khỏe',
      petType: 'cat',
      pet: 'Mimi (Mèo)',
      petName: 'Mimi',
      appointmentDate: '2025-09-20',
      appointmentTime: '14:00',
      status: 'Hoàn thành',
      statusClass: 'bg-success'
    }
  ]);

  const [editing, setEditing] = useState(null);

  const openEdit = (apt) => setEditing(apt);
  const closeEdit = () => setEditing(null);

  const handleSave = (form) => {
    setItems((prev) => prev.map((a) => a.id === editing.id ? {
      ...a,
      ...form,
      service: form.serviceType === 'grooming' ? 'Tắm rửa & cắt tỉa lông' : form.serviceType === 'veterinary' ? 'Khám sức khỏe' : form.serviceType === 'training' ? 'Huấn luyện thú cưng' : 'Gửi thú cưng',
      pet: `${form.petName || a.petName} (${form.petType === 'dog' ? 'Chó' : form.petType === 'cat' ? 'Mèo' : form.petType === 'bird' ? 'Chim' : 'Khác'})`
    } : a));
  };

  const handleCancel = (id) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="container page-content">
      <h1 className="mb-4">Lịch hẹn của tôi</h1>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã lịch hẹn</th>
                  <th>Dịch vụ</th>
                  <th>Thú cưng</th>
                  <th>Ngày giờ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(appointment => (
                  <tr key={appointment.id}>
                    <td>#{appointment.id}</td>
                    <td>{appointment.service}</td>
                    <td>{appointment.pet}</td>
                    <td>{new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`).toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${appointment.statusClass}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === 'Đã đặt' ? (
                        <>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(appointment)}>Sửa</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(appointment.id)}>Hủy</button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-primary">Đánh giá</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AppointmentEditModal
        isOpen={Boolean(editing)}
        onClose={closeEdit}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  );
};

export default AppointmentsPage;