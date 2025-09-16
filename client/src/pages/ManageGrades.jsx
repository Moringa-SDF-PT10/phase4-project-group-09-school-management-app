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
  const [saving, setSaving] = useState(false);

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
    const numericScore = score === '' ? '' : Math.min(100, Math.max(0, parseInt(score) || 0));
    setGrades(prev => ({ ...prev, [studentId]: numericScore }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    const numericGrade = parseInt(grade);
    if (numericGrade >= 80) return 'text-green-600';
    if (numericGrade >= 60) return 'text-yellow-600';
    if (numericGrade >= 1) return 'text-red-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class data...</p>
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
              <Link 
                to="/my-teaching-classes" 
                className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to My Classes
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Grades</h1>
              <p className="text-gray-600">
                {classDetails?.name} - {classDetails?.teacher?.username}
              </p>
            </div>
            
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{enrollments.length}</span> students enrolled
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Student Grades</h2>
            <p className="text-sm text-gray-600">Update grades for each student (0-100)</p>
          </div>

          {enrollments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h3>
                <p className="text-gray-600">There are no students enrolled in this class yet.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Grade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map(enr => (
                    <tr key={enr.enrollment_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enr.student.name || enr.student.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{enr.student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getGradeColor(enr.grade?.score)}`}>
                          {enr.grade?.score || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[enr.student.id] || ''}
                          onChange={(e) => handleGradeChange(enr.student.id, e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          placeholder="0-100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Save Button */}
          {enrollments.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={handleSaveChanges}
                disabled={saving}
                className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save All Grades'
                )}
              </button>
            </div>
          )}
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