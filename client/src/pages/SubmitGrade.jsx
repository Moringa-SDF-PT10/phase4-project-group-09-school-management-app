import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const SubmitGrade = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [enrollmentOptions, setEnrollmentOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollmentsRes = await api.get('/enrollments/teacher/enrollments');
        
        // Format the options for better display
        const formattedOptions = enrollmentsRes.data.map(enrollment => ({
          value: enrollment.id,
          label: `${enrollment.student.username} - ${enrollment.class.name} (${enrollment.student.email})`
        }));
        
        setEnrollmentOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        setToastMessage('Could not load student enrollments.');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object({
    enrollment: Yup.string()
      .required('Please select a student enrollment'),
    grade: Yup.number()
      .min(0, 'Grade must be at least 0')
      .max(100, 'Grade cannot exceed 100')
      .required('Grade is required')
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
        enrollment_id: values.enrollment,
        score: values.grade,
        remarks: values.remarks || 'Grade submitted by teacher'
    };
    
    try {
      await api.post('/grades/', payload);
      
      setToastMessage('Grade submitted successfully!');
      setToastType('success');
      setShowToast(true);
      
      resetForm();
      
      setTimeout(() => {
        navigate('/my-teaching-classes');
      }, 1500);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Failed to submit grade. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Grade</h1>
              <p className="text-gray-600">Record student grades and assignments</p>
            </div>
            <Link
              to="/my-teaching-classes"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              ← My Classes
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <Formik
            initialValues={{
              enrollment: '',
              grade: '',
              remarks: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Select Student & Class"
                  name="enrollment"
                  type="select"
                  options={enrollmentOptions}
                  placeholder="Choose a student and class"
                  required
                  disabled={enrollmentOptions.length === 0}
                />
                
                {enrollmentOptions.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-yellow-700 text-sm">
                      No students are currently enrolled in your classes. 
                      Students must be enrolled before you can submit grades.
                    </p>
                  </div>
                )}
                
                <FormInput
                  label="Grade Score (0-100)"
                  name="grade"
                  type="number"
                  placeholder="Enter grade between 0 and 100"
                  min="0"
                  max="100"
                  required
                />

                <FormInput
                  label="Remarks (Optional)"
                  name="remarks"
                  type="textarea"
                  placeholder="Add any comments or feedback about this grade"
                  rows={3}
                />

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || enrollmentOptions.length === 0}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Grade'
                    )}
                  </button>
                  
                  <Link
                    to="/my-teaching-classes"
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors text-center flex-1"
                  >
                    Cancel
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Grading Guidelines</h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Grades should be between 0 and 100</li>
            <li>• 90-100: Excellent performance</li>
            <li>• 80-89: Good performance</li>
            <li>• 70-79: Satisfactory performance</li>
            <li>• 60-69: Needs improvement</li>
            <li>• Below 60: Unsatisfactory performance</li>
          </ul>
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

export default SubmitGrade