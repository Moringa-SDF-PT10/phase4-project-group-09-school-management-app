import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const EnrollStudent = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [studentOptions, setStudentOptions] = useState([])
  const [classOptions, setClassOptions] = useState([])

  const validationSchema = Yup.object({
    student: Yup.string()
      .required('Please select a student'),
    class: Yup.string()
      .required('Please select a class'),
    enrollmentDate: Yup.date()
      .required('Enrollment date is required')
      .max(new Date(), 'Enrollment date cannot be in the future'),
    semester: Yup.string()
      .required('Please select a semester'),
    academicYear: Yup.string()
      .required('Please select an academic year')
  });


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          api.get('/users/students'),
          api.get('/classes/options')
        ]);
        setStudentOptions(studentsRes.data);
        setClassOptions(classesRes.data);
      } catch (error) {
        setToastMessage('Failed to load form options.');
        setToastType('error');
        setShowToast(true);
      }
    };
    fetchOptions();
  }, []);

  const semesterOptions = [
    { value: 'first_semester', label: 'First Semester' },
    { value: 'second_semester', label: 'Second Semester' },
    { value: 'tri_semester', label: 'Tri Semester' }
  ]

  const academicYearOptions = [
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2026-2027', label: '2026-2027' }
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      student_id: values.student,
      class_id: values.class,
      enrollment_date: values.enrollmentDate,
      semester: values.semester,
      academic_year: values.academicYear
    };

    try {
      await api.post('/enrollments/', payload);
      setToastMessage('Student enrolled successfully!');
      setToastType('success');
      setShowToast(true);
      resetForm();
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Failed to enroll student. Please try again.';
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

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
            <div className="bg-green-100 p-3 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enroll Student</h1>
              <p className="text-gray-600 mt-2">Add a student to an existing class</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={{
              student: '',
              class: '',
              enrollmentDate: '',
              semester: '',
              academicYear: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Student"
                    name="student"
                    type="select"
                    options={studentOptions}
                    required
                    helperText="Select the student to enroll"
                    icon={UserIcon}
                  />
                  
                  <FormInput
                    label="Class"
                    name="class"
                    type="select"
                    options={classOptions}
                    required
                    helperText="Select the class for enrollment"
                    icon={AcademicCapIcon}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Enrollment Date"
                    name="enrollmentDate"
                    type="date"
                    required
                    helperText="Date when student joins the class"
                    icon={CalendarIcon}
                  />
                  
                  <FormInput
                    label="Semester"
                    name="semester"
                    type="select"
                    options={semesterOptions}
                    required
                    helperText="Select the academic semester"
                  />
                  
                  <FormInput
                    label="Academic Year"
                    name="academicYear"
                    type="select"
                    options={academicYearOptions}
                    required
                    helperText="Select the academic year"
                  />
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    Enrollment Information
                  </h3>
                  <p className="text-sm text-blue-700">
                    Once enrolled, the student will have access to class materials and will appear in the class roster. 
                    You can manage enrollments from the class details page.
                  </p>
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
                        Enrolling Student...
                      </div>
                    ) : (
                      'Enroll Student'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <UserGroupIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-900">Total Students</h3>
                <p className="text-2xl font-bold text-green-700">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Active Classes</h3>
                <p className="text-2xl font-bold text-blue-700">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-900">Current Enrollment</h3>
                <p className="text-2xl font-bold text-purple-700">342</p>
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

export default EnrollStudent;