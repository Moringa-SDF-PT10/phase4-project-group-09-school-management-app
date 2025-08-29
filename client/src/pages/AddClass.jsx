import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput.jsx';
import Toast from '../components/Toast.jsx';
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const AddClass = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Class name must be at least 3 characters')
      .max(100, 'Class name cannot exceed 100 characters')
      .required('Class name is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters')
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
  });

  const teacherOptions = [
    { value: 'john_doe', label: 'John Doe - Mathematics' },
    { value: 'jane_smith', label: 'Jane Smith - Physics' },
    { value: 'mike_johnson', label: 'Mike Johnson - Chemistry' },
    { value: 'sarah_wilson', label: 'Sarah Wilson - Biology' },
    { value: 'david_brown', label: 'David Brown - English' }
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('New class data:', values);
      
      setToastMessage('Class created successfully!');
      setToastType('success');
      setShowToast(true);
      
      resetForm();
      
      setTimeout(() => {
        navigate('/classes');
      }, 1500);
    } catch (error) {
      setToastMessage('Failed to create class. Please try again.');
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
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
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Class Name"
                    name="name"
                    placeholder="e.g., Advanced Mathematics 101"
                    required
                    helperText="Enter a descriptive name for the class"
                  />
                  
                  <FormInput
                    label="Teacher"
                    name="teacher"
                    type="select"
                    options={teacherOptions}
                    required
                    helperText="Select the assigned teacher"
                  />
                </div>
                
                <FormInput
                  label="Description"
                  name="description"
                  type="textarea"
                  placeholder="Brief description of the class content, objectives, and requirements..."
                  required
                  helperText="Provide detailed information about the class"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Capacity"
                    name="capacity"
                    type="number"
                    placeholder="30"
                    required
                    helperText="Maximum number of students"
                  />
                  
                  <FormInput
                    label="Schedule"
                    name="schedule"
                    placeholder="e.g., Mon/Wed/Fri 9:00 AM - 10:30 AM"
                    required
                    helperText="Class meeting times"
                  />
                  
                  <FormInput
                    label="Location"
                    name="location"
                    placeholder="e.g., Room 201, Building A"
                    required
                    helperText="Classroom or building location"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    to="/classes"
                    className="btn-secondary mt-3 sm:mt-0 w-full sm:w-auto justify-center"
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