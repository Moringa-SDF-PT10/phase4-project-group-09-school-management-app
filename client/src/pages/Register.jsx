import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FormInput from '../components/FormInput.jsx'
import Toast from '../components/Toast.jsx'
import { useState } from 'react'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string()
      .oneOf(['teacher', 'admin', 'student'], 'Please select a valid role')
      .required('Role is required')
  })

  const roleOptions = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Administrator' },
    { value: 'student', label: 'Student' }
  ]

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - in real app, this would come from API
      const userData = {
        id: Date.now(),
        name: values.name,
        email: values.email,
        role: values.role
      }
      
      register(userData)
      setToastMessage('Registration successful!')
      setToastType('success')
      setShowToast(true)
      
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' })
      setToastMessage('Registration failed. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <h2 className="form-title">Create your account</h2>
        
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
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                required
              />
              
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
              
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
              
              <FormInput
                label="Role"
                name="role"
                type="select"
                options={roleOptions}
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
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-500">
                    Sign in here
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

export default Register