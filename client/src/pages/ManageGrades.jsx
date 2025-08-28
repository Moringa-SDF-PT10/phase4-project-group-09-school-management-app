import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast.jsx';

const ManageGrades = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchClassData = async () => {
    try {
      const classRes = await api.get(`/classes/${classId}`);
      setClassDetails(classRes.data);

      const enrollmentsRes = await api.get(`/enrollments/class/${classId}`);
      setEnrollments(enrollmentsRes.data.enrollments);

      const initialGrades = enrollmentsRes.data.enrollments.reduce((acc, enr) => {
        acc[enr.student.id] = enr.grade?.score || '';
        return acc;
      }, {});
      setGrades(initialGrades);

    } catch (error) {
      console.error('Failed to fetch class data:', error);
      setToastMessage('Could not load class data.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const handleGradeChange = (studentId, score) => {
    setGrades(prev => ({ ...prev, [studentId]: score }));
  };

  const handleSaveChanges = async () => {
    try {
      await api.post(`/grades/class/${classId}`, { grades });
      setToastMessage('Grades saved successfully!');
      setToastType('success');
      setShowToast(true);
      fetchClassData(); // Refresh data
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to save grades.');
      setToastType('error');
      setShowToast(true);
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Grades: {classDetails?.name}</h1>
            <p className="text-gray-600 mt-2">Update grades for enrolled students</p>
          </div>
          <Link to="/my-teaching-classes" className="btn-secondary">
            ← Back to My Classes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Grade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map(enr => (
                <tr key={enr.enrollment_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enr.student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enr.student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enr.grade?.score ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[enr.student.id] || ''}
                      onChange={(e) => handleGradeChange(enr.student.id, e.target.value)}
                      className="form-input w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button onClick={handleSaveChanges} className="btn-primary">
              Save Changes
            </button>
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

export default ManageGrades;
