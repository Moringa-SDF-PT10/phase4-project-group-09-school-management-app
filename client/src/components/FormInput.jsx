import React from 'react';
import { Field, ErrorMessage } from 'formik';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required = false,
  options = null,
  disabled = false
}) => {
  const baseInputClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200";
  
  const stateClasses = disabled 
    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed" 
    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-200 placeholder-gray-500";
  
  const inputClasses = `${baseInputClasses} ${stateClasses}`;
  
  if (type === 'select' && options) {
    return (
      <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          as="select"
          name={name}
          disabled={disabled}
          className={inputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-2 flex items-center" />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
          as="textarea"
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={inputClasses}
        />
        <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-2 flex items-center" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-2 flex items-center" />
    </div>
  );
};

const ErrorMessageWithIcon = ({ children }) => (
  <div className="text-red-600 text-sm mt-2 flex items-center">
    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    {children}
  </div>
);

export default FormInput;