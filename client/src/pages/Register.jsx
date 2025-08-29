import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormInput from '../components/FormInput.jsx';
import Toast from '../components/Toast.jsx';
import { 
  AcademicCapIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  UserIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .required('Full name is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email address is required')
      .matches(/@(school\.edu|ustadi\.edu)$/i, 'Please use a valid school email address'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    role: Yup.string()
      .oneOf(['teacher', 'admin', 'student'], 'Please select a valid role')
      .required('Please select your role')
  });

  const roleOptions = [
    { value: 'teacher', label: 'Teacher', description: 'Create and manage classes, grades, and students' },
    { value: 'admin', label: 'Administrator', description: 'Manage system settings and user accounts' },
    { value: 'student', label: 'Student', description: 'Access classes, assignments, and grades' }
  ];

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = {
        id: Date.now(),
        name: values.name,
        email: values.email,
        role: values.role,
        createdAt: new Date().toISOString()
      };
      
      register(userData);
      setToastMessage('Registration successful! Welcome to Ustadi School System.');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="mx-auto bg-white rounded-2xl p-4 shadow-lg w-20 h-20 flex items-center justify-center mb-4">
            <AcademicCapIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Ustadi School Management</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create Account
          </h2>
          
          <Formik
            initialValues={{ 
              name: '', 
              email: '', 
              password: '', 
              confirmPassword: '', 
              role: '' 
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    helperText="As it appears on official records"
                    icon={UserIcon}
                    showSuccess={touched.name && !errors.name}
                  />
                  
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    helperText="Use your school email address"
                    showSuccess={touched.email && !errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <FormInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      required
                      helperText="8+ characters with uppercase, lowercase, and number"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <FormInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      required
                      helperText="Must match your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <FormInput
                  label="Account Type"
                  name="role"
                  type="select"
                  options={roleOptions}
                  required
                  helperText="Select your primary role in the system"
                  icon={UserGroupIcon}
                />

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-1 text-blue-600" />
                    Password Requirements
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={values.password.length >= 8 ? 'text-green-600' : ''}>
                      • At least 8 characters long
                    </li>
                    <li className={/[a-z]/.test(values.password) ? 'text-green-600' : ''}>
                      • One lowercase letter
                    </li>
                    <li className={/[A-Z]/.test(values.password) ? 'text-green-600' : ''}>
                      • One uppercase letter
                    </li>
                    <li className={/\d/.test(values.password) ? 'text-green-600' : ''}>
                      • One number
                    </li>
                  </ul>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm font-medium">
                      {errors.submit}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center py-3 px-4 text-base font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-200 mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleOptions.map((role) => (
            <div key={role.value} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-lg mr-2">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{role.label}</h3>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Your information is secure and encrypted. We never share your data with third parties.
          </p>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={4000}
        />
      )}
    </div>
  );
};

export default Register;