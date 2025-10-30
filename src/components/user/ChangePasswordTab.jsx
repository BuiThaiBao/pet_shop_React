import React, { useState } from 'react';

const ChangePasswordTab = ({ showToast }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  return (
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
  );
};

export default ChangePasswordTab;