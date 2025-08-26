import React, { useState } from 'react'
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

  const studentOptions = [
    { value: 'student_001', label: 'Alice Johnson - ID: 001' },
    { value: 'student_002', label: 'Bob Smith - ID: 002' },
    { value: 'student_003', label: 'Carol Davis - ID: 003' },
    { value: 'student_004', label: 'David Wilson - ID: 004' },
    { value: 'student_005', label: 'Eva Brown - ID: 005' },
    { value: 'student_006', label: 'Frank Miller - ID: 006' },
    { value: 'student_007', label: 'Grace Taylor - ID: 007' },
    { value: 'student_008', label: 'Henry Anderson - ID: 008' }
  ]

  const classOptions = [
    { value: 'math_101', label: 'Mathematics 101 - Advanced Calculus' },
    { value: 'physics_201', label: 'Physics 201 - Classical Mechanics' },
    { value: 'chemistry_101', label: 'Chemistry 101 - General Chemistry' },
    { value: 'biology_201', label: 'Biology 201 - Cell Biology' },
    { value: 'english_101', label: 'English 101 - Composition' },
    { value: 'history_201', label: 'History 201 - World History' }
  ]

  const semesterOptions = [
    { value: 'fall', label: 'Fall' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' }
  ]

  const academicYearOptions = [
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2026-2027', label: '2026-2027' }
  ]

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success - in real app, this would save to database
      console.log('Enrollment data:', values)
      
      setToastMessage('Student enrolled successfully!')
      setToastType('success')
      setShowToast(true)
      
      resetForm()
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setToastMessage('Failed to enroll student. Please try again.')
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