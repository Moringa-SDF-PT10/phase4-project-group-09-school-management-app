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
    teacher_id: Yup.number()
      .required('Teacher is required')
  })

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/users');
        const teacherUsers = response.data.users.filter(user => user.role === 'teacher');
        setTeachers(teacherUsers.map(t => ({ value: t.id, label: t.name })));
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setToastMessage('Could not load teachers list.');
        setToastType('error');
        setShowToast(true);
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
              to="/classes"
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
                    name="teacher_id"
                    type="select"
                    options={teachers}
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
                    to="/classes"
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