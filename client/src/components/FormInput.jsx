import React from 'react'
import { Field, ErrorMessage } from 'formik'

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required = false,
  options = null 
}) => {
  if (type === 'select' && options) {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          as="select"
          name={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
      </div>
    )
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  )
}

export default FormInput