import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useParams } from 'react-router-dom';
import FormInput from '../components/FormInput.jsx';
import Toast from '../components/Toast.jsx';
import { 
  ArrowLeftIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const EditClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);

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

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = {
          id: id,
          name: 'Advanced Mathematics 101',
          description: 'Advanced level mathematics course covering calculus, linear algebra, and mathematical analysis. This course is designed for students who have completed introductory mathematics courses.',
          capacity: 25,
          schedule: 'Mon/Wed/Fri 9:00 AM - 10:30 AM',
          location: 'Room 201, Science Building',
          teacher: 'john_doe',
          currentEnrollment: 22,
          createdAt: '2023-09-15',
          status: 'active'
        };
        
        setClassData(mockData);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
        setToastMessage('Failed to load class data. Please try again.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated class data:', values);
      
      setToastMessage('Class updated successfully!');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/classes');
      }, 1500);
    } catch (error) {
      setToastMessage('Failed to update class. Please try again.');
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
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-3">Class Not Found</h2>
            <p className="text-red-600 mb-4">
              The class you're trying to edit doesn't exist or you don't have permission to access it.
            </p>
            <Link
              to="/classes"
              className="btn-primary"
            >
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/classes"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Classes
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
              <p className="text-gray-600 mt-2">Update class information and manage details</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Current Class Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <UserGroupIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">
                <strong>{classData.currentEnrollment}</strong> of <strong>{classData.capacity}</strong> students enrolled
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">Created on {new Date(classData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">{classData.location}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800">{classData.schedule}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={{
              name: classData.name,
              description: classData.description,
              capacity: classData.capacity,
              schedule: classData.schedule,
              location: classData.location,
              teacher: classData.teacher
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
                
                <FormInput
                  label="Teacher"
                  name="teacher"
                  type="select"
                  options={teacherOptions}
                  required
                  helperText="Select the assigned teacher"
                />

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

        <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Changing class details may affect enrolled students. Please ensure all information is accurate before saving changes.
                </p>
              </div>
            </div>
          </div>
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

export default EditClass;