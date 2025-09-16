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
  const [dropping, setDropping] = useState({});

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

  const handleDrop = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to drop "${className}"? This action cannot be undone.`)) {
      return;
    }

    setDropping(prev => ({ ...prev, [classId]: true }));
    try {
      await api.delete(`/enrollments/drop/${classId}`);
      setToastMessage(`"${className}" dropped successfully!`);
      setToastType('success');
      setShowToast(true);
      fetchEnrolledClasses();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to drop class.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setDropping(prev => ({ ...prev, [classId]: false }));
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    const numericGrade = parseInt(grade);
    if (numericGrade >= 80) return 'text-green-600 font-semibold';
    if (numericGrade >= 60) return 'text-yellow-600 font-semibold';
    if (numericGrade >= 1) return 'text-red-600 font-semibold';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
              <p className="text-gray-600">View and manage your enrolled classes</p>
            </div>
            <Link 
              to="/browse-classes" 
              className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              + Enroll in New Class
            </Link>
          </div>
        </div>

        {enrolledClasses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Enrolled Classes</h2>
              <p className="text-sm text-gray-600">
                You are enrolled in {enrolledClasses.length} class{enrolledClasses.length !== 1 ? 'es' : ''}
              </p>
            </div>

            <div className="overflow-x-auto">
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
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
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
                    <tr key={enrollment.enrollment_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.class.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{enrollment.class.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{enrollment.class.teacher?.username || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{enrollment.class.schedule || 'Not scheduled'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{enrollment.class.location || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getGradeColor(enrollment.grade?.score)}`}>
                          {enrollment.grade?.score || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          enrollment.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDrop(enrollment.class.id, enrollment.class.name)}
                          disabled={dropping[enrollment.class.id]}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {dropping[enrollment.class.id] ? 'Dropping...' : 'Drop'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-md border border-gray-200 p-12">
            <div className="bg-gray-100 p-6 rounded-lg">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Classes Enrolled</h2>
              <p className="text-gray-600 mb-6">You haven't enrolled in any classes yet.</p>
              <Link 
                to="/browse-classes" 
                className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
              >
                Browse Available Classes
              </Link>
            </div>
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