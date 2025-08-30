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
  const [assignmentTypeOptions, setAssignmentTypeOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, assignmentTypesRes] = await Promise.all([
          api.get('/enrollments/teacher/enrollments'),
          api.get('/grades/assignment-types')
        ]);
        setEnrollmentOptions(enrollmentsRes.data);
        setAssignmentTypeOptions(assignmentTypesRes.data);
      } catch (error) {
        setToastMessage('Could not load form data.');
        setToastType('error');
        setShowToast(true);
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
      .required('Grade is required'),
    assignmentType: Yup.string()
      .required('Please select an assignment type'),
    assignmentName: Yup.string()
      .min(3, 'Assignment name must be at least 3 characters')
      .max(100, 'Assignment name cannot exceed 100 characters')
      .required('Assignment name is required'),
    assignmentDate: Yup.date()
      .required('Assignment date is required')
      .max(new Date(), 'Assignment date cannot be in the future'),
    comments: Yup.string()
      .max(500, 'Comments cannot exceed 500 characters')
  });


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
        enrollment_id: values.enrollment,
        score: values.grade,
        remarks: `${values.assignmentType} - ${values.assignmentName} (${values.assignmentDate})`
    };
    try {
      await api.post('/grades/', payload);
      
      resetForm();
      
      setTimeout(() => {
        navigate('/grades');
      }, 1500);
    } catch (error) {
      setToastMessage('Failed to submit grade. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (grade) => {
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 63) return 'D';
    if (grade >= 60) return 'D-';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/grades"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Grades
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Grade</h1>
              <p className="text-gray-600 mt-2">Record student grades and assignment details</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <Formik
            initialValues={{
              enrollment: '',
              grade: '',
              assignmentType: '',
              assignmentName: '',
              assignmentDate: '',
              comments: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, dirty, isValid, values }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Student Enrollment"
                  name="enrollment"
                  type="select"
                  options={enrollmentOptions}
                  required
                  helperText="Select the student and class for grading"
                  icon={UserIcon}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInput
                      label="Grade (0-100)"
                      name="grade"
                      type="number"
                      placeholder="Enter grade (0-100)"
                      required
                      helperText="Numeric grade value"
                    />
                    {values.grade && (
                      <div className="mt-2 text-sm font-medium">
                        <span className={getGradeColor(parseFloat(values.grade))}>
                          Letter Grade: {getGradeLetter(parseFloat(values.grade))}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <FormInput
                    label="Assignment Type"
                    name="assignmentType"
                    type="select"
                    options={assignmentTypeOptions}
                    required
                    helperText="Select the type of assignment"
                    icon={DocumentTextIcon}
                  />
                </div>
                
                <FormInput
                  label="Assignment Name"
                  name="assignmentName"
                  placeholder="e.g., Midterm Exam, Chapter 5 Homework, Final Project"
                  required
                  helperText="Descriptive name for the assignment"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Assignment Date"
                    name="assignmentDate"
                    type="date"
                    required
                    helperText="Date when assignment was completed"
                    icon={CalendarIcon}
                  />
                  
                  <FormInput
                    label="Total Points"
                    name="totalPoints"
                    type="number"
                    placeholder="100"
                    helperText="Maximum possible points (optional)"
                  />
                </div>

                <FormInput
                  label="Comments (Optional)"
                  name="comments"
                  type="textarea"
                  placeholder="Add any comments or feedback for the student..."
                  helperText="Maximum 500 characters"
                  rows={3}
                />

                {values.grade && values.assignmentName && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Grade Preview</h4>
                    <div className="text-sm text-blue-700">
                      <p>
                        <strong>Student:</strong> {enrollmentOptions.find(opt => opt.value === values.enrollment)?.label.split(' - ')[0] || 'Selected student'}
                      </p>
                      <p>
                        <strong>Assignment:</strong> {values.assignmentName}
                      </p>
                      <p>
                        <strong>Grade:</strong> {values.grade}% ({getGradeLetter(parseFloat(values.grade))})
                      </p>
                      {values.comments && (
                        <p>
                          <strong>Comments:</strong> {values.comments}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    to="/grades"
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
                        Submitting Grade...
                      </div>
                    ) : (
                      'Submit Grade'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-600" />
            Grading Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Grading Scale</h4>
              <ul className="space-y-1">
                <li className="text-green-600">A: 90-100% (Excellent)</li>
                <li className="text-blue-600">B: 80-89% (Good)</li>
                <li className="text-yellow-600">C: 70-79% (Satisfactory)</li>
                <li className="text-orange-600">D: 60-69% (Needs Improvement)</li>
                <li className="text-red-600">F: 0-59% (Failing)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
              <ul className="space-y-1">
                <li>• Provide specific, constructive feedback</li>
                <li>• Grade consistently across all students</li>
                <li>• Update grades promptly after assessment</li>
                <li>• Use comments to explain grading decisions</li>
              </ul>
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

export default SubmitGrade;