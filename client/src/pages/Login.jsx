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

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password)
      setToastMessage('Login successful!')
      setToastType('success')
      setShowToast(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' })
      setToastMessage(error.message || 'Login failed. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="text-center mb-4">
          <div className="inline-block bg-blue-600 text-white rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        </div>
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          USTADI SCHOOL SYSTEM
        </h1>
        <h2 className="form-title mt-2">Sign in to your account</h2>
        
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
                placeholder="Enter your email"
                required
              />
              
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />

              {errors.submit && (
                <div className="text-red-500 text-sm text-center">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>

            </Form>
          )}
        </Formik>
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