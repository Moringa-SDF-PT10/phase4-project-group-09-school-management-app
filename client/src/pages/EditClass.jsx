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
    schedule: Yup.string().required('Schedule is required'),
    location: Yup.string().required('Location is required'),
    teacher_id: Yup.number().required('Teacher is required'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, usersRes] = await Promise.all([
          api.get(`/classes/${id}`),
          api.get('/users'),
        ]);

        setClassData(classRes.data);

        const teacherUsers = usersRes.data.users.filter(
          (user) => user.role === 'teacher'
        );
        setTeachers(teacherUsers.map((t) => ({ value: t.id, label: t.name })));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class information...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Class not found</h2>
          <Link to="/classes" className="btn-primary">
            Back to Class List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
              <p className="text-gray-600 mt-2">
                Update class information and details
              </p>
            </div>
            <Link to="/classes" className="btn-secondary">
              ← Back to Class List
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="form-container">
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
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Class Name"
                  name="name"
                  placeholder="e.g., Advanced Mathematics 101"
                  required
                  helperText="Enter a descriptive name for the class"
                />
                <FormInput
                  label="Description"
                  name="description"
                  type="textarea"
                  placeholder="Brief description of the class content, objectives, and requirements..."
                  required
                  helperText="Provide detailed information about the class"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Link
                    to="/classes"
                    className="btn-secondary flex-1 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || !dirty || !isValid}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Class...
                      </div>
                    ) : (
                      'Update Class'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Warning Note */}
        <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Note
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Changing class details may affect enrolled students. Please
                  ensure all information is accurate before saving changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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

export default EditClass;
