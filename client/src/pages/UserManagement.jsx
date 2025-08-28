import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data.users);
    } catch (error) {
      setToastMessage('Failed to load users.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Create and manage users</p>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="btn-secondary">
              ← Back to Dashboard
            </Link>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
              {showCreateForm ? 'Cancel' : '＋ Create User'}
            </button>
          </div>
        </div>

        {showCreateForm && <CreateUserForm onUserCreated={fetchUsers} />}

        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  );
};

const CreateUserForm = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/', formData);
      setToastMessage(res.data.msg);
      setToastType('success');
      setShowToast(true);
      onUserCreated(); // Refresh user list
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to create user.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Create New User</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="form-input" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="form-input" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="form-input" />
        <select name="role" value={formData.role} onChange={handleChange} className="form-input">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <div className="md:col-span-2 text-right">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
        </div>
      </form>
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default UserManagement;
