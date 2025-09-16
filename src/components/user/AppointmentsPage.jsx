import React from 'react';

const AppointmentsPage = () => {
  const sampleAppointments = [
    {
      id: 'APT001',
      service: 'Tắm rửa & cắt tỉa lông',
      pet: 'Buddy (Chó)',
      datetime: '25/09/2025 10:00',
      status: 'Đã đặt',
      statusClass: 'bg-warning'
    },
    {
      id: 'APT002',
      service: 'Khám sức khỏe',
      pet: 'Mimi (Mèo)',
      datetime: '20/09/2025 14:00',
      status: 'Hoàn thành',
      statusClass: 'bg-success'
    }
  ];

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
                {sampleAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>#{appointment.id}</td>
                    <td>{appointment.service}</td>
                    <td>{appointment.pet}</td>
                    <td>{appointment.datetime}</td>
                    <td>
                      <span className={`badge ${appointment.statusClass}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === 'Đã đặt' ? (
                        <>
                          <button className="btn btn-sm btn-outline-primary me-1">Sửa</button>
                          <button className="btn btn-sm btn-outline-danger">Hủy</button>
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
    </div>
  );
};

export default AppointmentsPage;