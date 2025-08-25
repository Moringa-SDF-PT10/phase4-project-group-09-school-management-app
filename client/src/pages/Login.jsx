import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'
import { useState } from 'react'

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - in real app, this would come from API
      const userData = {
        id: 1,
        email: values.email,
        role: 'teacher', // Default role for demo
        name: 'Demo User'
      }
      
      login(userData)
      setToastMessage('Login successful!')
      setToastType('success')
      setShowToast(true)
      
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' })
      setToastMessage('Login failed. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <h2 className="form-title">Sign in to your account</h2>
        
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

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-500">
                    Sign up here
                  </Link>
                </p>
              </div>
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