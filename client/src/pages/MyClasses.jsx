import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const MyClasses = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchEnrolledClasses = async () => {
    try {
      const response = await api.get('/enrollments/my-classes');
      setEnrolledClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch enrolled classes:', error);
      setToastMessage('Could not load your classes.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const handleDrop = async (classId) => {
    if (window.confirm('Are you sure you want to drop this class?')) {
      try {
        await api.delete(`/enrollments/drop/${classId}`);
        setToastMessage('Class dropped successfully!');
        setToastType('success');
        setShowToast(true);
        fetchEnrolledClasses();
      } catch (error) {
        setToastMessage(error.response?.data?.msg || 'Failed to drop class.');
        setToastType('error');
        setShowToast(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
            <p className="text-gray-600 mt-2">View and manage your enrolled classes</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {enrolledClasses.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledClasses.map((enrollment) => (
                  <tr key={enrollment.enrollment_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.class.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.class.teacher?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.class.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDrop(enrollment.class.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Drop
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">You are not enrolled in any classes yet.</h2>
            <Link to="/browse-classes" className="mt-4 inline-block btn-primary">
              Browse Classes to Enroll
            </Link>
          </div>
        )}
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

export default MyClasses;
