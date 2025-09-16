import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const UserManagement = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleFilter = params.get('role');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterRole, setFilterRole] = useState(roleFilter || '');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoint = filterRole ? `/users?role=${filterRole}` : '/users';
      const res = await api.get(endpoint);
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
  }, [filterRole]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setToastMessage(`User "${userName}" deleted successfully!`);
      setToastType('success');
      setShowToast(true);
      fetchUsers();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to delete user.');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Create and manage all system users</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                to="/dashboard" 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                ← Dashboard
              </Link>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)} 
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
              >
                {showCreateForm ? 'Cancel' : '+ Create User'}
              </button>
            </div>
          </div>
        </div>

        {/* Create User Form */}
        {showCreateForm && <CreateUserForm onUserCreated={fetchUsers} onCancel={() => setShowCreateForm(false)} />}

        {/* Filter Controls */}
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Users</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Administrators</option>
            </select>
            <span className="text-sm text-gray-600">
              {users.length} user{users.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">System Users</h2>
            <p className="text-sm text-gray-600">Manage all user accounts in the system</p>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600">
                  {filterRole ? `No ${filterRole} users found.` : 'No users found in the system.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username || user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username || user.name)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  );
};

const CreateUserForm = ({ onUserCreated, onCancel }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users', formData);
      setToastMessage('User created successfully!');
      setToastType('success');
      setShowToast(true);
      onUserCreated();
      setFormData({ username: '', email: '', password: '', role: 'student' });
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to create user.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Enter username" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email address" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Enter password" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        
        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
      
      {showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default UserManagement;