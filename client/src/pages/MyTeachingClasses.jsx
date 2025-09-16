import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const MyTeachingClasses = () => {
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchTeachingClasses = async () => {
      try {
        const response = await api.get('/classes/my-teaching-classes');
        setTeachingClasses(response.data.classes);
      } catch (error) {
        console.error('Failed to fetch teaching classes:', error);
        setToastMessage('Could not load your classes.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachingClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your teaching classes...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Teaching Classes</h1>
              <p className="text-gray-600">Manage grades and view details for your assigned classes</p>
            </div>
            <Link 
              to="/dashboard" 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {teachingClasses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Assigned Classes</h2>
              <p className="text-sm text-gray-600">
                You are teaching {teachingClasses.length} class{teachingClasses.length !== 1 ? 'es' : ''}
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
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
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
                  {teachingClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {cls.description || 'No description available'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cls.schedule || 'Not scheduled'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cls.location || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cls.enrollment_count || 0} students
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link 
                          to={`/class/${cls.id}/grades`}
                          className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                          Manage Grades
                        </Link>
                        <Link 
                          to={`/class/${cls.id}`}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-md border border-gray-200 p-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Teaching Assignments</h2>
              <p className="text-gray-600 mb-6">You haven't been assigned to teach any classes yet.</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Please contact the school administrator to be assigned to classes.</p>
                <p>Or check back later for teaching assignments.</p>
              </div>
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

export default MyTeachingClasses;