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
  const [enrollmentOptions, setEnrollmentOptions] = useState([])

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get('/enrollments/teacher/enrollments');
        setEnrollmentOptions(response.data);
      } catch (error) {
        setToastMessage('Could not load student enrollments.');
        setToastType('error');
        setShowToast(true);
      }
    };

    fetchEnrollments();
  }, []);

  const validationSchema = Yup.object({
    enrollment: Yup.string()
      .required('Enrollment selection is required'),
    grade: Yup.number()
      .min(0, 'Grade must be at least 0')
      .max(100, 'Grade cannot exceed 100')
      .required('Grade is required'),
    assignmentType: Yup.string()
      .required('Assignment type is required'),
    assignmentName: Yup.string()
      .min(3, 'Assignment name must be at least 3 characters')
      .required('Assignment name is required'),
    assignmentDate: Yup.date()
      .required('Assignment date is required')
      .max(new Date(), 'Assignment date cannot be in the future')
  })


  const assignmentTypeOptions = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'project', label: 'Project' },
    { value: 'participation', label: 'Participation' },
    { value: 'lab', label: 'Laboratory' }
  ]

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
        enrollment_id: values.enrollment,
        score: values.grade,
        remarks: `${values.assignmentType} - ${values.assignmentName} (${values.assignmentDate})`
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
              grade: '',
              assignmentType: '',
              assignmentName: '',
              assignmentDate: ''
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Grade (0-100)"
                    name="grade"
                    type="number"
                    placeholder="Enter grade (0-100)"
                    required
                  />
                  
                  <FormInput
                    label="Assignment Type"
                    name="assignmentType"
                    type="select"
                    options={assignmentTypeOptions}
                    required
                  />
                </div>
                
                <FormInput
                  label="Assignment Name"
                  name="assignmentName"
                  placeholder="e.g., Midterm Exam, Chapter 5 Homework"
                  required
                />
                
                <FormInput
                  label="Assignment Date"
                  name="assignmentDate"
                  type="date"
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