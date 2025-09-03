import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'
import { ArrowLeftIcon, AcademicCapIcon  } from "@heroicons/react/24/outline";

const AddClass = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [teachers, setTeachers] = useState([])

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Class name must be at least 3 characters')
      .max(100, 'Class name cannot exceed 100 characters')
      .required('Class name is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters')
      .required('Description is required'),
    teacher_id: Yup.number()
      .required('Teacher is required')
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/users/teachers');
        setTeachers(response.data);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/classes"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back to Classes
              </Link>
            </div>
          </div>
          
          <div className="mt-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Class</h1>
              <p className="text-gray-600 mt-2">Add a new class to the system with all necessary details</p>
            </div>
            <Link
              to="/classes"
              className="btn-secondary"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={{
              name: '',
              description: '',
              teacher_id: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
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
                
                <FormInput
                  label="Teacher"
                  name="teacher_id"
                  type="select"
                  options={teachers}
                  required
                />

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    to="/classes"
                    className="btn-secondary flex-1 text-center"
                  >
                    Cancel
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !dirty || !isValid}
                    className="btn-primary w-full sm:w-auto justify-center"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Class...
                      </div>
                    ) : (
                      'Create Class'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Class Creation Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Ensure the class name is descriptive and unique</li>
            <li>• Provide clear meeting times and location information</li>
            <li>• Set appropriate capacity based on classroom size</li>
            <li>• Assign qualified teachers to each class</li>
            <li>• Include detailed description for students and parents</li>
          </ul>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default AddClass;