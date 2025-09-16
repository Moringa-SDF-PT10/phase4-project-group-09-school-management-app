import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const ClassBrowser = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [enrolling, setEnrolling] = useState({});

  useEffect(() => {
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
    fetchClasses();
  }, []);

  const handleEnroll = async (classId) => {
    setEnrolling(prev => ({ ...prev, [classId]: true }));
    try {
      await api.post('/enrollments', { class_id: classId });
      setToastMessage('Successfully enrolled in class!');
      setToastType('success');
      setShowToast(true);
      
      // Update the classes list to reflect enrollment
      setClasses(prev => prev.map(cls => 
        cls.id === classId ? { ...cls, is_enrolled: true } : cls
      ));
    } catch (error) {
      console.error('Failed to enroll:', error);
      setToastMessage(error.response?.data?.msg || 'Failed to enroll in class.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setEnrolling(prev => ({ ...prev, [classId]: false }));
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Classes</h1>
            <p className="text-gray-600">Discover and enroll in new courses to expand your knowledge</p>
          </div>
          <Link 
            to="/dashboard" 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-8 rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Available</h3>
              <p className="text-gray-600">There are no classes available for enrollment at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  {/* Class Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{cls.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Teacher: <span className="font-medium">{cls.teacher?.username || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                      {cls.is_enrolled ? 'Enrolled' : 'Available'}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 h-20 overflow-hidden">
                    {cls.description || 'No description available.'}
                  </p>

                  {/* Enrollment Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📚 {cls.enrollment_count || 0} students</span>
                    <span>⭐ {cls.average_rating || 'No ratings'}</span>
                  </div>

                  {/* Action Button */}
                  {cls.is_enrolled ? (
                    <button
                      disabled
                      className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-md font-medium cursor-not-allowed"
                    >
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(cls.id)}
                      disabled={enrolling[cls.id]}
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling[cls.id] ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enrolling...
                        </span>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
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

export default ClassBrowser;