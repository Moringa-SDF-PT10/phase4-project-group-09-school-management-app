import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const AddClass = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Class name must be at least 3 characters')
      .required('Class name is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    capacity: Yup.number()
      .min(1, 'Capacity must be at least 1')
      .max(100, 'Capacity cannot exceed 100')
      .required('Capacity is required'),
    schedule: Yup.string()
      .required('Schedule is required'),
    location: Yup.string()
      .required('Location is required'),
    teacher: Yup.string()
      .required('Teacher is required')
  })

  const teacherOptions = [
    { value: 'john_doe', label: 'John Doe - Mathematics' },
    { value: 'jane_smith', label: 'Jane Smith - Physics' },
    { value: 'mike_johnson', label: 'Mike Johnson - Chemistry' },
    { value: 'sarah_wilson', label: 'Sarah Wilson - Biology' },
    { value: 'david_brown', label: 'David Brown - English' }
  ]

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success - in real app, this would save to database
      console.log('New class data:', values)
      
      setToastMessage('Class created successfully!')
      setToastType('success')
      setShowToast(true)
      
      resetForm()
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setToastMessage('Failed to create class. Please try again.')
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
              <h1 className="text-3xl font-bold text-gray-900">Add New Class</h1>
              <p className="text-gray-600 mt-2">Create a new class with all necessary details</p>
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
              name: '',
              description: '',
              capacity: '',
              schedule: '',
              location: '',
              teacher: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Class Name"
                  name="name"
                  placeholder="e.g., Advanced Mathematics 101"
                  required
                />
                
                <FormInput
                  label="Description"
                  name="description"
                  placeholder="Brief description of the class content and objectives"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Capacity"
                    name="capacity"
                    type="number"
                    placeholder="Maximum number of students"
                    required
                  />
                  
                  <FormInput
                    label="Schedule"
                    name="schedule"
                    placeholder="e.g., Mon/Wed/Fri 9:00 AM - 10:30 AM"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Location"
                    name="location"
                    placeholder="e.g., Room 201, Building A"
                    required
                  />
                  
                  <FormInput
                    label="Teacher"
                    name="teacher"
                    type="select"
                    options={teacherOptions}
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? 'Creating Class...' : 'Create Class'}
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

export default AddClass