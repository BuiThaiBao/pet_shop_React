import React, { useEffect, useRef, useState } from 'react';
import ServicesGrid from './ServicesGrid';
import { getActiveServices } from '../../data/services';
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

  const formRef = useRef(null);
  const { user } = useAuth();
  const { addAppointment } = useAppointment();
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceType) newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
    if (!formData.petType) newErrors.petType = 'Vui lòng chọn loại thú cưng';
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.appointmentDate = 'Ngày hẹn không thể là ngày trong quá khứ';
    }
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    if (!formData.petName.trim()) newErrors.petName = 'Vui lòng nhập tên thú cưng';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Vui lòng đăng nhập để đặt lịch dịch vụ', 'warning');
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addAppointment(formData);
      showToast('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
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

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const didFetchRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingServices(true);
      setServicesError('');
      try {
        const list = await getActiveServices();
        if (!cancelled && Array.isArray(list)) setServices(list);
      } catch (e) {
        if (!cancelled) setServicesError('Không tải được dịch vụ.');
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleBookFromCard = (serviceKey) => {
    setFormData(prev => ({ ...prev, serviceType: serviceKey }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="page" id="services">
      <div className="container page-content">
        <div className="text-center mb-5">
          <h1 className="mb-3">Dịch vụ chăm sóc thú cưng chuyên nghiệp</h1>
          <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 950 }}>
          Đội ngũ bác sĩ thú y và chuyên viên chăm sóc giàu kinh nghiệm của chúng tôi cam kết mang đến dịch vụ toàn diện, an toàn và tận tâm cho thú cưng của bạn. Từ các dịch vụ làm đẹp như tắm, cắt tỉa lông, vệ sinh tai – răng miệng cho đến kiểm tra sức khỏe định kỳ, tiêm phòng và tư vấn dinh dưỡng, chúng tôi luôn đồng hành để thú cưng không chỉ khỏe mạnh mà còn thoải mái và hạnh phúc mỗi ngày. Chúng tôi tin rằng mỗi thú cưng đều xứng đáng được yêu thương và chăm sóc như một thành viên trong gia đình.
          </p>
        </div>

        <h3 className="text-center mb-3">Dịch vụ của chúng tôi</h3>
        <p className="text-center text-muted mb-4 mx-auto" style={{ maxWidth: 760 }}>
          Lựa chọn từ danh sách dịch vụ chuyên nghiệp, được thiết kế toàn diện cho nhu cầu của thú cưng. Từ tắm rửa, cắt tỉa lông đến khám sức khỏe định kỳ và huấn luyện 1-1, chúng tôi cam kết mang đến trải nghiệm an toàn, chất lượng và chu đáo nhất.
          </p>
        <div className="mb-5">
          {loadingServices && (
            <div className="text-muted text-center">Đang tải dịch vụ...</div>
          )}
          {!loadingServices && servicesError && (
            <div className="text-danger text-center mb-3">{servicesError}</div>
          )}
          {!loadingServices && services.length > 0 && (
            <ServicesGrid services={services} onBook={handleBookFromCard} />
          )}
          {!loadingServices && !servicesError && services.length === 0 && (
            <div className="text-center text-muted">Chưa có dịch vụ để hiển thị.</div>
          )}
        </div>

        <div ref={formRef} className="card">
          <div className="card-body">
            <h5 className="mb-3">Đặt lịch dịch vụ</h5>
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
                  {services.map((s) => (
                    <option key={s.key} value={s.key}>{s.title}</option>
                  ))}
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
    </div>
  );
};

export default ServicesPage;
