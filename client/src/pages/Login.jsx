import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password)
      setToastMessage('Login successful! Redirecting to dashboard...')
      setToastType('success')
      setShowToast(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed. Please check your credentials and try again.' })
      setToastMessage(error.message || 'Login failed. Please check your credentials.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">
              School<span className="text-orange-500">Best</span>
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-6">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
                
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                    Forgot password?
                  </Link>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm text-center">
                      {errors.submit}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-orange-500 hover:text-orange-600">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <p className="text-xs text-blue-600 mb-1">
            <strong>Admin:</strong> admin@schoolbest.com / admin123
          </p>
          <p className="text-xs text-blue-600 mb-1">
            <strong>Teacher:</strong> teacher@schoolbest.com / teacher123
          </p>
          <p className="text-xs text-blue-600">
            <strong>Student:</strong> student@schoolbest.com / student123
          </p>
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

export default Login