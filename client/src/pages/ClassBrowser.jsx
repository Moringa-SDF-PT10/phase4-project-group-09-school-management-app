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
            <h1 className="text-3xl font-bold text-gray-900">Browse Classes</h1>
            <p className="text-gray-600 mt-2">Enroll in new classes and expand your knowledge</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{cls.name}</h2>
                <p className="text-gray-600 mb-4">Taught by: {cls.teacher?.name || 'N/A'}</p>
                <p className="text-gray-700 mb-4 h-24 overflow-y-auto">{cls.description}</p>
                
              </div>
            </div>
          ))}
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

export default ClassBrowser;
