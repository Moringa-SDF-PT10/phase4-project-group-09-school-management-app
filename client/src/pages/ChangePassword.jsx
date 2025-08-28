import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setToastMessage('New passwords do not match.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/users/change-password', {
        old_password: formData.old_password,
        new_password: formData.new_password
      });
      setToastMessage(res.data.msg);
      setToastType('success');
      setShowToast(true);
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to change password.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Your Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Old Password</label>
              <input
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Change Password'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ChangePassword;
