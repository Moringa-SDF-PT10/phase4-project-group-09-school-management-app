import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const ClassList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/'); // Redirect if not an admin
      return;
    }
    fetchClasses();
  }, [currentUser, navigate]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      setToastMessage('Could not load classes.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete "${className}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(prev => ({ ...prev, [classId]: true }));
    try {
      await api.delete(`/classes/${classId}`);
      setToastMessage(`"${className}" deleted successfully!`);
      setToastType('success');
      setShowToast(true);
      fetchClasses(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete class:', error);
      setToastMessage(error.response?.data?.msg || 'Failed to delete class.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setDeleting(prev => ({ ...prev, [classId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Classes</h1>
            <p className="text-gray-600">View, create, edit, and manage all classes</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/class/add" 
              className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              + Add New Class
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Classes Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {cls.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {cls.teacher?.username || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cls.enrollment_count || 0} students
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link 
                          to={`/class/edit/${cls.id}`}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                        >
                          Edit
                        </Link>
                        <Link 
                          to={`/class/${cls.id}`}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleDelete(cls.id, cls.name)}
                          disabled={deleting[cls.id]}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deleting[cls.id] ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
                        <p className="text-gray-600 mb-4">Get started by creating your first class.</p>
                        <Link 
                          to="/class/add" 
                          className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
                        >
                          Create First Class
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default ClassList;