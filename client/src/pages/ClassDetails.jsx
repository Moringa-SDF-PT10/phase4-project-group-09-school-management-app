import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast.jsx";

export default function ClassDetails() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    async function fetchClass() {
      try {
        setLoading(true);
        const [classRes, studentsRes] = await Promise.all([
          api.get(`/classes/${id}`),
          api.get(`/classes/${id}/students`)
        ]);
        
        setClassInfo(classRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error("Error loading class details:", err);
        setToastMessage('Failed to load class details.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
    fetchClass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4 inline-block">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">The requested class could not be found.</p>
          <Link to="/classes" className="text-orange-500 hover:text-orange-600 font-medium">
            ← Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to="/classes" 
                className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Classes
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classInfo.name}</h1>
              <p className="text-gray-600 text-lg">{classInfo.description}</p>
              {classInfo.teacher && (
                <p className="text-gray-500 mt-2">
                  Teacher: <span className="font-medium">{classInfo.teacher.username}</span>
                </p>
              )}
            </div>
            
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{students.length}</span> students enrolled
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
            <p className="text-gray-600 text-sm">List of all students enrolled in this class</p>
          </div>

          {students.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="bg-gray-100 p-6 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h3>
                <p className="text-gray-600">There are no students enrolled in this class yet.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name || student.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.grade 
                            ? student.grade >= 80 
                              ? 'bg-green-100 text-green-800'
                              : student.grade >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.grade ? `${student.grade}%` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
}