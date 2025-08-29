import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { 
  ArrowLeftIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function ClassDetails() {
  const { id } = useParams(); 
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load class details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchClass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/classes"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">The requested class could not be found.</p>
          <Link
            to="/classes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/classes"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Classes
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classInfo.name}</h1>
              <p className="text-gray-600 text-lg">{classInfo.description}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Class Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Teacher</h3>
            </div>
            <p className="text-gray-600">{classInfo.teacher?.name || "Not assigned"}</p>
            {classInfo.teacher?.email && (
              <p className="text-sm text-blue-600 mt-1">{classInfo.teacher.email}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <CalendarIcon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
            </div>
            <p className="text-gray-600">{classInfo.schedule || "Not scheduled"}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <MapPinIcon className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
            </div>
            <p className="text-gray-600">{classInfo.location || "Not specified"}</p>
            <p className="text-sm text-gray-500 mt-1">Capacity: {classInfo.capacity || "N/A"} students</p>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
                <span className="ml-3 bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {students.length} students
                </span>
              </div>
              <Link
                to={`/classes/${id}/enroll`}
                className="btn-primary"
              >
                Enroll Student
              </Link>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled yet</h3>
              <p className="text-gray-500 mb-4">Get started by enrolling students in this class.</p>
              <Link
                to={`/classes/${id}/enroll`}
                className="btn-primary"
              >
                Enroll First Student
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                        {student.phone && (
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.averageGrade ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.averageGrade >= 90 
                              ? 'bg-green-100 text-green-800'
                              : student.averageGrade >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : student.averageGrade >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.averageGrade}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">No grades</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/students/${student.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to={`/classes/${id}/grades/${student.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Grades
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}