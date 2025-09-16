import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useParams } from 'react-router-dom';
import FormInput from '../components/FormInput.jsx';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';

const EditClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [teachers, setTeachers] = useState([]);

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
    schedule: Yup.string().required('Schedule is required'),
    location: Yup.string().required('Location is required'),
    teacher_id: Yup.number().required('Teacher is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, usersRes] = await Promise.all([
          api.get(`/classes/${id}`),
          api.get('/users/teachers'),
        ]);
        
        setClassData(classRes.data);
        
        const teacherOptions = usersRes.data.map(teacher => ({ 
          value: teacher.id, 
          label: `${teacher.username} (${teacher.email})` 
        }));
        setTeachers(teacherOptions);
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setToastMessage('Failed to load required data.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.put(`/classes/${id}`, values);
      setToastMessage('Class updated successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        navigate('/classes');
      }, 1500);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to update class.');
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
          <p className="text-gray-600">Loading class data...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4 inline-block">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Class Not Found</h2>
          <p className="text-gray-600 mb-6">The requested class could not be found.</p>
          <Link 
            to="/classes" 
            className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
          >
            Back to Class List
          </Link>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Class</h1>
              <p className="text-gray-600">Update class information and details</p>
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
              name: classData.name || '',
              description: classData.description || '',
              capacity: classData.capacity || '',
              schedule: classData.schedule || '',
              location: classData.location || '',
              teacher_id: classData.teacher?.id || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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
                    label="Assign Teacher"
                    name="teacher_id"
                    type="select"
                    options={teachers}
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
                        Updating Class...
                      </span>
                    ) : (
                      'Update Class'
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
  );
};

export default EditClass;