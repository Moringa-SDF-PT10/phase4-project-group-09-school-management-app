import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const SubmitGrade = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [enrollmentOptions, setEnrollmentOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsRes = await api.get('/enrollments/teacher/enrollments');
        setEnrollmentOptions(enrollmentsRes.data);
      } catch (error) {
        setToastMessage('Could not load form data.');
        setToastType('error');
        setShowToast(true);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object({
    enrollment: Yup.string()
      .required('Enrollment selection is required'),
    grade: Yup.number()
      .min(0, 'Grade must be at least 0')
      .max(100, 'Grade cannot exceed 100')
      .required('Grade is required')
  })


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
        enrollment_id: values.enrollment,
        score: values.grade,
        remarks: 'Manual Grade Entry'
    };
    try {
      await api.post('/grades/', payload);
      
      setToastMessage('Grade submitted successfully!')
      setToastType('success')
      setShowToast(true)
      
      resetForm()
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setToastMessage('Failed to submit grade. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Grade</h1>
              <p className="text-gray-600 mt-2">Record student grades and assignments</p>
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
              enrollment: '',
              grade: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Student Enrollment"
                  name="enrollment"
                  type="select"
                  options={enrollmentOptions}
                  required
                />
                
                <FormInput
                  label="Grade (0-100)"
                  name="grade"
                  type="number"
                  placeholder="Enter grade (0-100)"
                  required
                />

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? 'Submitting Grade...' : 'Submit Grade'}
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

export default SubmitGrade