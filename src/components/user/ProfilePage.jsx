import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link, useLocation } from 'react-router-dom';
import AddressFormModal from './AddressFormModal';

const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile-info');

  // Basic info form state
  const [profileForm, setProfileForm] = useState(() => ({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    birthday: ''
  }));

  // Addresses state (static + in-memory only)
  const [addresses, setAddresses] = useState(() => ([
    {
      id: 1,
      label: 'Nhà riêng',
      fullName: user?.name || 'Nguyễn Văn A',
      phone: '0123456789',
      addressLine: '123 Đường ABC, Phường XYZ',
      city: 'TP.HCM',
      district: 'Quận 1',
      ward: 'Phường 1',
      isDefault: true
    },
    {
      id: 2,
      label: 'Văn phòng',
      fullName: user?.name || 'Nguyễn Văn A',
      phone: '0987654321',
      addressLine: '456 Đường DEF, Phường UVW',
      city: 'TP.HCM',
      district: 'Quận 3',
      ward: 'Phường 5',
      isDefault: false
    }
  ]));
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Sync tab from query ?tab=addresses
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  // Change password form state (mock)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isLoggedIn = useMemo(() => Boolean(user), [user]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Cập nhật thông tin cá nhân thành công!', 'success');
  };

  const openAddAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressSaved = (data) => {
    const newAddress = {
      id: Date.now(),
      label: data.label || 'Địa chỉ mới',
      fullName: data.fullName,
      phone: data.phone,
      addressLine: data.addressLine,
      city: data.city,
      district: data.district,
      ward: data.ward,
      isDefault: Boolean(data.isDefault)
    };
    setAddresses((prev) => {
      const cleared = newAddress.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [newAddress, ...cleared];
    });
    showToast('Đã thêm địa chỉ mới!', 'success');
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Đã xóa địa chỉ.', 'info');
  };

  const handleMakeDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast('Đã đặt địa chỉ mặc định.', 'success');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast('Vui lòng nhập đầy đủ thông tin.', 'warning');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Xác nhận mật khẩu không khớp.', 'danger');
      return;
    }
    showToast('Đổi mật khẩu thành công!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!isLoggedIn) {
    return (
      <div className="container page-content">
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <div>Vui lòng đăng nhập để xem trang hồ sơ cá nhân.</div>
          <Link to="/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <h1 className="mb-4">Thông tin cá nhân</h1>
      <div className="row">
        <div className="col-lg-3">
          <div className="nav flex-column nav-pills">
            <button className={`nav-link ${activeTab === 'profile-info' ? 'active' : ''}`} onClick={() => handleTabClick('profile-info')}>Thông tin cơ bản</button>
            <button className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => handleTabClick('addresses')}>Địa chỉ giao hàng</button>
            <button className={`nav-link ${activeTab === 'change-password' ? 'active' : ''}`} onClick={() => handleTabClick('change-password')}>Đổi mật khẩu</button>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="tab-content">
            {activeTab === 'profile-info' && (
              <div className="tab-pane fade show active" id="profile-info">
                <div className="card">
                  <div className="card-body">
                    <h5>Thông tin cơ bản</h5>
                    <form onSubmit={handleProfileSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Họ và tên</label>
                          <input type="text" className="form-control" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" name="email" value={profileForm.email} disabled />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Số điện thoại</label>
                          <input type="tel" className="form-control" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Ngày sinh</label>
                          <input type="date" className="form-control" name="birthday" value={profileForm.birthday} onChange={handleProfileChange} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Cập nhật</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-pane fade show active" id="addresses">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Địa chỉ giao hàng</h5>
                      <button className="btn btn-primary" onClick={openAddAddressModal}>Thêm địa chỉ</button>
                    </div>

                    <div id="addressesList">
                      {addresses.map((addr) => (
                        <div className="card mb-3" key={addr.id}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <div className="fw-semibold">
                                  {addr.label} {addr.isDefault && <span className="badge bg-success ms-2">Mặc định</span>}
                                </div>
                                <div className="text-muted small">{addr.fullName} | {addr.phone}</div>
                                <div className="mt-2">{addr.addressLine}</div>
                                <div className="text-muted">{addr.ward}, {addr.district}, {addr.city}</div>
                              </div>
                              <div className="text-nowrap">
                                {!addr.isDefault && (
                                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleMakeDefault(addr.id)}>Đặt mặc định</button>
                                )}
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteAddress(addr.id)}>Xóa</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'change-password' && (
              <div className="tab-pane fade show active" id="change-password">
                <div className="card">
                  <div className="card-body">
                    <h5>Đổi mật khẩu</h5>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Mật khẩu hiện tại</label>
                        <input type="password" className="form-control" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <input type="password" className="form-control" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Xác nhận mật khẩu mới</label>
                        <input type="password" className="form-control" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                      </div>
                      <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleAddressSaved}
      />
    </div>
  );
};

export default ProfilePage;
