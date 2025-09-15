import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppointment } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';

const ServicesPage = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    petType: '',
    appointmentDate: '',
    appointmentTime: '',
    petName: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { addAppointment } = useAppointment();
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
    }
    
    if (!formData.petType) {
      newErrors.petType = 'Vui lòng chọn loại thú cưng';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Ngày hẹn không thể là ngày trong quá khứ';
      }
    }
    
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    }
    
    if (!formData.petName.trim()) {
      newErrors.petName = 'Vui lòng nhập tên thú cưng';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Vui lòng đăng nhập để đặt lịch dịch vụ', 'warning');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addAppointment(formData);
      showToast('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
      
      // Reset form
      setFormData({
        serviceType: '',
        petType: '',
        appointmentDate: '',
        appointmentTime: '',
        petName: '',
        notes: ''
      });
    } catch (error) {
      showToast('Đặt lịch thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: 'fas fa-cut',
      title: 'Tắm rửa & cắt tỉa lông',
      description: 'Dịch vụ chăm sóc lông chuyên nghiệp',
      price: 'Từ $20'
    },
    {
      icon: 'fas fa-stethoscope',
      title: 'Khám sức khỏe',
      description: 'Kiểm tra sức khỏe định kỳ',
      price: 'Từ $30'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Huấn luyện thú cưng',
      description: 'Huấn luyện hành vi cơ bản',
      price: 'Từ $50'
    }
  ];

  return (
    <div className="page" id="services">
      <div className="container page-content">
        <h1 className="mb-4">Dịch vụ chăm sóc thú cưng</h1>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5>Đặt lịch dịch vụ</h5>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Loại dịch vụ</label>
                    <select 
                      className={`form-select ${errors.serviceType ? 'is-invalid' : ''}`}
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn dịch vụ</option>
                      <option value="grooming">Tắm rửa & cắt tỉa lông</option>
                      <option value="veterinary">Khám sức khỏe</option>
                      <option value="training">Huấn luyện thú cưng</option>
                      <option value="boarding">Gửi thú cưng</option>
                    </select>
                    {errors.serviceType && (
                      <div className="invalid-feedback">{errors.serviceType}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Loại thú cưng</label>
                    <select 
                      className={`form-select ${errors.petType ? 'is-invalid' : ''}`}
                      name="petType"
                      value={formData.petType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn loại thú cưng</option>
                      <option value="dog">Chó</option>
                      <option value="cat">Mèo</option>
                      <option value="bird">Chim</option>
                      <option value="other">Khác</option>
                    </select>
                    {errors.petType && (
                      <div className="invalid-feedback">{errors.petType}</div>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày hẹn</label>
                      <input 
                        type="date" 
                        className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.appointmentDate && (
                        <div className="invalid-feedback">{errors.appointmentDate}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Giờ hẹn</label>
                      <select 
                        className={`form-select ${errors.appointmentTime ? 'is-invalid' : ''}`}
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        required
                      >
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
                      {errors.appointmentTime && (
                        <div className="invalid-feedback">{errors.appointmentTime}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Tên thú cưng</label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.petName ? 'is-invalid' : ''}`}
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.petName && (
                      <div className="invalid-feedback">{errors.petName}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang đặt lịch...' : 'Đặt lịch'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="row">
              {services.map((service, index) => (
                <div key={index} className="col-12 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <i className={`${service.icon} fa-3x text-primary mb-3`}></i>
                      <h5>{service.title}</h5>
                      <p className="text-muted">{service.description}</p>
                      <div className="price">{service.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
