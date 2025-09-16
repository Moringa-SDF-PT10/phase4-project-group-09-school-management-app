import React, { useState, useEffect } from 'react'
import api from '../services/api'
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
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Class name must be at least 3 characters')
      .required('Class name is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    teacher_id: Yup.number()
      .required('Teacher is required')
  })

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/users/teachers');
        setTeachers(response.data.map(teacher => ({
          value: teacher.id,
          label: `${teacher.username} (${teacher.email})`
        })));
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setToastMessage('Could not load teachers list.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setIsLoading(false)
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.post('/classes', values);
      setToastMessage('Class created successfully!');
      setToastType('success');
      setShowToast(true);
      resetForm();
      setTimeout(() => {
        navigate('/classes');
      }, 1500);
    } catch (error) {
      console.error('Failed to create class:', error);
      setToastMessage(error.response?.data?.msg || 'Failed to create class.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Class</h1>
              <p className="text-gray-600 mt-2">Create a new class with all necessary details</p>
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <Formik
            initialValues={{
              name: '',
              description: '',
              teacher_id: ''
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
                  type="textarea"
                  placeholder="Brief description of the class content and objectives"
                  required
                />
                
                <FormInput
                  label="Assign Teacher"
                  name="teacher_id"
                  type="select"
                  options={teachers}
                  placeholder={isLoading ? "Loading teachers..." : "Select a teacher"}
                  disabled={isLoading}
                  required
                />

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {isSubmitting ? 'Creating Class...' : 'Create Class'}
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

export default AddClass