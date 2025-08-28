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
          api.get('/users'),
        ]);
        
        setClassData(classRes.data);
        
        const teacherUsers = usersRes.data.users.filter(user => user.role === 'teacher');
        setTeachers(teacherUsers.map(t => ({ value: t.id, label: t.name })));
        
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
              <p className="text-gray-600 mt-2">Update class information and details</p>
            </div>
            <Link to="/classes" className="btn-secondary">
              ← Back to Class List
            </Link>
          </div>
        </div>

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
                    {isSubmitting ? 'Updating Class...' : 'Update Class'}
                  </button>
                  <Link to="/classes" className="btn-secondary flex-1 text-center">
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