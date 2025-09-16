import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const EnrollStudent = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [studentOptions, setStudentOptions] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [loading, setLoading] = useState(true)

  const validationSchema = Yup.object({
    student: Yup.string()
      .required('Student selection is required'),
    class: Yup.string()
      .required('Class selection is required'),
    enrollmentDate: Yup.date()
      .required('Enrollment date is required')
      .max(new Date(), 'Enrollment date cannot be in the future'),
    semester: Yup.string()
      .required('Semester is required'),
    academicYear: Yup.string()
      .required('Academic year is required')
  })

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [studentsRes, classesRes] = await Promise.all([
          api.get('/users/students'),
          api.get('/classes/options')
        ]);
        
        setStudentOptions(studentsRes.data.map(student => ({
          value: student.id,
          label: `${student.username} (${student.email})`
        })));
        
        setClassOptions(classesRes.data.map(cls => ({
          value: cls.id,
          label: `${cls.name} - ${cls.teacher?.username || 'No teacher'}`
        })));
        
      } catch (error) {
        console.error('Failed to load options:', error);
        setToastMessage('Failed to load form options.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const semesterOptions = [
    { value: 'first_semester', label: 'First Semester' },
    { value: 'second_semester', label: 'Second Semester' },
    { value: 'tri_semester', label: 'Tri Semester' }
  ]

  const academicYearOptions = [
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2026-2027', label: '2026-2027' }
  ]

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      student_id: values.student,
      class_id: values.class,
      enrollment_date: values.enrollmentDate,
      semester: values.semester,
      academic_year: values.academicYear
    };

    try {
      await api.post('/enrollments/', payload);
      setToastMessage('Student enrolled successfully!');
      setToastType('success');
      setShowToast(true);
      resetForm();
      setTimeout(() => navigate('/classes'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Failed to enroll student. Please try again.';
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enrollment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enroll Student</h1>
              <p className="text-gray-600">Enroll a student in an existing class</p>
            </div>
            <Link
              to="/classes"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              ← Back to Classes
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <Formik
            initialValues={{
              student: '',
              class: '',
              enrollmentDate: '',
              semester: '',
              academicYear: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Select Student"
                  name="student"
                  type="select"
                  options={studentOptions}
                  placeholder="Choose a student"
                  required
                />
                
                <FormInput
                  label="Select Class"
                  name="class"
                  type="select"
                  options={classOptions}
                  placeholder="Choose a class"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Enrollment Date"
                    name="enrollmentDate"
                    type="date"
                    required
                  />
                  
                  <FormInput
                    label="Semester"
                    name="semester"
                    type="select"
                    options={semesterOptions}
                    placeholder="Select semester"
                    required
                  />
                  
                  <FormInput
                    label="Academic Year"
                    name="academicYear"
                    type="select"
                    options={academicYearOptions}
                    placeholder="Select academic year"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enrolling...
                      </span>
                    ) : (
                      'Enroll Student'
                    )}
                  </button>
                  
                  <Link
                    to="/classes"
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors text-center flex-1"
                  >
                    Cancel
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
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
  )
}

export default EnrollStudent