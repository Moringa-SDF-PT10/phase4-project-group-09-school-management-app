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
        const [studentsRes, classesRes] = await Promise.all([
          api.get('/users/students'),
          api.get('/classes/options')
        ]);
        setStudentOptions(studentsRes.data);
        setClassOptions(classesRes.data);
      } catch (error) {
        setToastMessage('Failed to load form options.');
        setToastType('error');
        setShowToast(true);
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
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Failed to enroll student. Please try again.';
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enroll Student</h1>
              <p className="text-gray-600 mt-2">Enroll a student in an existing class</p>
            </div>
            <Link
              to="/"
              className="btn-secondary"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="form-container">
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
                  label="Student"
                  name="student"
                  type="select"
                  options={studentOptions}
                  required
                />
                
                <FormInput
                  label="Class"
                  name="class"
                  type="select"
                  options={classOptions}
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
                    required
                  />
                  
                  <FormInput
                    label="Academic Year"
                    name="academicYear"
                    type="select"
                    options={academicYearOptions}
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? 'Enrolling Student...' : 'Enroll Student'}
                  </button>
                  
                  <Link
                    to="/"
                    className="btn-secondary flex-1 text-center"
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